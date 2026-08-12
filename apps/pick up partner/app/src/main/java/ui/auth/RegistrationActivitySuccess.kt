package ui.auth

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.airbnb.lottie.LottieAnimationView
import com.ecommerce.pickuppartnerapp.R
import com.google.android.material.button.MaterialButton

class RegistrationActivitySuccess : AppCompatActivity() {

    private lateinit var lottieSuccess: LottieAnimationView

    private lateinit var btnTrackApplication: MaterialButton
    private lateinit var btnGoLogin: MaterialButton

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_registration_success)

        initViews()
        setupAnimation()
        setupClicks()
    }

    private fun initViews() {

        lottieSuccess = findViewById(R.id.lottieSuccess)

        btnTrackApplication = findViewById(R.id.btnTrackApplication)
        btnGoLogin = findViewById(R.id.btnGoLogin)
    }

    private fun setupAnimation() {
        lottieSuccess.playAnimation()
    }

    private fun setupClicks() {

        btnTrackApplication.setOnClickListener {

            // TODO
            // Open Track Application Screen

            startActivity(
                Intent(
                    this,
                    LoginActivity::class.java
                )
            )
        }

        btnGoLogin.setOnClickListener {

            // TODO
            // Open Login Screen

            startActivity(
                Intent(
                    this,
                    LoginActivity::class.java
                )
            )

//            finishAffinity()
        }
    }

    override fun onResume() {
        super.onResume()
        lottieSuccess.playAnimation()
    }

    override fun onPause() {
        super.onPause()
        lottieSuccess.pauseAnimation()
    }

    override fun onDestroy() {
        super.onDestroy()
        lottieSuccess.cancelAnimation()
    }
}