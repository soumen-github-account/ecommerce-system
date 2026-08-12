package ui.auth

import android.content.Intent
import android.os.Bundle
import android.widget.CheckBox
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.ecommerce.pickuppartnerapp.R
import com.google.android.material.button.MaterialButton

class RegisterReviewActivity : AppCompatActivity() {

    private lateinit var btnBack: ImageView
    private lateinit var btnSubmit: MaterialButton

    private lateinit var btnEditPersonal: TextView
    private lateinit var btnEditAddress: TextView
    private lateinit var btnEditVehicle: TextView
    private lateinit var btnEditDocuments: TextView
    private lateinit var btnEditBank: TextView
    private lateinit var btnEditServiceArea: TextView

    private lateinit var cbConfirm: CheckBox
    private lateinit var cbTerms: CheckBox

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register_review)

        initViews()
        setupClicks()
    }

    private fun initViews() {

        btnBack = findViewById(R.id.btnBack)
        btnSubmit = findViewById(R.id.btnSubmit)

        btnEditPersonal = findViewById(R.id.btnEditPersonal)
        btnEditAddress = findViewById(R.id.btnEditAddress)
        btnEditVehicle = findViewById(R.id.btnEditVehicle)
        btnEditDocuments = findViewById(R.id.btnEditDocuments)
        btnEditBank = findViewById(R.id.btnEditBank)
        btnEditServiceArea = findViewById(R.id.btnEditServiceArea)

        cbConfirm = findViewById(R.id.cbConfirm)
        cbTerms = findViewById(R.id.cbTerms)
    }

    private fun setupClicks() {

        btnBack.setOnClickListener {
            finish()
        }

        btnEditPersonal.setOnClickListener {
            startActivity(
                Intent(this, RegistrationActivitySuccess::class.java)
            )
        }

        btnEditAddress.setOnClickListener {
            startActivity(
                Intent(this, RegisterAddressActivity::class.java)
            )
        }

        btnEditVehicle.setOnClickListener {
            startActivity(
                Intent(this, RegisterVehicleActivity::class.java)
            )
        }

        btnEditDocuments.setOnClickListener {
            startActivity(
                Intent(this, RegisterDocumentsActivity::class.java)
            )
        }

        btnEditBank.setOnClickListener {
            startActivity(
                Intent(this, RegisterBankActivity::class.java)
            )
        }

        btnEditServiceArea.setOnClickListener {
            startActivity(
                Intent(this, RegisterServiceAreaActivity::class.java)
            )
        }

        btnSubmit.setOnClickListener {

            if (!cbConfirm.isChecked) {
                Toast.makeText(
                    this,
                    "Please confirm your details.",
                    Toast.LENGTH_SHORT
                ).show()
                return@setOnClickListener
            }

            if (!cbTerms.isChecked) {
                Toast.makeText(
                    this,
                    "Please accept Terms & Conditions.",
                    Toast.LENGTH_SHORT
                ).show()
                return@setOnClickListener
            }

            Toast.makeText(
                this,
                "Application Submitted Successfully",
                Toast.LENGTH_LONG
            ).show()

            // Next Screen
           startActivity(Intent(this, RegistrationActivitySuccess::class.java))
            // finishAffinity()
        }
    }
}