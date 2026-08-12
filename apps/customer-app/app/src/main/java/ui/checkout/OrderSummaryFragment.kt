package ui.checkout

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.ecommerce.citybasket.R

class OrderSummaryFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_order_summary, container, false)

        val txtSummaryAddress = view.findViewById<TextView>(R.id.txtSummaryAddress)
        val txtItemsTotal = view.findViewById<TextView>(R.id.txtItemsTotal)
        val txtFinalPayable = view.findViewById<TextView>(R.id.txtFinalPayable)
        val rvSummaryProducts = view.findViewById<RecyclerView>(R.id.rvSummaryProducts)
        val btnContinue = view.findViewById<Button>(R.id.btnContinueToPayment)

        // Activity casting instantiation references
        val checkoutActivity = activity as? CheckoutActivity
        val selectedAddress = checkoutActivity?.selectedAddressForCheckout
        val totalAmount = checkoutActivity?.totalCartAmount ?: 0.0

        // 🔥 FIXED: Isne direct activity se explicit CartItemResponse type map kar liya hai
        val productsList = checkoutActivity?.checkoutCartItems ?: emptyList()

        // 1. Selected Shipping Address Injection Rendering
        if (selectedAddress != null) {
            txtSummaryAddress.text = "${selectedAddress.fullName}\n${selectedAddress.addressLine1}, ${selectedAddress.city} - ${selectedAddress.pincode}\nPhone: ${selectedAddress.phone}"
        } else {
            txtSummaryAddress.text = "No address selected! Please navigate back."
        }

        // 2. Pricing Overview Summary Metrics Translation
        txtItemsTotal.text = "₹${String.format("%.2f", totalAmount)}"
        txtFinalPayable.text = "₹${String.format("%.2f", totalAmount)}"

        // 3. RecyclerView Flipkart style Product mapping adapters binding
        rvSummaryProducts.layoutManager = LinearLayoutManager(requireContext())
        rvSummaryProducts.adapter = SummaryProductAdapter(productsList)

        // Click handler pipeline forwarding sequence
        btnContinue.setOnClickListener {
            checkoutActivity?.loadFragment(PaymentFragment())
        }

        return view
    }
}