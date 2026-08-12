package ui.auth

import android.content.Intent
import android.os.Bundle
import android.widget.ImageView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.ecommerce.pickuppartnerapp.R
import com.google.android.material.button.MaterialButton
import com.google.android.material.textfield.TextInputEditText

class RegisterDocumentsActivity : AppCompatActivity() {

    private lateinit var btnBack: ImageView
    private lateinit var btnContinue: MaterialButton

    private lateinit var etAadhaar: TextInputEditText
    private lateinit var etDrivingLicense: TextInputEditText
    private lateinit var etRcNumber: TextInputEditText

    private lateinit var btnUploadAadhaarFront: MaterialButton
    private lateinit var btnUploadAadhaarBack: MaterialButton
    private lateinit var btnUploadProfile: MaterialButton
    private lateinit var btnUploadDlFront: MaterialButton
    private lateinit var btnUploadDlBack: MaterialButton
    private lateinit var btnUploadRc: MaterialButton
    private lateinit var btnUploadInsurance: MaterialButton

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register_documents)

        initViews()
        setupClicks()
    }

    private fun initViews() {

        btnBack = findViewById(R.id.btnBack)
        btnContinue = findViewById(R.id.btnContinue)

        etAadhaar = findViewById(R.id.etAadhaar)
        etDrivingLicense = findViewById(R.id.etDrivingLicense)
        etRcNumber = findViewById(R.id.etRcNumber)

        btnUploadAadhaarFront = findViewById(R.id.btnUploadAadhaarFront)
        btnUploadAadhaarBack = findViewById(R.id.btnUploadAadhaarBack)

        btnUploadProfile = findViewById(R.id.btnUploadProfile)

        btnUploadDlFront = findViewById(R.id.btnUploadDlFront)
        btnUploadDlBack = findViewById(R.id.btnUploadDlBack)

        btnUploadRc = findViewById(R.id.btnUploadRc)

        btnUploadInsurance = findViewById(R.id.btnUploadInsurance)
    }

    private fun setupClicks() {

        btnBack.setOnClickListener {
            finish()
        }

        btnUploadAadhaarFront.setOnClickListener {
            Toast.makeText(this, "Upload Aadhaar Front", Toast.LENGTH_SHORT).show()
        }

        btnUploadAadhaarBack.setOnClickListener {
            Toast.makeText(this, "Upload Aadhaar Back", Toast.LENGTH_SHORT).show()
        }

        btnUploadProfile.setOnClickListener {
            Toast.makeText(this, "Upload Profile Photo", Toast.LENGTH_SHORT).show()
        }

        btnUploadDlFront.setOnClickListener {
            Toast.makeText(this, "Upload Driving License Front", Toast.LENGTH_SHORT).show()
        }

        btnUploadDlBack.setOnClickListener {
            Toast.makeText(this, "Upload Driving License Back", Toast.LENGTH_SHORT).show()
        }

        btnUploadRc.setOnClickListener {
            Toast.makeText(this, "Upload RC", Toast.LENGTH_SHORT).show()
        }

        btnUploadInsurance.setOnClickListener {
            Toast.makeText(this, "Upload Insurance", Toast.LENGTH_SHORT).show()
        }

        btnContinue.setOnClickListener {
            startActivity(Intent(this, RegisterBankActivity::class.java))


//            if (validateData()) {
//
//                Toast.makeText(
//                    this,
//                    "Documents Verified Successfully",
//                    Toast.LENGTH_LONG
//                ).show()
//
//                // TODO
//            }
        }
    }

    private fun validateData(): Boolean {

        val aadhaar = etAadhaar.text.toString().trim()

        if (aadhaar.isEmpty()) {
            etAadhaar.error = "Enter Aadhaar Number"
            return false
        }

        if (aadhaar.length != 12) {
            etAadhaar.error = "Aadhaar must be 12 digits"
            return false
        }

        if (etDrivingLicense.text.toString().trim().isEmpty()) {
            etDrivingLicense.error = "Enter Driving License Number"
            return false
        }

        if (etRcNumber.text.toString().trim().isEmpty()) {
            etRcNumber.error = "Enter RC Number"
            return false
        }

        return true
    }
}