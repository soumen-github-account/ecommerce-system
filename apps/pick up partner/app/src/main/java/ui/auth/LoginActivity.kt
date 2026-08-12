package ui.auth

import android.content.Intent
import android.os.Bundle
import android.widget.TextView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.ecommerce.pickuppartnerapp.MainActivity
import com.ecommerce.pickuppartnerapp.R
import com.google.android.material.button.MaterialButton

class LoginActivity : AppCompatActivity() {

    private lateinit var btnLogin: MaterialButton
    private lateinit var txtRegister: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_login)

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { view, insets ->

            val systemBars =
                insets.getInsets(WindowInsetsCompat.Type.systemBars())

            view.setPadding(
                systemBars.left,
                systemBars.top,
                systemBars.right,
                systemBars.bottom
            )

            insets
        }

        initViews()

        setupClickListeners()

    }

    private fun initViews() {

        btnLogin =
            findViewById(R.id.btnLogin)

        txtRegister =
            findViewById(R.id.txtRegister)

    }

    private fun setupClickListeners() {

        // Login
        btnLogin.setOnClickListener {

            // TODO : Login API
            startActivity(

                Intent(
                    this,
                    MainActivity::class.java
                )

            )

        }

        // Join as Pickup Partner
        txtRegister.setOnClickListener {

            startActivity(

                Intent(
                    this,
                    RegisterPartnerActivity::class.java
                )

            )

        }

    }

}