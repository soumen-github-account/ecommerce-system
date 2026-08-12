package ui.auth

import android.app.TimePickerDialog
import android.content.Intent
import android.os.Bundle
import android.widget.CheckBox
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.ecommerce.pickuppartnerapp.R
import com.google.android.material.button.MaterialButton
import com.google.android.material.slider.Slider
import com.google.android.material.textfield.TextInputEditText
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale

class RegisterServiceAreaActivity : AppCompatActivity() {

    private lateinit var btnBack: ImageView
    private lateinit var btnContinue: MaterialButton
    private lateinit var btnDetectLocation: MaterialButton

    private lateinit var txtCurrentLocation: TextView
    private lateinit var txtSelectedRadius: TextView

    private lateinit var sliderRadius: Slider

    private lateinit var etStartTime: TextInputEditText
    private lateinit var etEndTime: TextInputEditText

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register_service_area)

        initViews()
        setupSlider()
        setupTimePicker()
        setupClicks()
    }

    private fun initViews() {

        btnBack = findViewById(R.id.btnBack)
        btnContinue = findViewById(R.id.btnContinue)
        btnDetectLocation = findViewById(R.id.btnDetectLocation)

        txtCurrentLocation = findViewById(R.id.txtCurrentLocation)
        txtSelectedRadius = findViewById(R.id.txtSelectedRadius)

        sliderRadius = findViewById(R.id.sliderRadius)

        etStartTime = findViewById(R.id.etStartTime)
        etEndTime = findViewById(R.id.etEndTime)
    }

    private fun setupSlider() {

        sliderRadius.addOnChangeListener { _, value, _ ->
            txtSelectedRadius.text = "Selected : ${value.toInt()} KM"
        }
    }

    private fun setupTimePicker() {

        etStartTime.setOnClickListener {
            showTimePicker(etStartTime)
        }

        etEndTime.setOnClickListener {
            showTimePicker(etEndTime)
        }
    }

    private fun showTimePicker(editText: TextInputEditText) {

        val calendar = Calendar.getInstance()

        TimePickerDialog(
            this,
            { _, hour, minute ->

                val c = Calendar.getInstance()
                c.set(Calendar.HOUR_OF_DAY, hour)
                c.set(Calendar.MINUTE, minute)

                val format = SimpleDateFormat("hh:mm a", Locale.getDefault())

                editText.setText(format.format(c.time))

            },
            calendar.get(Calendar.HOUR_OF_DAY),
            calendar.get(Calendar.MINUTE),
            false
        ).show()
    }

    private fun setupClicks() {

        btnBack.setOnClickListener {
            finish()
        }

        btnDetectLocation.setOnClickListener {

            // TODO : GPS Location
            txtCurrentLocation.text = "Kolkata, West Bengal"

            Toast.makeText(
                this,
                "Location Detected",
                Toast.LENGTH_SHORT
            ).show()
        }

        btnContinue.setOnClickListener {
            startActivity(Intent(this, RegisterReviewActivity::class.java))

//            if (validateData()) {
//
//                Toast.makeText(
//                    this,
//                    "Service Area Saved",
//                    Toast.LENGTH_SHORT
//                ).show()
//
//                // Next Screen
//                // finish()
//            }

        }
    }

    private fun validateData(): Boolean {

        if (etStartTime.text.toString().isEmpty()) {
            etStartTime.error = "Select Start Time"
            return false
        }

        if (etEndTime.text.toString().isEmpty()) {
            etEndTime.error = "Select End Time"
            return false
        }

        val workingAreas = listOf(
            R.id.cbKolkata,
            R.id.cbHowrah,
            R.id.cbSaltLake,
            R.id.cbDumDum,
            R.id.cbNewTown,
            R.id.cbBarasat
        )

        if (workingAreas.none {
                findViewById<CheckBox>(it).isChecked
            }) {

            Toast.makeText(
                this,
                "Select at least one Working Area",
                Toast.LENGTH_SHORT
            ).show()

            return false
        }

        val deliveryTypes = listOf(
            R.id.cbSellerPickup,
            R.id.cbHubPickup,
            R.id.cbWarehousePickup,
            R.id.cbExpressPickup
        )

        if (deliveryTypes.none {
                findViewById<CheckBox>(it).isChecked
            }) {

            Toast.makeText(
                this,
                "Select at least one Delivery Type",
                Toast.LENGTH_SHORT
            ).show()

            return false
        }

        return true
    }
}