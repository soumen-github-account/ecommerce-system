package ui.checkout

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import com.ecommerce.citybasket.R

class OrderSummaryFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_order_summary, container, false)

        val btnContinue = view.findViewById<Button>(R.id.btnContinueToPayment)
        btnContinue.setOnClickListener {
            val checkoutActivity = activity as? CheckoutActivity
            // Bas next fragment load karo, stepper aur backstack automatic handle hoga
            checkoutActivity?.loadFragment(PaymentFragment())
        }

        return view
    }
}