package ui.checkout

import android.graphics.Color
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import com.ecommerce.citybasket.R
import data.remote.response.CartItemResponse
import data.remote.api.RetrofitClient
import kotlinx.coroutines.launch
import utils.TokenManager

class CheckoutActivity : AppCompatActivity() {

    private lateinit var tvStepTitle: TextView
    private lateinit var step1: TextView
    private lateinit var step2: TextView
    private lateinit var step3: TextView
    private lateinit var line1: View
    private lateinit var line2: View

    // Shared Checkout Data Holders
    private lateinit var tokenManager: TokenManager
    var selectedAddressForCheckout: data.model.address.AddressData? = null
    var totalCartAmount: Double = 0.0

    // 🔥 FIXED: Aapke core CartItemResponse model type ke sath configured list
    var checkoutCartItems: List<CartItemResponse> = emptyList()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_checkout)

        tokenManager = TokenManager(this)

        tvStepTitle = findViewById(R.id.tvStepTitle)
        step1 = findViewById(R.id.step1)
        step2 = findViewById(R.id.step2)
        step3 = findViewById(R.id.step3)
        line1 = findViewById(R.id.line1)
        line2 = findViewById(R.id.line2)

        if (savedInstanceState == null) {
            totalCartAmount = intent.getDoubleExtra("TOTAL_BILL_AMOUNT", 0.0)

            // Dynamic background item data fetch trigger
            fetchCartItemsForSummary()

            updateStepperUI(1, "Address Confirmation")
            supportFragmentManager.beginTransaction()
                .replace(R.id.checkoutContainer, AddressFragment())
                .commit()
        }

        // Stepper UI sync handling on Fragment Stack shifting
        supportFragmentManager.addOnBackStackChangedListener {
            val currentFragment = supportFragmentManager.findFragmentById(R.id.checkoutContainer)
            when (currentFragment) {
                is AddressFragment -> updateStepperUI(1, "Address Confirmation")
                is OrderSummaryFragment -> updateStepperUI(2, "Order Summary")
                is PaymentFragment -> updateStepperUI(3, "Payment Options")
            }
        }
    }

    // Backend active tracking helper mapping
    private fun fetchCartItemsForSummary() {
        val token = tokenManager.getToken()
        if (token.isNullOrEmpty()) return

        lifecycleScope.launch {
            try {
                val authHeader = "Bearer $token"
                val response = RetrofitClient.userApi.getCart(authHeader)
                if (response.isSuccessful && response.body() != null) {
                    val cartResponse = response.body()!!
                    if (cartResponse.success) {
                        checkoutCartItems = cartResponse.cartItems
                        Log.d("CHECKOUT_ACTIVITY", "Successfully synced ${checkoutCartItems.size} items for summary.")
                    }
                }
            } catch (e: Exception) {
                Log.e("CHECKOUT_ACTIVITY", "Error syncing cart background details: ${e.message}")
                e.printStackTrace()
            }
        }
    }

    // Custom flow state navigation load manager function
    fun loadFragment(fragment: Fragment) {
        supportFragmentManager.beginTransaction()
            .replace(R.id.checkoutContainer, fragment)
            .addToBackStack(null)
            .commit()
    }

    // Custom 3-Step Flow Color Palette Stepper Management Logic
    private fun updateStepperUI(step: Int, title: String) {
        tvStepTitle.text = title

        val colorBlack = Color.parseColor("#121212")
        val colorGrey = Color.parseColor("#E0E0E0")

        when (step) {
            1 -> {
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

    override fun onSupportNavigateUp(): Boolean {
        if (supportFragmentManager.backStackEntryCount > 0) {
            supportFragmentManager.popBackStack()
            return true
        }
        return super.onSupportNavigateUp()
    }
}