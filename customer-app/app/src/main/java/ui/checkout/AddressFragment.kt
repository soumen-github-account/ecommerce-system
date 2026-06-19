package ui.checkout

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.ProgressBar
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.ecommerce.citybasket.R
import data.remote.api.RetrofitClient
import kotlinx.coroutines.launch
import utils.TokenManager

class AddressFragment : Fragment() {

    private lateinit var rvCheckoutAddresses: RecyclerView
    private lateinit var btnDeliverHere: Button
    private lateinit var addressLoader: ProgressBar
    private lateinit var tokenManager: TokenManager

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_address, container, false)

        tokenManager = TokenManager(requireContext())
        rvCheckoutAddresses = view.findViewById(R.id.rvCheckoutAddresses)
        btnDeliverHere = view.findViewById(R.id.btnDeliverHere)
        addressLoader = view.findViewById(R.id.addressLoader)

        rvCheckoutAddresses.layoutManager = LinearLayoutManager(requireContext())

        loadUserAddresses()

//        btnDeliverHere.setOnClickListener {
//            val parentActivity = activity as? CheckoutActivity
//            if (parentActivity?.selectedAddressForCheckout != null) {
//                // Next step flow sequence mapping call
//                parentActivity.loadFragment(OrderSummaryFragment())
//            } else {
//                Toast.makeText(requireContext(), "Please select an address!", Toast.LENGTH_SHORT).show()
//            }
//        }
        btnDeliverHere.setOnClickListener {

            val parentActivity = activity as? CheckoutActivity ?: return@setOnClickListener

            if (parentActivity.selectedAddressForCheckout == null) {
                Toast.makeText(requireContext(), "Please select address!", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            parentActivity.createOrderAndContinue { orderId ->

                parentActivity.loadFragment(OrderSummaryFragment())
            }
        }
        return view
    }

    private fun loadUserAddresses() {
        val token = tokenManager.getToken() ?: return
        addressLoader.visibility = View.VISIBLE

        lifecycleScope.launch {
            try {
                val response = RetrofitClient.userApi.getUserAddresses("Bearer $token")
                addressLoader.visibility = View.GONE
                if (response.isSuccessful && response.body() != null) {
                    val addresses = response.body()!!.addresses
                    if (addresses.isNotEmpty()) {
                        rvCheckoutAddresses.adapter = CheckoutAddressAdapter(addresses) { address ->
                            // Activity state me temporary lock kardo selection object
                            (activity as? CheckoutActivity)?.selectedAddressForCheckout = address
                        }
                    } else {
                        Toast.makeText(requireContext(), "No saved addresses found!", Toast.LENGTH_SHORT).show()
                    }
                }
            } catch (e: Exception) {
                addressLoader.visibility = View.GONE
                e.printStackTrace()
            }
        }
    }
}