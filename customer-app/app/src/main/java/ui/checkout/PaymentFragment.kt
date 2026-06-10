package ui.checkout

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import androidx.fragment.app.Fragment
import com.ecommerce.citybasket.R

class PaymentFragment : Fragment() {
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_payment, container, false)

        val btnPlaceOrder = view.findViewById<Button>(R.id.btnPlaceOrder)
        btnPlaceOrder.setOnClickListener {
            // 1. OrderSuccessActivity open karne ke liye intent banao
            val intent = Intent(requireContext(), OrderSuccessActivity::class.java)
            startActivity(intent)

            // 2. CheckoutActivity ko finish kar do taaki back karne par user wapas payment page par na aaye
            activity?.finish()
        }

        return view
    }
}