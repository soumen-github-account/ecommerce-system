package ui.auth.register

import android.graphics.Color
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.ecommerce.citybasket.R
import com.google.firebase.FirebaseException
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.PhoneAuthCredential
import com.google.firebase.auth.PhoneAuthOptions
import com.google.firebase.auth.PhoneAuthProvider
import data.remote.api.RetrofitClient
import data.remote.request.FirebaseLoginRequest
import data.remote.response.FirebaseLoginResponse
import java.util.concurrent.TimeUnit
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import utils.TokenManager

class RegisterActivity : AppCompatActivity() {

    private lateinit var auth: FirebaseAuth
    private lateinit var verificationId: String

    private var isOtpVerified = false
    private var isLoginMode = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register)

        auth = FirebaseAuth.getInstance()

        val tvTabLogin = findViewById<TextView>(R.id.tv_tab_login)
        val tvTabRegister = findViewById<TextView>(R.id.tv_tab_register)
        val layoutRegisterFields = findViewById<LinearLayout>(R.id.layout_register_fields)

        val btnAction = findViewById<Button>(R.id.btn_register)
        val tvTitle = findViewById<TextView>(R.id.tv_title)
        val etPhone = findViewById<EditText>(R.id.et_phone)
        val etOtp = findViewById<EditText>(R.id.et_otp)
        val btnSendOtp = findViewById<Button>(R.id.btn_send_otp)

        val etFirstName = findViewById<EditText>(R.id.et_first_name)
        val etLastName = findViewById<EditText>(R.id.et_last_name)
        val etEmail = findViewById<EditText>(R.id.et_email)

        // Login Tab Selection
        tvTabLogin.setOnClickListener {
            isLoginMode = true
            layoutRegisterFields.visibility = View.GONE
            btnAction.text = "Log In"
            tvTitle.text = "Welcome Back"

            tvTabLogin.setBackgroundResource(R.drawable.btn_dark_gradient)
            tvTabLogin.setTextColor(Color.WHITE)
            tvTabRegister.background = null
            tvTabRegister.setTextColor(Color.parseColor("#555555"))
        }

        // Register Tab Selection
        tvTabRegister.setOnClickListener {
            isLoginMode = false
            layoutRegisterFields.visibility = View.VISIBLE
            btnAction.text = "Create Account"
            tvTitle.text = "Create An Account"

            tvTabRegister.setBackgroundResource(R.drawable.btn_dark_gradient)
            tvTabRegister.setTextColor(Color.WHITE)
            tvTabLogin.background = null
            tvTabLogin.setTextColor(Color.parseColor("#555555"))
        }

        // FIXED: Send OTP listener wapas joda jo gayab ho gaya tha
        btnSendOtp.setOnClickListener {
            val phone = etPhone.text.toString().trim()

            if (phone.length != 10) {
                Toast.makeText(this, "Enter valid phone number", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            sendOtp(phone)
        }

        // FIXED: Dono listeners ko merge karke single master validation banaya
        btnAction.setOnClickListener {
            val otp = etOtp.text.toString().trim()

            if (otp.isEmpty()) {
                Toast.makeText(this, "Enter OTP", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            var firstName = ""
            var lastName = ""
            var email = ""

            // Agar Login Mode nahi hai (yani Register Mode hai) tabhi fields check karo
            if (!isLoginMode) {
                firstName = etFirstName.text.toString().trim()
                lastName = etLastName.text.toString().trim()
                email = etEmail.text.toString().trim()

                if (firstName.isEmpty()) {
                    etFirstName.error = "Required"
                    return@setOnClickListener
                }

                if (lastName.isEmpty()) {
                    etLastName.error = "Required"
                    return@setOnClickListener
                }

                if (email.isEmpty()) {
                    etEmail.error = "Required"
                    return@setOnClickListener
                }
            }

            // Dono cases me Firebase verification check chalega safely
            verifyOtp(otp, firstName, lastName, email)
        }
    }

    private fun sendOtp(phone: String) {
        val options = PhoneAuthOptions.newBuilder(auth)
            .setPhoneNumber("+91$phone")
            .setTimeout(60L, TimeUnit.SECONDS)
            .setActivity(this)
            .setCallbacks(callbacks)
            .build()

        PhoneAuthProvider.verifyPhoneNumber(options)
    }

    private val callbacks = object : PhoneAuthProvider.OnVerificationStateChangedCallbacks() {
        override fun onVerificationCompleted(credential: PhoneAuthCredential) {
            // Auto verification logic handling if needed
        }

        override fun onVerificationFailed(e: FirebaseException) {
            e.printStackTrace()
            Toast.makeText(this@RegisterActivity, e.message, Toast.LENGTH_LONG).show()
        }

        override fun onCodeSent(id: String, token: PhoneAuthProvider.ForceResendingToken) {
            verificationId = id
            Toast.makeText(this@RegisterActivity, "OTP Sent Successfully", Toast.LENGTH_SHORT).show()
        }
    }

    private fun verifyOtp(otp: String, firstName: String, lastName: String, email: String) {
        val credential = PhoneAuthProvider.getCredential(verificationId, otp)

        auth.signInWithCredential(credential)
            .addOnSuccessListener {
                Toast.makeText(this, "Phone Verified Successfully", Toast.LENGTH_LONG).show()

                auth.currentUser?.getIdToken(true)?.addOnSuccessListener { result ->
                    val firebaseToken = result.token
                    if (firebaseToken != null) {
                        loginWithBackend(firebaseToken, firstName, lastName, email)
                    }
                }
            }
            .addOnFailureListener {
                Toast.makeText(this, "Invalid OTP", Toast.LENGTH_SHORT).show()
            }
    }

    private fun loginWithBackend(firebaseToken: String, firstName: String, lastName: String, email: String) {
        val request = FirebaseLoginRequest(
            token = firebaseToken,
            firstName = firstName,
            lastName = lastName,
            email = email
        )

        RetrofitClient.authApi.firebaseLogin(request).enqueue(object : Callback<FirebaseLoginResponse> {
            override fun onResponse(call: Call<FirebaseLoginResponse>, response: Response<FirebaseLoginResponse>) {
                println("CODE = ${response.code()}")

                if (response.isSuccessful && response.body()?.success == true) {
                    val jwt = response.body()?.token
                    Toast.makeText(this@RegisterActivity, "Login Success", Toast.LENGTH_LONG).show()
                    println("JWT = $jwt")

                    if (jwt != null) {
                        val tokenManager = TokenManager(this@RegisterActivity)
                        tokenManager.saveToken(jwt)

                        // Yahan par aap user ko MainActivity par navigate karwa sakte hain
                        // finish() // ya intent call
                    }
                } else {
                    println(response.errorBody()?.string())
                    Toast.makeText(this@RegisterActivity, "Backend Login Failed", Toast.LENGTH_LONG).show()
                }
            }

            override fun onFailure(call: Call<FirebaseLoginResponse>, t: Throwable) {
                Toast.makeText(this@RegisterActivity, t.message, Toast.LENGTH_LONG).show()
            }
        })
    }
}