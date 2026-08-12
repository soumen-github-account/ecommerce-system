package ui.auth

import android.app.DatePickerDialog
import android.content.Intent
import android.os.Bundle
import android.widget.ArrayAdapter
import android.widget.AutoCompleteTextView
import android.widget.CheckBox
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.ecommerce.pickuppartnerapp.R
import com.google.android.material.button.MaterialButton
import com.google.android.material.textfield.TextInputEditText
import java.util.Calendar

class RegisterPartnerActivity : AppCompatActivity() {

    private lateinit var etName: TextInputEditText
    private lateinit var etPhone: TextInputEditText
    private lateinit var etEmail: TextInputEditText
    private lateinit var etDob: TextInputEditText
    private lateinit var etGender: AutoCompleteTextView
    private lateinit var etPassword: TextInputEditText
    private lateinit var etConfirmPassword: TextInputEditText

    private lateinit var checkTerms: CheckBox

    private lateinit var btnContinue: MaterialButton

    private lateinit var txtLogin: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register_partner)

        initViews()

        setupGender()

        setupDob()

        btnContinue.setOnClickListener {
//            validateAndContinue()
            startActivity(
                Intent(
                    this,
                    RegisterAddressActivity::class.java
                )
            )
        }

        txtLogin.setOnClickListener {
            finish()
        }

    }

    private fun initViews() {

        etName = findViewById(R.id.etName)
        etPhone = findViewById(R.id.etPhone)
        etEmail = findViewById(R.id.etEmail)
        etDob = findViewById(R.id.etDob)
        etGender = findViewById(R.id.etGender)
        etPassword = findViewById(R.id.etPassword)
        etConfirmPassword = findViewById(R.id.etConfirmPassword)

        checkTerms = findViewById(R.id.checkTerms)

        btnContinue = findViewById(R.id.btnContinue)

        txtLogin = findViewById(R.id.txtLogin)

    }

    private fun setupGender() {

        val genders = listOf(
            "Male",
            "Female",
            "Other"
        )

        val adapter = ArrayAdapter(
            this,
            android.R.layout.simple_list_item_1,
            genders
        )

        etGender.setAdapter(adapter)

    }

    private fun setupDob() {

        etDob.setOnClickListener {

            val calendar = Calendar.getInstance()

            DatePickerDialog(
                this,
                { _, year, month, day ->

                    etDob.setText(
                        "%02d/%02d/%04d".format(
                            day,
                            month + 1,
                            year
                        )
                    )

                },
                calendar.get(Calendar.YEAR),
                calendar.get(Calendar.MONTH),
                calendar.get(Calendar.DAY_OF_MONTH)
            ).show()

        }

    }

//    private fun validateAndContinue() {
//
//        val name = etName.text.toString().trim()
//        val phone = etPhone.text.toString().trim()
//        val email = etEmail.text.toString().trim()
//        val dob = etDob.text.toString().trim()
//        val gender = etGender.text.toString().trim()
//        val password = etPassword.text.toString()
//        val confirm = etConfirmPassword.text.toString()
//
//        when {
//
//            name.isEmpty() -> {
//                etName.error = "Enter Full Name"
//                return
//            }
//
//            phone.length != 10 -> {
//                etPhone.error = "Enter Valid Mobile Number"
//                return
//            }
//
//            dob.isEmpty() -> {
//                etDob.error = "Select Date of Birth"
//                return
//            }
//
//            gender.isEmpty() -> {
//                etGender.error = "Select Gender"
//                return
//            }
//
//            password.length < 8 -> {
//                etPassword.error = "Minimum 8 Characters"
//                return
//            }
//
//            password != confirm -> {
//                etConfirmPassword.error = "Password Doesn't Match"
//                return
//            }
//
//            !checkTerms.isChecked -> {
//                Toast.makeText(
//                    this,
//                    "Please accept Terms & Conditions",
//                    Toast.LENGTH_SHORT
//                ).show()
//                return
//            }
//
//        }
//
//        startActivity(
//            Intent(
//                this,
//                RegisterAddressActivity::class.java
//            )
//        )
//
//    }

}