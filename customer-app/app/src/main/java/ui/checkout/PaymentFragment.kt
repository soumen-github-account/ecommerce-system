package ui.checkout

import adapters.UpiAppsAdapter
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.ecommerce.citybasket.R
import data.model.payment.PaymentSession
import data.model.upi.UpiApp
import data.remote.api.RetrofitClient
import data.remote.request.CreatePaymentSessionRequest
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import utils.TokenManager
import kotlinx.coroutines.Job


class PaymentFragment : Fragment() {

    private lateinit var rvUpiApps: RecyclerView

    private var selectedUpiApp: UpiApp? = null
    private var isPaymentInProgress = false
    private var pollingJob: Job? = null

    private val upiLauncher =
        registerForActivityResult(
            ActivityResultContracts.StartActivityForResult()
        ) {
            startPolling()
        }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {

        val view =
            inflater.inflate(
                R.layout.fragment_payment,
                container,
                false
            )

        initViews(view)

        loadInstalledUpiApps()

        return view
    }

    private fun initViews(view: View) {

        rvUpiApps =
            view.findViewById(
                R.id.rvUpiApps
            )

        rvUpiApps.layoutManager =
            LinearLayoutManager(
                requireContext()
            )
    }

    private fun loadInstalledUpiApps() {

        val apps =
            getInstalledUpiApps()

        rvUpiApps.adapter =
            UpiAppsAdapter(

                apps,

                onAppSelected = {

                    selectedUpiApp = it
                },

                onPayClicked = {

                    selectedUpiApp = it

                    createPaymentSession()
                }
            )
    }

    private fun getInstalledUpiApps():
            MutableList<UpiApp> {

        val apps =
            mutableListOf<UpiApp>()

        val intent =
            Intent(Intent.ACTION_VIEW)

        intent.data =
            Uri.parse("upi://pay")

        val activities =
            requireContext()
                .packageManager
                .queryIntentActivities(
                    intent,
                    0
                )

        activities.forEach {

            apps.add(

                UpiApp(

                    appName =
                        it.loadLabel(
                            requireContext()
                                .packageManager
                        ).toString(),

                    packageName =
                        it.activityInfo.packageName,

                    icon =
                        it.loadIcon(
                            requireContext()
                                .packageManager
                        )
                )
            )
        }

        return apps
    }

    private fun createPaymentSession() {
        Log.d(
            "API_TEST",
            "CREATE PAYMENT SESSION CALLED"
        )

        Log.d(
            "PAY_CLICK",
            "isPaymentInProgress = $isPaymentInProgress"
        )
        if (isPaymentInProgress) {
            return
        }
        isPaymentInProgress = true

        val app = selectedUpiApp

        if (app == null) {

            isPaymentInProgress = false

            return
        }

        val checkout =
            activity as CheckoutActivity

        val address =
            checkout.selectedAddressForCheckout

        if (address == null) {

            isPaymentInProgress = false

            return
        }

        val token =
            TokenManager(
                requireContext()
            ).getToken()

        lifecycleScope.launch {

            try {

                val response =
                    RetrofitClient
                        .userApi
                        .createPaymentSession(

                            "Bearer $token",

                            CreatePaymentSessionRequest(

                                addressId =
                                    address.id,

                                paymentMethod =
                                    "UPI",

                                upiAppPackage =
                                    app.packageName
                            )
                        )

                if (
                    response.isSuccessful &&
                    response.body() != null
                ) {

                    val body = response.body()!!

                    Log.d(
                        "PAYMENT_RESPONSE",
                        body.toString()
                    )

                    Log.d(
                        "PAYMENT_DEBUG",
                        "paymentData = ${body.paymentData}"
                    )

                    Log.d(
                        "PAYMENT_DEBUG",
                        "merchantUpiId = ${body.merchantUpiId}"
                    )

                    Log.d(
                        "PAYMENT_DEBUG",
                        "paymentMethod = ${body.paymentMethod}"
                    )

                    Log.d(
                        "PAYMENT_DEBUG",
                        "razorpayKey = ${body.razorpayKey}"
                    )

                    val paymentData = body.paymentData

                    if (paymentData == null) {

                        isPaymentInProgress = false

                        Toast.makeText(
                            requireContext(),
                            "Payment data missing",
                            Toast.LENGTH_LONG
                        ).show()

                        return@launch
                    }

                    checkout.currentPaymentSession =

                        PaymentSession(

                            orderId = body.orderId ?: "",

                            paymentSessionId =
                                body.paymentSessionId ?: "",

                            gatewayOrderId =
                                paymentData.gatewayOrderId ?: "",

                            amount =
                                paymentData.amount ?: 0,

                            currency =
                                paymentData.currency ?: "INR",

                            selectedUpiPackage =
                                app.packageName,

                            merchantUpiId =
                                body.merchantUpiId ?: ""
                        )

                    launchSelectedUpiApp()

                } else {
                    isPaymentInProgress = false

                    Toast.makeText(
                        requireContext(),
                        "Unable to create payment session",
                        Toast.LENGTH_LONG
                    ).show()

                    Log.e(
                        "PAYMENT_SESSION",
                        "CODE = ${response.code()}"
                    )

                    Log.e(
                        "PAYMENT_SESSION",
                        "ERROR = ${response.errorBody()?.string()}"
                    )

                    Toast.makeText(
                        requireContext(),
                        "CODE = ${response.code()}",
                        Toast.LENGTH_LONG
                    ).show()
                }

            } catch (e: Exception) {
                isPaymentInProgress = false

                Log.e(
                    "PAYMENT_SESSION",
                    e.toString()
                )

                e.printStackTrace()
            }
        }
    }

