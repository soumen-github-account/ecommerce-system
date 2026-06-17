package ui.checkout

import adapters.UpiAppsAdapter
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.ecommerce.citybasket.R
import com.razorpay.Checkout
import data.model.payment.PaymentSession
import data.model.upi.UpiApp
import data.remote.api.RetrofitClient
import data.remote.request.CreatePaymentSessionRequest
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import utils.TokenManager
import kotlinx.coroutines.Job
import org.json.JSONObject

class PaymentFragment : Fragment(), com.razorpay.PaymentResultListener {

    private lateinit var layoutUpiHeader: LinearLayout
    private lateinit var layoutCard: LinearLayout
    private lateinit var layoutCod: LinearLayout

    private lateinit var layoutCardContent: LinearLayout
    private lateinit var layoutCodContent: LinearLayout

    private lateinit var imgUpiArrow: ImageView
    private lateinit var imgCardArrow: ImageView
    private lateinit var imgCodArrow: ImageView

    private lateinit var rvUpiApps: RecyclerView

    private var selectedUpiApp: UpiApp? = null
    private var isPaymentInProgress = false
    private var pollingJob: Job? = null

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {

        val view = inflater.inflate(R.layout.fragment_payment, container, false)

        initViews(view)
        loadInstalledUpiApps()
        setupExpandCollapse()

        return view
    }

    private fun initViews(view: View) {
        layoutUpiHeader = view.findViewById(R.id.layoutUpiHeader)
        layoutCard = view.findViewById(R.id.layoutCard)
        layoutCod = view.findViewById(R.id.layoutCod)

        layoutCardContent = view.findViewById(R.id.layoutCardContent)
        layoutCodContent = view.findViewById(R.id.layoutCodContent)

        imgUpiArrow = view.findViewById(R.id.imgUpiArrow)
        imgCardArrow = view.findViewById(R.id.imgCardArrow)
        imgCodArrow = view.findViewById(R.id.imgCodArrow)

        rvUpiApps = view.findViewById(R.id.rvUpiApps)
        rvUpiApps.layoutManager = LinearLayoutManager(requireContext())
    }

    private fun setupExpandCollapse() {

        layoutUpiHeader.setOnClickListener {
            rvUpiApps.visibility = View.VISIBLE
            layoutCardContent.visibility = View.GONE
            layoutCodContent.visibility = View.GONE
        }

        layoutCard.setOnClickListener {
            rvUpiApps.visibility = View.GONE
            layoutCardContent.visibility = View.VISIBLE
            layoutCodContent.visibility = View.GONE
        }

        layoutCod.setOnClickListener {
            rvUpiApps.visibility = View.GONE
            layoutCardContent.visibility = View.GONE
            layoutCodContent.visibility = View.VISIBLE
        }
    }

    private fun loadInstalledUpiApps() {
        val apps = getInstalledUpiApps()

        rvUpiApps.adapter = UpiAppsAdapter(
            apps,
            onAppSelected = { selectedUpiApp = it },
            onPayClicked = {
                selectedUpiApp = it
                createPaymentSession()
            }
        )
    }

    private fun getInstalledUpiApps(): MutableList<UpiApp> {
        val apps = mutableListOf<UpiApp>()

        val intent = Intent(Intent.ACTION_VIEW)
        intent.data = Uri.parse("upi://pay")

        val activities = requireContext()
            .packageManager
            .queryIntentActivities(intent, 0)

        activities.forEach {
            apps.add(
                UpiApp(
                    appName = it.loadLabel(requireContext().packageManager).toString(),
                    packageName = it.activityInfo.packageName,
                    icon = it.loadIcon(requireContext().packageManager)
                )
            )
        }

        return apps
    }

