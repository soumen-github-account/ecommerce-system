package ui.splash

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.animation.AnimationUtils
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.ecommerce.pickuppartnerapp.R
import ui.auth.LoginActivity

class SplashActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {

        super.onCreate(savedInstanceState)

        setContentView(R.layout.activity_splash)

        val logo = findViewById<ImageView>(R.id.imgLogo)

        val appName = findViewById<TextView>(R.id.txtAppName)

        val subtitle = findViewById<TextView>(R.id.txtSubtitle)

        val zoom = AnimationUtils.loadAnimation(
            this,
            R.anim.zoom_in
        )

        val fade = AnimationUtils.loadAnimation(
            this,
            R.anim.fade_in
        )

        logo.startAnimation(zoom)

        appName.startAnimation(fade)

        subtitle.startAnimation(fade)

        Handler(Looper.getMainLooper()).postDelayed({

            startActivity(

                Intent(
                    this,
                    LoginActivity::class.java
                )

            )

            finish()

        },3000)

    }

}