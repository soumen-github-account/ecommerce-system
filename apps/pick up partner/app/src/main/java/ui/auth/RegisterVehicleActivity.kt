package ui.auth

import android.content.Intent
import android.os.Bundle
import android.widget.ArrayAdapter
import android.widget.AutoCompleteTextView
import android.widget.ImageView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.ecommerce.pickuppartnerapp.R
import com.google.android.material.button.MaterialButton
import com.google.android.material.materialswitch.MaterialSwitch
import com.google.android.material.radiobutton.MaterialRadioButton
import com.google.android.material.textfield.TextInputEditText

class RegisterVehicleActivity : AppCompatActivity() {

    private lateinit var btnBack: ImageView
    private lateinit var btnContinue: MaterialButton

    private lateinit var vehicleType: AutoCompleteTextView
    private lateinit var vehicleBrand: TextInputEditText
    private lateinit var vehicleModel: TextInputEditText
    private lateinit var vehicleColor: TextInputEditText
    private lateinit var vehicleNumber: TextInputEditText

    private lateinit var rcNumber: TextInputEditText
    private lateinit var licenseNumber: TextInputEditText

    private lateinit var btnUploadRc: MaterialButton
    private lateinit var btnUploadLicense: MaterialButton
    private lateinit var btnUploadVehicle: MaterialButton

    private lateinit var switchAvailable: MaterialSwitch

    private lateinit var rbPetrol: MaterialRadioButton
    private lateinit var rbDiesel: MaterialRadioButton
    private lateinit var rbElectric: MaterialRadioButton
    private lateinit var rbCng: MaterialRadioButton

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register_vehicle)

        initViews()
        setupVehicleDropdown()
        setupClicks()
    }

    private fun initViews() {

        btnBack = findViewById(R.id.btnBack)
        btnContinue = findViewById(R.id.btnContinue)

        vehicleType = findViewById(R.id.etVehicleType)
        vehicleBrand = findViewById(R.id.etVehicleBrand)
        vehicleModel = findViewById(R.id.etVehicleModel)
        vehicleColor = findViewById(R.id.etVehicleColor)
        vehicleNumber = findViewById(R.id.etVehicleNumber)

        rcNumber = findViewById(R.id.etRcNumber)
        licenseNumber = findViewById(R.id.etDrivingLicense)

        btnUploadRc = findViewById(R.id.btnUploadRc)
        btnUploadLicense = findViewById(R.id.btnUploadLicense)
        btnUploadVehicle = findViewById(R.id.btnUploadVehicle)

        switchAvailable = findViewById(R.id.switchAvailable)

        rbPetrol = findViewById(R.id.rbPetrol)
        rbDiesel = findViewById(R.id.rbDiesel)
        rbElectric = findViewById(R.id.rbElectric)
        rbCng = findViewById(R.id.rbCng)
    }

    private fun setupVehicleDropdown() {

        val vehicles = listOf(
            "Bike",
            "Scooter",
            "Cycle",
            "Car",
            "Pickup Van",
            "Mini Truck"
        )

        val adapter = ArrayAdapter(
            this,
            android.R.layout.simple_list_item_1,
            vehicles
        )

        vehicleType.setAdapter(adapter)
    }

    private fun setupClicks() {

        btnBack.setOnClickListener {
            finish()
        }

        btnUploadRc.setOnClickListener {
            Toast.makeText(this, "Upload RC Photo", Toast.LENGTH_SHORT).show()
        }

        btnUploadLicense.setOnClickListener {
            Toast.makeText(this, "Upload Driving License", Toast.LENGTH_SHORT).show()
        }

        btnUploadVehicle.setOnClickListener {
            Toast.makeText(this, "Upload Vehicle Photo", Toast.LENGTH_SHORT).show()
        }

        btnContinue.setOnClickListener {

//            if (!validateFields()) return@setOnClickListener

            Toast.makeText(
                this,
                "Vehicle Information Saved Successfully",
                Toast.LENGTH_LONG
            ).show()

            startActivity(Intent(this, RegisterDocumentsActivity::class.java))
        }
    }

//    private fun validateFields(): Boolean {
//
//        if (vehicleType.text.toString().trim().isEmpty()) {
//            vehicleType.error = "Select vehicle type"
//            return false
//        }
//
//        if (vehicleBrand.text.toString().trim().isEmpty()) {
//            vehicleBrand.error = "Enter vehicle brand"
//            return false
//        }
//
//        if (vehicleModel.text.toString().trim().isEmpty()) {
//            vehicleModel.error = "Enter vehicle model"
//            return false
//        }
//
//        if (vehicleColor.text.toString().trim().isEmpty()) {
//            vehicleColor.error = "Enter vehicle color"
//            return false
//        }
//
//        val number = vehicleNumber.text.toString().trim()
//
//        if (number.isEmpty()) {
//            vehicleNumber.error = "Enter vehicle number"
//            return false
//        }
//
//        val regex = Regex("^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$")
//
//        if (!regex.matches(number.uppercase())) {
//            vehicleNumber.error = "Example : WB12AB1234"
//            return false
//        }
//
//        if (rcNumber.text.toString().trim().isEmpty()) {
//            rcNumber.error = "Enter RC Number"
//            return false
//        }
//
//        if (licenseNumber.text.toString().trim().isEmpty()) {
//            licenseNumber.error = "Enter Driving License Number"
//            return false
//        }
//
//        if (!rbPetrol.isChecked &&
//            !rbDiesel.isChecked &&
//            !rbElectric.isChecked &&
//            !rbCng.isChecked
//        ) {
//            Toast.makeText(
//                this,
//                "Select Fuel Type",
//                Toast.LENGTH_SHORT
//            ).show()
//            return false
//        }
//
//        return true
//    }
}