    // -----------------------------
    // CREATE PAYMENT SESSION
    // -----------------------------
    private fun createPaymentSession() {

        if (isPaymentInProgress) return
        isPaymentInProgress = true

        val app = selectedUpiApp ?: run {
            isPaymentInProgress = false
            return
        }

        val checkoutActivity = activity as CheckoutActivity
        val address = checkoutActivity.selectedAddressForCheckout ?: run {
            isPaymentInProgress = false
            return
        }

        val token = TokenManager(requireContext()).getToken()

        lifecycleScope.launch {

            try {

                val response = RetrofitClient.userApi.createPaymentSession(
                    "Bearer $token",
                    CreatePaymentSessionRequest(
                        addressId = address.id,
                        paymentMethod = "UPI",
                        upiAppPackage = app.packageName
                    )
                )

                if (response.isSuccessful && response.body() != null) {

                    val body = response.body()!!

                    val paymentData = body.paymentData ?: run {
                        isPaymentInProgress = false
                        Toast.makeText(requireContext(), "Payment data missing", Toast.LENGTH_SHORT).show()
                        return@launch
                    }

                    checkoutActivity.currentPaymentSession = PaymentSession(
                        orderId = body.orderId ?: "",
                        paymentSessionId = body.paymentSessionId ?: "",
                        gatewayOrderId = paymentData.gatewayOrderId ?: "",
                        amount = paymentData.amount ?: 0,
                        currency = paymentData.currency ?: "INR",
                        selectedUpiPackage = app.packageName,
                        merchantUpiId = body.merchantUpiId ?: ""
                    )

                    openRazorpayCheckout()

                } else {
                    isPaymentInProgress = false
                    Toast.makeText(requireContext(), "Order create failed", Toast.LENGTH_SHORT).show()
                    Log.e("PAYMENT", response.errorBody()?.string().toString())
                }

            } catch (e: Exception) {
                isPaymentInProgress = false
                Log.e("PAYMENT", e.message.toString())
            }
        }
    }

    // -----------------------------
    // GET RAZORPAY KEY FROM BACKEND
    // -----------------------------
    private suspend fun getRazorpayKey(): String? {
        val token = TokenManager(requireContext()).getToken()

        return try {
            val res = RetrofitClient.userApi.getRazorpayConfig("Bearer $token")
            if (res.isSuccessful) res.body()?.razorpayKey else null
        } catch (e: Exception) {
            null
        }
    }

    // -----------------------------
    // OPEN RAZORPAY
    // -----------------------------
    private fun openRazorpayCheckout() {

        lifecycleScope.launch {

            val key = getRazorpayKey()

            if (key.isNullOrEmpty()) {
                isPaymentInProgress = false
                Toast.makeText(requireContext(), "Razorpay key missing", Toast.LENGTH_SHORT).show()
                return@launch
            }

            Checkout.preload(requireContext())

            val checkout = Checkout()
            checkout.setKeyID(key)

            val session = (activity as CheckoutActivity).currentPaymentSession ?: return@launch

            try {
                val options = JSONObject()

                options.put("name", "City Basket")
                options.put("description", "Order Payment")
                options.put("order_id", session.gatewayOrderId)
                options.put("currency", "INR")

                // IMPORTANT: paise me hota hai Razorpay
                options.put("amount", session.amount)

                val prefill = JSONObject()
                prefill.put("email", "test@example.com")
                prefill.put("contact", "9999999999")

                options.put("prefill", prefill)

                checkout.open(requireActivity(), options)

            } catch (e: Exception) {
                isPaymentInProgress = false
                Log.e("RAZORPAY", e.message.toString())
            }
        }
    }

    override fun onPaymentSuccess(razorpayPaymentId: String?) {
        isPaymentInProgress = false
        Toast.makeText(requireContext(), "Payment Success", Toast.LENGTH_SHORT).show()
    }

    override fun onPaymentError(code: Int, response: String?) {
        isPaymentInProgress = false
        Toast.makeText(requireContext(), "Payment Failed", Toast.LENGTH_SHORT).show()
    }

    override fun onDestroyView() {
        pollingJob?.cancel()
        super.onDestroyView()
    }
}
