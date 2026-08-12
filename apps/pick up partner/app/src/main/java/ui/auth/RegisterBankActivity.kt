package ui.auth

import android.content.Intent
import android.os.Bundle
import android.widget.ArrayAdapter
import android.widget.AutoCompleteTextView
import android.widget.CheckBox
import android.widget.ImageView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.ecommerce.pickuppartnerapp.R
import com.google.android.material.button.MaterialButton
import com.google.android.material.textfield.TextInputEditText

class RegisterBankActivity : AppCompatActivity() {

    private lateinit var btnBack: ImageView
    private lateinit var btnContinue: MaterialButton

    private lateinit var etAccountHolderName: TextInputEditText
    private lateinit var etBankName: AutoCompleteTextView
    private lateinit var etAccountNumber: TextInputEditText
    private lateinit var etConfirmAccountNumber: TextInputEditText
    private lateinit var etIfscCode: TextInputEditText
    private lateinit var etBranchName: TextInputEditText
    private lateinit var etUpiId: TextInputEditText

    private lateinit var btnUploadPassbook: MaterialButton
    private lateinit var cbWeeklySettlement: CheckBox

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register_bank)

        initViews()
        setupBankDropdown()
        setupClicks()
    }

    private fun initViews() {

        btnBack = findViewById(R.id.btnBack)
        btnContinue = findViewById(R.id.btnContinue)

        etAccountHolderName = findViewById(R.id.etAccountHolderName)
        etBankName = findViewById(R.id.etBankName)
        etAccountNumber = findViewById(R.id.etAccountNumber)
        etConfirmAccountNumber = findViewById(R.id.etConfirmAccountNumber)
        etIfscCode = findViewById(R.id.etIfscCode)
        etBranchName = findViewById(R.id.etBranchName)
        etUpiId = findViewById(R.id.etUpiId)

        btnUploadPassbook = findViewById(R.id.btnUploadPassbook)
        cbWeeklySettlement = findViewById(R.id.cbWeeklySettlement)
    }

    private fun setupBankDropdown() {

        val banks = arrayOf(
            "State Bank of India",
            "Punjab National Bank",
            "Bank of Baroda",
            "Canara Bank",
            "Union Bank of India",
            "Indian Bank",
            "Bank of India",
            "UCO Bank",
            "Central Bank of India",
            "Punjab & Sind Bank",
            "HDFC Bank",
            "ICICI Bank",
            "Axis Bank",
            "Kotak Mahindra Bank",
            "IndusInd Bank",
            "IDFC FIRST Bank",
            "Yes Bank",
            "AU Small Finance Bank",
            "Bandhan Bank",
            "Federal Bank"
        )

        val adapter = ArrayAdapter(
            this,
            android.R.layout.simple_dropdown_item_1line,
            banks
        )

        etBankName.setAdapter(adapter)
    }

    private fun setupClicks() {

        btnBack.setOnClickListener {
            finish()
        }

        btnUploadPassbook.setOnClickListener {

            Toast.makeText(
                this,
                "Passbook Upload Coming Soon",
                Toast.LENGTH_SHORT
            ).show()
        }

        btnContinue.setOnClickListener {
            startActivity(Intent(this, RegisterServiceAreaActivity::class.java))


//            if (validateForm()) {
//
//                Toast.makeText(
//                    this,
//                    "Bank Details Saved Successfully",
//                    Toast.LENGTH_SHORT
//                ).show()
//
//                // Next Screen
//                // finish()
//            }
        }
    }

    private fun validateForm(): Boolean {

        if (etAccountHolderName.text.toString().trim().isEmpty()) {
            etAccountHolderName.error = "Enter Account Holder Name"
            return false
        }

        if (etBankName.text.toString().trim().isEmpty()) {
            etBankName.error = "Select Bank"
            return false
        }

        if (etAccountNumber.text.toString().trim().isEmpty()) {
            etAccountNumber.error = "Enter Account Number"
            return false
        }

        if (etConfirmAccountNumber.text.toString().trim().isEmpty()) {
            etConfirmAccountNumber.error = "Confirm Account Number"
            return false
        }

        if (etAccountNumber.text.toString() != etConfirmAccountNumber.text.toString()) {
            etConfirmAccountNumber.error = "Account Number doesn't match"
            return false
        }

        if (etIfscCode.text.toString().trim().isEmpty()) {
            etIfscCode.error = "Enter IFSC Code"
            return false
        }

        if (etBranchName.text.toString().trim().isEmpty()) {
            etBranchName.error = "Enter Branch Name"
            return false
        }

        return true
    }
}