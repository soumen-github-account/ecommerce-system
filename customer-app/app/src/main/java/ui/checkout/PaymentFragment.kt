package ui.checkout

import androidx.activity.result.contract.ActivityResultContracts
import adapters.UpiAppsAdapter
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.ecommerce.citybasket.R
import data.model.upi.UpiApp

import android.util.Log
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import data.remote.request.CreateOrderRequest
import data.remote.api.RetrofitClient
import data.remote.request.VerifyPaymentRequest
import kotlinx.coroutines.launch
import utils.TokenManager


class PaymentFragment : Fragment() {

    private lateinit var rvUpiApps: RecyclerView
    // btnPayNow wali line remove kar do

    private var selectedUpiApp: UpiApp? = null
    private var razorpayOrderId: String? = null

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        val view = inflater.inflate(R.layout.fragment_payment, container, false)

        initViews(view)
        // setupPayButton() ko yaha se hata do
        loadInstalledUpiApps()

        return view
    }

    private fun initViews(view: View) {
        rvUpiApps = view.findViewById(R.id.rvUpiApps)
        rvUpiApps.layoutManager = LinearLayoutManager(requireContext())
    }

    private fun loadInstalledUpiApps() {
        val apps = getInstalledUpiApps()
        rvUpiApps.adapter = UpiAppsAdapter(
            apps,
            onAppSelected = { selectedApp ->
                selectedUpiApp = selectedApp
            },

            onPayClicked = { selectedApp ->

                selectedUpiApp = selectedApp

                Log.d(
                    "PAYMENT",
                    "Selected App = ${selectedApp.appName}"
                )

                createRazorpayOrder()
            }
        )
    }

    private fun getInstalledUpiApps(): MutableList<UpiApp> {

        val apps = mutableListOf<UpiApp>()

        val intent = Intent(Intent.ACTION_VIEW)
        intent.data = Uri.parse("upi://pay")

        val activities =
            requireContext()
                .packageManager
                .queryIntentActivities(intent, 0)

        activities.forEach {

            apps.add(
                UpiApp(
                    appName = it.loadLabel(
                        requireContext().packageManager
                    ).toString(),

                    packageName =
                        it.activityInfo.packageName,

                    icon =
                        it.loadIcon(
                            requireContext().packageManager
                        )
                )
            )
        }

        return apps
    }

    private fun createRazorpayOrder() {

        val checkoutActivity =
            activity as CheckoutActivity

        val totalAmount =
            checkoutActivity.totalCartAmount

        val token =
            TokenManager(requireContext())
                .getToken()

        lifecycleScope.launch {

            try {

                val response =
                    RetrofitClient.userApi.createOrder(

                        "Bearer $token",

                        CreateOrderRequest(
                            amount = totalAmount
                        )
                    )

                if (
                    response.isSuccessful &&
                    response.body() != null
                ) {

                    val order =
                        response.body()!!

                    Log.d(
                        "PAYMENT_FLOW",
                        "ORDER_ID = ${order.orderId}"
                    )

                    razorpayOrderId = order.orderId

                    launchSelectedUpiApp(
                        order.orderId
                    )

                    Toast.makeText(
                        requireContext(),
                        "Order Created",
                        Toast.LENGTH_SHORT
                    ).show()

                } else {

                    Toast.makeText(
                        requireContext(),
                        "Failed To Create Order",
                        Toast.LENGTH_SHORT
                    ).show()
                }

            } catch (e: Exception) {

                e.printStackTrace()

                Toast.makeText(
                    requireContext(),
                    e.message,
                    Toast.LENGTH_SHORT
                ).show()
            }
        }
    }

    private fun launchSelectedUpiApp(
        orderId: String
    ) {

        val selectedApp = selectedUpiApp ?: return

        val checkoutActivity = activity as CheckoutActivity

        val amount = checkoutActivity.totalCartAmount

        val uri = Uri.parse(

            "upi://pay" +
                    "?pa=7584818990@nyes" +
                    "&pn=City Basket" +
                    "&tr=$orderId" +
                    "&tn=City Basket Order" +
                    "&am=$amount" +
                    "&cu=INR"
        )

        val intent = Intent(
            Intent.ACTION_VIEW,
            uri
        )

        intent.setPackage(
            selectedApp.packageName
        )

        try {

            upiPaymentLauncher.launch(intent)

        } catch (e: Exception) {

            Toast.makeText(
                requireContext(),
                "${selectedApp.appName} not available",
                Toast.LENGTH_SHORT
            ).show()
        }
    }

    private val upiPaymentLauncher =

        registerForActivityResult(
            ActivityResultContracts.StartActivityForResult()
        ) { result ->

            if (result.resultCode == AppCompatActivity.RESULT_OK) {

                val data = result.data

                val response = data?.getStringExtra("response")

                android.util.Log.d(
                    "UPI_RESPONSE",
                    response ?: "NULL"
                )

                if (!response.isNullOrEmpty()) {

                    verifyPayment(
                        response
                    )
                }

            } else {

                android.util.Log.d(
                    "UPI_RESPONSE",
                    "CANCELLED"
                )
            }
        }

    private fun verifyPayment(
        upiResponse: String
    ) {

        val orderId =
            razorpayOrderId ?: return

        val token =
            TokenManager(requireContext())
                .getToken()

        lifecycleScope.launch {

            try {

                val response =

                    RetrofitClient
                        .userApi
                        .verifyPayment(

                            "Bearer $token",

                            VerifyPaymentRequest(
                                razorpayOrderId = orderId,
                                upiResponse = upiResponse
                            )
                        )

                if (
                    response.isSuccessful &&
                    response.body() != null
                ) {

                    val result =
                        response.body()!!

                    if (
                        result.paymentVerified
                    ) {

                        Toast.makeText(
                            requireContext(),
                            "Payment Verified",
                            Toast.LENGTH_LONG
                        ).show()

                    } else {

                        Toast.makeText(
                            requireContext(),
                            "Payment Failed",
                            Toast.LENGTH_LONG
                        ).show()
                    }
                }

            } catch (e: Exception) {

                e.printStackTrace()
            }
        }
    }
}