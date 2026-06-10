package ui.checkout

import android.graphics.Color
import android.os.Bundle
import android.view.View
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import com.ecommerce.citybasket.R

class CheckoutActivity : AppCompatActivity() {

    private lateinit var tvStepTitle: TextView
    private lateinit var step1: TextView
    private lateinit var step2: TextView
    private lateinit var step3: TextView
    private lateinit var line1: View
    private lateinit var line2: View

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_checkout)

        tvStepTitle = findViewById(R.id.tvStepTitle)
        step1 = findViewById(R.id.step1)
        step2 = findViewById(R.id.step2)
        step3 = findViewById(R.id.step3)
        line1 = findViewById(R.id.line1)
        line2 = findViewById(R.id.line2)

        if (savedInstanceState == null) {
            // Shuruat me Step 1 load karo bina backstack ke
            updateStepperUI(1, "Address Confirmation")
            supportFragmentManager.beginTransaction()
                .replace(R.id.checkoutContainer, AddressFragment())
                .commit()
        }

        // Jab bhi Fragment change hoga (Back press se ya normal), ye listener stepper automatically sahi kar dega
        supportFragmentManager.addOnBackStackChangedListener {
            val currentFragment = supportFragmentManager.findFragmentById(R.id.checkoutContainer)
            when (currentFragment) {
                is AddressFragment -> updateStepperUI(1, "Address Confirmation")
                is OrderSummaryFragment -> updateStepperUI(2, "Order Summary")
                is PaymentFragment -> updateStepperUI(3, "Payment Options")
            }
        }
    }

    // Naya Fragment load karne ke liye proper transaction function
    fun loadFragment(fragment: Fragment) {
        supportFragmentManager.beginTransaction()
            .replace(R.id.checkoutContainer, fragment)
            .addToBackStack(null) // 🔥 Isse back button step-by-step kaam karega
            .commit()
    }

    // 100% Fixed Stepper Color Logic
    private fun updateStepperUI(step: Int, title: String) {
        tvStepTitle.text = title

        val colorBlack = Color.parseColor("#121212")
        val colorGrey = Color.parseColor("#E0E0E0")

        when (step) {
            1 -> {
                // Step 1 Active, baaki sab Inactive
                step1.setBackgroundResource(R.drawable.bg_step_active)
                step1.setTextColor(Color.WHITE)
                line1.setBackgroundColor(colorGrey)

                step2.setBackgroundResource(R.drawable.bg_step_inactive)
                step2.setTextColor(colorBlack)
                line2.setBackgroundColor(colorGrey)

                step3.setBackgroundResource(R.drawable.bg_step_inactive)
                step3.setTextColor(colorBlack)
            }
            2 -> {
                // Step 1 aur 2 Active, Step 3 Inactive
                step1.setBackgroundResource(R.drawable.bg_step_active)
                step1.setTextColor(Color.WHITE)
                line1.setBackgroundColor(colorBlack)

                step2.setBackgroundResource(R.drawable.bg_step_active)
                step2.setTextColor(Color.WHITE)
                line2.setBackgroundColor(colorGrey)

                step3.setBackgroundResource(R.drawable.bg_step_inactive)
                step3.setTextColor(colorBlack)
            }
            3 -> {
                // Saare Steps Active
                step1.setBackgroundResource(R.drawable.bg_step_active)
                step1.setTextColor(Color.WHITE)
                line1.setBackgroundColor(colorBlack)

                step2.setBackgroundResource(R.drawable.bg_step_active)
                step2.setTextColor(Color.WHITE)
                line2.setBackgroundColor(colorBlack)

                step3.setBackgroundResource(R.drawable.bg_step_active)
                step3.setTextColor(Color.WHITE)
            }
        }
    }

    // Handle Hardware Back Button
    override fun onSupportNavigateUp(): Boolean {
        if (supportFragmentManager.backStackEntryCount > 0) {
            supportFragmentManager.popBackStack()
            return true
        }
        return super.onSupportNavigateUp()
    }
}