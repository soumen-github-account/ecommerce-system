package ui.checkout

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity
import com.ecommerce.citybasket.MainActivity
import com.ecommerce.citybasket.R

class OrderSuccessActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_order_success)

        val btnContinueShopping = findViewById<Button>(R.id.btnContinueShopping)

        btnContinueShopping.setOnClickListener {
            // 1. Intent banao MainActivity ke liye
            val intent = Intent(this, MainActivity::class.java)

            // 2. 🔥 Flags lagao taaki checkout aur success ki saari purani activities stack se clear ho jayein
            intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_NEW_TASK

            // 3. Screen start karo
            startActivity(intent)

            // 4. Current success screen ko close karo
            finish()
        }
    }

    // User hardware back button dabaye toh bhi checkout process me wapas na ja paye
    override fun onBackPressed() {
        super.onBackPressed()
        val intent = Intent(this, MainActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_NEW_TASK
        startActivity(intent)
        finish()
    }
}