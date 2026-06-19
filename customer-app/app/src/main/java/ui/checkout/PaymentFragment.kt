package ui.checkout

import adapters.UpiAppsAdapter
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
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
import org.json.JSONArray
import org.json.JSONObject
import viewmodel.SharedUserViewModel

class PaymentFragment : Fragment(), com.razorpay.PaymentResultListener {
    private lateinit var sharedUserViewModel: SharedUserViewModel
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
    private lateinit var btnCardPay: Button
    private lateinit var btnCodPay: Button

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {


        val view = inflater.inflate(R.layout.fragment_payment, container, false)
        sharedUserViewModel = ViewModelProvider(requireActivity())[SharedUserViewModel::class.java]

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
        btnCardPay = view.findViewById(R.id.btnCardPay)
        btnCardPay.setOnClickListener {
            createPaymentSessionForCard()
        }

        btnCodPay = view.findViewById(R.id.btnCodPay)

        btnCodPay.setOnClickListener {
            createPaymentSessionForCod()
        }
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
                val checkoutActivity = activity as CheckoutActivity

                val orderId = checkoutActivity.orderId
                if (orderId.isNullOrEmpty()) {
                    isPaymentInProgress = false
                    Toast.makeText(requireContext(), "OrderId missing", Toast.LENGTH_SHORT).show()
                    return@launch
                }

                val response = RetrofitClient.userApi.createPaymentSession(
                    "Bearer $token",
                    CreatePaymentSessionRequest(
                        orderId = orderId,
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
// CREATE PAYMENT SESSION FOR CARD
// -----------------------------
    private fun createPaymentSessionForCard() {
        if (isPaymentInProgress) return
        isPaymentInProgress = true

        val checkoutActivity = activity as CheckoutActivity
        val address = checkoutActivity.selectedAddressForCheckout ?: run {
            isPaymentInProgress = false
            return
        }

        val token = TokenManager(requireContext()).getToken()

        lifecycleScope.launch {
            try {
                val orderId = checkoutActivity.orderId ?: return@launch

                // Card payment ke liye 'CARD' method aur 'null' package bhejein
                val response = RetrofitClient.userApi.createPaymentSession(
                    "Bearer $token",
                    CreatePaymentSessionRequest(
                        orderId = orderId,
                        addressId = address.id,
                        paymentMethod = "CARD",
                        upiAppPackage = null
                    )
                )

                if (response.isSuccessful && response.body() != null) {
                    val body = response.body()!!
                    val paymentData = body.paymentData ?: return@launch

                    checkoutActivity.currentPaymentSession = PaymentSession(
                        orderId = body.orderId ?: "",
                        paymentSessionId = body.paymentSessionId ?: "",
                        gatewayOrderId = paymentData.gatewayOrderId ?: "",
                        amount = paymentData.amount ?: 0,
                        currency = paymentData.currency ?: "INR",
                        selectedUpiPackage = "", // Card mein zarurat nahi
                        merchantUpiId = body.merchantUpiId ?: ""
                    )

                    // Card ke liye alag function call karein
                    openRazorpayCheckoutForCard(checkoutActivity.currentPaymentSession!!)

                } else {
                    isPaymentInProgress = false
                    Toast.makeText(requireContext(), "Card session failed", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                isPaymentInProgress = false
                Log.e("CARD_PAYMENT", e.message.toString())
            }
        }
    }

    private fun openRazorpayCheckoutForCard(session: PaymentSession) {
        lifecycleScope.launch {
            val key = getRazorpayKey()
            if (key.isNullOrEmpty()) {
                isPaymentInProgress = false
                Toast.makeText(requireContext(), "Razorpay key missing", Toast.LENGTH_SHORT).show()
                return@launch
            }

            // IMPORTANT: Card payment ke liye 'preload' ko remove kar dein
            // ya phir ise call mat karein taaki purani cache load na ho.

            val checkout = Checkout()
            checkout.setKeyID(key)

            try {
                val options = JSONObject()
                val email = sharedUserViewModel.userEmail.value ?: ""
                val phone = sharedUserViewModel.userPhone.value ?: ""

                options.put("name", "City Basket")
                options.put("description", "Order Payment")
                options.put("order_id", session.gatewayOrderId)
                options.put("currency", "INR")
                options.put("amount", session.amount)

                // 1. Method ko 'card' set kiya
                options.put("method", "card")

                val prefill = JSONObject()
                prefill.put("email", email)
                prefill.put("contact", phone)
                // Card ke liye method prefill zaroori nahi hai, lekin safe hai
                prefill.put("method", "card")
                options.put("prefill", prefill)

                // 2. Strict UI Configuration:
                // UPI, Netbanking, Wallet sabko hide/block kar rahe hain
                val config = JSONObject()
                val hide = JSONObject()
                hide.put("method", "upi,netbanking,wallet,emi,paylater")
                config.put("hide", hide)

                // Blocked methods ka array (Extra Safety)
                val blocked = JSONArray()
                blocked.put("upi")
                blocked.put("netbanking")
                blocked.put("wallet")
                config.put("blocked_payment_methods", blocked)

                options.put("config", config)

                // Checkout open
                checkout.open(requireActivity(), options)

            } catch (e: Exception) {
                isPaymentInProgress = false
                Log.e("RAZORPAY_CARD", e.message.toString())
            }
        }
    }
    private suspend fun getRazorpayKey(): String? {
        val token = TokenManager(requireContext()).getToken()

        return try {
            val res = RetrofitClient.userApi.getRazorpayConfig("Bearer $token")
            if (res.isSuccessful) res.body()?.razorpayKey else null
        } catch (e: Exception) {
            null
        }
    }

//    private fun openRazorpayCheckout() {
//        lifecycleScope.launch {
//            val key = getRazorpayKey()
//            if (key.isNullOrEmpty()) return@launch
//
//            val checkout = Checkout()
//            checkout.setKeyID(key)
//
//            val session = (activity as CheckoutActivity).currentPaymentSession ?: return@launch
//
//            // Aapke custom UI se select kiya hua package
//            val selectedPackage = selectedUpiApp?.packageName ?: ""
//
//            try {
//                val options = JSONObject()
//                options.put("name", "City Basket")
//                options.put("order_id", session.gatewayOrderId)
//                options.put("amount", session.amount)
//                options.put("method", "upi")
//
//                // 1. Config: Baki options hide karne ke liye
//                val config = JSONObject()
//                val hide = JSONObject()
//                hide.put("method", "card,netbanking,wallet,emi,paylater")
//                config.put("hide", hide)
//                options.put("config", config)
//
//                val external = JSONObject()
//                val apps = JSONArray()
//
//                when {
//                    selectedPackage.contains("com.google.android.apps.nbu.paisa.user") -> apps.put("gpay")
//                    selectedPackage.contains("com.phonepe.app") -> apps.put("phonepe")
//                    selectedPackage.contains("net.one97.paytm") -> apps.put("paytm")
//                    selectedPackage.contains("com.my_money.android") -> apps.put("navi")
//                    selectedPackage.contains("com.pnb.mobilebanking") -> apps.put("pnb")
//                    selectedPackage.contains("com.freecharge.android") -> apps.put("freecharge")
//                    selectedPackage.contains("com.amazon.mShop.android.shopping") -> apps.put("amazonpay")
//                    selectedPackage.contains("in.org.npci.upiapp") -> apps.put("bhim")
//                    else -> apps.put(selectedPackage)
//                }
//
//                Log.d("UPI_DEBUG", "Selected Package = $selectedPackage")
//                Log.d("UPI_DEBUG", "Apps Array = ${apps}")
//
//
//                // Agar apps array mein kuch add hua, tabhi external set karein
//                if (apps.length() > 0) {
//                    external.put("upi", apps)
//                    options.put("external", external)
//                }
//
//                checkout.open(requireActivity(), options)
//
//            } catch (e: Exception) {
//                Log.e("RAZORPAY", e.message.toString())
//            }
//        }
//    }

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

            // Custom UI se select kiya hua package name nikalenge
            val selectedPackage = selectedUpiApp?.packageName ?: ""

            if (selectedPackage.isEmpty()) {
                isPaymentInProgress = false
                Toast.makeText(requireContext(), "Please select a UPI app", Toast.LENGTH_SHORT).show()
                return@launch
            }

            try {
                val options = JSONObject()
                val email = sharedUserViewModel.userEmail.value ?: ""
                val phone = sharedUserViewModel.userPhone.value ?: ""

                options.put("name", "City Basket")
                options.put("description", "Order Payment")
                options.put("order_id", session.gatewayOrderId)
                options.put("currency", "INR")
                options.put("amount", session.amount)

                // 1. Method ko strict UPI set kiya
                options.put("method", "upi")

                // 2. MAGIC LINE: Ye line Razorpay ko batati hai ki direct isi app ko open karo
                options.put("app", selectedPackage)

                val prefill = JSONObject()
                prefill.put("email", email)
                prefill.put("contact", phone)
                prefill.put("method", "upi")
                options.put("prefill", prefill)

                // 3. Dusre saare payment methods hide karne ke liye config
                val config = JSONObject()
                val hide = JSONObject()
                hide.put("method", "card,netbanking,wallet,emi,paylater")
                config.put("hide", hide)
                options.put("config", config)

                // 4. Dynamic External Tracker mapping taaki Razorpay handle kar sake
                val external = JSONObject()
                val apps = JSONArray()

                // Package name ke hisaab se Razorpay ke predefined keys ko map kiya
                when {
                    selectedPackage.contains("com.google.android.apps.nbu.paisa.user") -> apps.put("gpay")
                    selectedPackage.contains("com.phonepe.app") -> apps.put("phonepe")
                    selectedPackage.contains("net.one97.paytm") -> apps.put("paytm")
                    selectedPackage.contains("in.org.npci.upiapp") -> apps.put("bhim")
                    else -> apps.put(selectedPackage) // Agar koi aur banking app hai toh package name direct pass hoga
                }

                external.put("upi", apps)
                options.put("external", external)

                // Checkout open karenge, ye direct target app ko trigger karega
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
        val session = (activity as CheckoutActivity).currentPaymentSession
        navigateToOrderSuccess(session?.orderId ?: "")
    }

    override fun onPaymentError(code: Int, response: String?) {
        isPaymentInProgress = false
        Toast.makeText(requireContext(), "Payment Failed", Toast.LENGTH_SHORT).show()
    }

    override fun onDestroyView() {
        pollingJob?.cancel()
        super.onDestroyView()
    }

    private fun createPaymentSessionForCod() {
        if (isPaymentInProgress) return
        isPaymentInProgress = true

        val checkoutActivity = activity as CheckoutActivity
        val address = checkoutActivity.selectedAddressForCheckout ?: run {
            isPaymentInProgress = false
            return
        }

        val token = TokenManager(requireContext()).getToken()

        lifecycleScope.launch {
            try {
                val orderId = checkoutActivity.orderId ?: return@launch

                // COD ke liye 'COD' method bhejein
                val response = RetrofitClient.userApi.createPaymentSession(
                    "Bearer $token",
                    CreatePaymentSessionRequest(
                        orderId = orderId,
                        addressId = address.id,
                        paymentMethod = "COD",
                        upiAppPackage = null
                    )
                )

                if (response.isSuccessful && response.body() != null) {
                    // Success: Order confirm ho gaya
                    isPaymentInProgress = false
                    Toast.makeText(requireContext(), "Order Placed Successfully!", Toast.LENGTH_SHORT).show()

                    val orderId = (activity as CheckoutActivity).orderId ?: ""
                    navigateToOrderSuccess(orderId)
                } else {
                    isPaymentInProgress = false
                    Toast.makeText(requireContext(), "COD Order failed", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                isPaymentInProgress = false
                Log.e("COD_PAYMENT", e.message.toString())
            }
        }
    }

    private fun navigateToOrderSuccess(orderId: String) {
        val intent = Intent(requireContext(), OrderSuccessActivity::class.java)
        // Agar OrderSuccessActivity ko orderId ki zaroorat hai:
        intent.putExtra("ORDER_ID", orderId)
        // Back stack clear karne ke liye flags
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        startActivity(intent)
        requireActivity().finish()
    }
}
