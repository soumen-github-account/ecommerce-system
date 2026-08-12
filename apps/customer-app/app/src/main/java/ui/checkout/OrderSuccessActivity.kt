package ui.checkout

import android.content.Intent
import android.os.Bundle
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.ecommerce.citybasket.MainActivity
import com.ecommerce.citybasket.R
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

class OrderSuccessActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContentView(R.layout.activity_order_success)

        // Hardware back button handle
        onBackPressedDispatcher.addCallback(
            this,
            object : OnBackPressedCallback(true) {
                override fun handleOnBackPressed() {
                    goToHome()
                }
            }
        )

        // Auto redirect after 3 seconds
        lifecycleScope.launch {

            delay(3000)

            goToHome()
        }
    }

    private fun goToHome() {

        val intent = Intent(
            this,
            MainActivity::class.java
        )

        intent.flags =
            Intent.FLAG_ACTIVITY_NEW_TASK or
                    Intent.FLAG_ACTIVITY_CLEAR_TASK

        startActivity(intent)

        finish()
    }
}