    private fun launchSelectedUpiApp() {

        val app =
            selectedUpiApp
                ?: return

        val checkout =
            activity as CheckoutActivity

        val session =
            checkout.currentPaymentSession
                ?: return

        val amount =
            session.amount / 100.0

        val upiUri =
            Uri.Builder()
                .scheme("upi")
                .authority("pay")
                .appendQueryParameter(
                    "pa",
                    session.merchantUpiId
                )
                .appendQueryParameter(
                    "pn",
                    "City Basket"
                )
                .appendQueryParameter(
                    "tn",
                    session.orderId
                )
                .appendQueryParameter(
                    "am",
                    amount.toString()
                )
                .appendQueryParameter(
                    "cu",
                    "INR"
                )
                .build()

        Log.d(
            "UPI_DEBUG",
            "UPI = ${session.merchantUpiId}"
        )

        Log.d(
            "UPI_DEBUG",
            upiUri.toString()
        )

        val intent =
            Intent(
                Intent.ACTION_VIEW,
                upiUri
            )

        intent.setPackage(
            app.packageName
        )

        try {

            upiLauncher.launch(
                intent
            )

        } catch (e: Exception) {
            isPaymentInProgress = false

            Toast.makeText(
                requireContext(),
                "Unable To Open ${app.appName}",
                Toast.LENGTH_LONG
            ).show()
        }
    }

    private fun startPolling() {
        pollingJob?.cancel()

        val checkout =
            activity as CheckoutActivity

        val session =
            checkout.currentPaymentSession
                ?: return

        val token =
            TokenManager(
                requireContext()
            ).getToken()

        pollingJob = lifecycleScope.launch {

            repeat(20) {

                delay(3000)

                try {

                    val response =
                        RetrofitClient
                            .userApi
                            .getPaymentStatus(

                                "Bearer $token",

                                session.paymentSessionId
                            )

                    if (
                        response.isSuccessful &&
                        response.body() != null
                    ) {

                        val body =
                            response.body()!!

                        Log.d(
                            "PAYMENT_STATUS",
                            body.status
                        )

                        when (
                            body.status
                        ) {

                            "SUCCESS" -> {

                                openSuccessScreen()

                                return@launch
                            }

                            "EXPIRED" -> {

                                isPaymentInProgress = false

                                Toast.makeText(
                                    requireContext(),
                                    "Payment Session Expired",
                                    Toast.LENGTH_LONG
                                ).show()

                                return@launch
                            }

                            "FAILED" -> {
                                isPaymentInProgress = false
                                pollingJob?.cancel()

                                Toast.makeText(
                                    requireContext(),
                                    "Payment Failed",
                                    Toast.LENGTH_LONG
                                ).show()

                                return@launch
                            }
                        }
                    }

                } catch (e: Exception) {

                    e.printStackTrace()
                }
            }

            isPaymentInProgress = false
            pollingJob?.cancel()

            Toast.makeText(
                requireContext(),
                "Payment Verification Timeout",
                Toast.LENGTH_LONG
            ).show()
        }
    }

    private fun openSuccessScreen() {
        isPaymentInProgress = false
        pollingJob?.cancel()

        Toast.makeText(
            requireContext(),
            "Order Confirmed 🎉",
            Toast.LENGTH_LONG
        ).show()
    }

    override fun onDestroyView() {

        pollingJob?.cancel()

        super.onDestroyView()
    }
}