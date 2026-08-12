package ui.auth

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.location.Location
import android.os.Bundle
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import com.ecommerce.pickuppartnerapp.R
import com.google.android.gms.location.LocationServices
import com.google.android.material.button.MaterialButton

class RegisterAddressActivity : AppCompatActivity() {

    private lateinit var txtLatitude: TextView
    private lateinit var txtLongitude: TextView

    private val fusedLocationClient by lazy {
        LocationServices.getFusedLocationProviderClient(this)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register_address)

        txtLatitude = findViewById(R.id.txtLatitude)
        txtLongitude = findViewById(R.id.txtLongitude)

        findViewById<ImageView>(R.id.btnBack).setOnClickListener {
            finish()
        }

        findViewById<MaterialButton>(R.id.btnDetectLocation)
            .setOnClickListener {
                checkPermission()
            }

        findViewById<MaterialButton>(R.id.btnContinue)
            .setOnClickListener {

                startActivity(
                    Intent(
                        this,
                        RegisterVehicleActivity::class.java
                    )
                )

            }

    }

    //================ Permission =================//

    private fun checkPermission() {

        if (
            ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) == PackageManager.PERMISSION_GRANTED
        ) {

            getCurrentLocation()

        } else {

            permissionLauncher.launch(
                Manifest.permission.ACCESS_FINE_LOCATION
            )

        }

    }

    private val permissionLauncher =
        registerForActivityResult(
            ActivityResultContracts.RequestPermission()
        ) { granted ->

            if (granted) {

                getCurrentLocation()

            } else {

                Toast.makeText(
                    this,
                    "Location permission denied",
                    Toast.LENGTH_SHORT
                ).show()

            }

        }

    //================ Location =================//

    private fun getCurrentLocation() {

        if (
            ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED
        ) return

        fusedLocationClient.lastLocation
            .addOnSuccessListener { location: Location? ->

                if (location != null) {

                    txtLatitude.text =
                        location.latitude.toString()

                    txtLongitude.text =
                        location.longitude.toString()

                } else {

                    Toast.makeText(
                        this,
                        "Unable to fetch location",
                        Toast.LENGTH_SHORT
                    ).show()

                }

            }

    }

}