package ui.address

import android.os.Bundle
import android.util.Log
import android.widget.RadioButton
import android.widget.RadioGroup
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.ecommerce.citybasket.R
import com.google.android.material.button.MaterialButton
import com.google.android.material.switchmaterial.SwitchMaterial
import com.google.android.material.textfield.TextInputEditText
import data.remote.api.RetrofitClient
import data.remote.request.AddressRequest
import kotlinx.coroutines.launch
import utils.TokenManager

class AddAddressActivity : AppCompatActivity() {

    private lateinit var etFullName: TextInputEditText
    private lateinit var etPhone: TextInputEditText
    private lateinit var etPincode: TextInputEditText
    private lateinit var etCity: TextInputEditText
    private lateinit var etState: TextInputEditText
    private lateinit var etAddressLine1: TextInputEditText
    private lateinit var etAddressLine2: TextInputEditText
    private lateinit var etLandmark: TextInputEditText
    private lateinit var rgAddressType: RadioGroup
    private lateinit var switchDefault: SwitchMaterial
    private lateinit var btnSaveAddress: MaterialButton

    private lateinit var tokenManager: TokenManager

    // 🔥 Edit Mode Flags Variables
    private var isEditMode = false
    private var editAddressId: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_add_address)

        tokenManager = TokenManager(this)
        initViews()

        // 🔥 Check Intent: Kya user Edit karne aaya hai?
        isEditMode = intent.getBooleanExtra("IS_EDIT_MODE", false)
        if (isEditMode) {
            editAddressId = intent.getStringExtra("ADDRESS_ID")
            populateFieldsForEdit()
        }

        btnSaveAddress.setOnClickListener {
            validateAndSubmitAddress()
        }
    }

    private fun initViews() {
        etFullName = findViewById(R.id.etFullName)
        etPhone = findViewById(R.id.etPhone)
        etPincode = findViewById(R.id.etPincode)
        etCity = findViewById(R.id.etCity)
        etState = findViewById(R.id.etState)
        etAddressLine1 = findViewById(R.id.etAddressLine1)
        etAddressLine2 = findViewById(R.id.etAddressLine2)
        etLandmark = findViewById(R.id.etLandmark)
        rgAddressType = findViewById(R.id.rgAddressType)
        switchDefault = findViewById(R.id.switchDefault)
        btnSaveAddress = findViewById(R.id.btnSaveAddress)
    }

    // 🔥 Naya function: Form ki saari fields ko puraane data se bhar dega
    private fun populateFieldsForEdit() {
        btnSaveAddress.text = "UPDATE ADDRESS" // Button text change kiya

        etFullName.setText(intent.getStringExtra("FULL_NAME"))
        etPhone.setText(intent.getStringExtra("PHONE"))
        etPincode.setText(intent.getStringExtra("PINCODE"))
        etCity.setText(intent.getStringExtra("CITY"))
        etState.setText(intent.getStringExtra("STATE"))
        etAddressLine1.setText(intent.getStringExtra("LINE1"))
        etAddressLine2.setText(intent.getStringExtra("LINE2"))
        etLandmark.setText(intent.getStringExtra("LANDMARK"))
        switchDefault.isChecked = intent.getBooleanExtra("IS_DEFAULT", false)

        // Radio Group select handle
        val type = intent.getStringExtra("TYPE") ?: "Home"
        when (type.lowercase()) {
            "office" -> findViewById<RadioButton>(R.id.rbOffice)?.isChecked = true
            "other" -> findViewById<RadioButton>(R.id.rbOther)?.isChecked = true
            else -> findViewById<RadioButton>(R.id.rbHome)?.isChecked = true
        }
    }

    private fun validateAndSubmitAddress() {
        val fullName = etFullName.text.toString().trim()
        val phone = etPhone.text.toString().trim()
        val pincode = etPincode.text.toString().trim()
        val city = etCity.text.toString().trim()
        val state = etState.text.toString().trim()
        val addressLine1 = etAddressLine1.text.toString().trim()
        val addressLine2 = etAddressLine2.text.toString().trim().ifEmpty { null }
        val landmark = etLandmark.text.toString().trim().ifEmpty { null }
        val isDefault = switchDefault.isChecked

        if (fullName.isEmpty()) { etFullName.error = "Name is required"; return }
        if (phone.isEmpty() || phone.length < 10) { etPhone.error = "Enter valid mobile number"; return }
        if (pincode.isEmpty() || pincode.length < 6) { etPincode.error = "Enter valid pincode"; return }
        if (city.isEmpty()) { etCity.error = "City is required"; return }
        if (state.isEmpty()) { etState.error = "State is required"; return }
        if (addressLine1.isEmpty()) { etAddressLine1.error = "Address info is required"; return }

        val addressType = when (rgAddressType.checkedRadioButtonId) {
            R.id.rbOffice -> "Office"
            R.id.rbOther -> "Other"
            else -> "Home"
        }

        val addressRequest = AddressRequest(
            fullName = fullName,
            phone = phone,
            pincode = pincode,
            state = state,
            city = city,
            addressLine1 = addressLine1,
            addressLine2 = addressLine2,
            landmark = landmark,
            addressType = addressType,
            isDefault = isDefault
        )

        // 🔥 Dynamic Check: Mode ke hisab se function trigger hoga
        if (isEditMode && editAddressId != null) {
            updateAddressOnServer(editAddressId!!, addressRequest)
        } else {
            saveAddressToServer(addressRequest)
        }
    }

    // 🔥 NAYI API CALL FUNCTION (FOR UPDATE)
    private fun updateAddressOnServer(addressId: String, request: AddressRequest) {
        val savedToken = tokenManager.getToken()
        if (savedToken.isNullOrEmpty()) {
            Toast.makeText(this, "Session expired. Please Login again!", Toast.LENGTH_SHORT).show()
            return
        }

        btnSaveAddress.isEnabled = false
        btnSaveAddress.text = "UPDATING ADDRESS..."

        lifecycleScope.launch {
            try {
                val authHeader = "Bearer $savedToken"
                val response = RetrofitClient.userApi.updateAddress(authHeader, addressId, request)

                if (response.isSuccessful && response.body() != null) {
                    val serverResponse = response.body()!!
                    if (serverResponse.success) {
                        Toast.makeText(this@AddAddressActivity, "Address Updated Successfully!", Toast.LENGTH_SHORT).show()
                        finish() // Screen automatically close aur backup refresh ho jayega
                    } else {
                        Toast.makeText(this@AddAddressActivity, "Failed to update address", Toast.LENGTH_SHORT).show()
                        resetButtonState()
                    }
                } else {
                    Toast.makeText(this@AddAddressActivity, "Server Error: Code ${response.code()}", Toast.LENGTH_SHORT).show()
                    resetButtonState()
                }
            } catch (e: Exception) {
                Log.e("ADDRESS_UPDATE_ERROR", e.message ?: "Error")
                Toast.makeText(this@AddAddressActivity, "Network Connection Failed!", Toast.LENGTH_SHORT).show()
                resetButtonState()
            }
        }
    }

    private fun saveAddressToServer(request: AddressRequest) {
        val savedToken = tokenManager.getToken()
        if (savedToken.isNullOrEmpty()) return

        btnSaveAddress.isEnabled = false
        btnSaveAddress.text = "SAVING ADDRESS..."

        lifecycleScope.launch {
            try {
                val authHeader = "Bearer $savedToken"
                val response = RetrofitClient.userApi.createAddress(authHeader, request)

                if (response.isSuccessful && response.body() != null) {
                    val serverResponse = response.body()!!
                    if (serverResponse.success) {
                        Toast.makeText(this@AddAddressActivity, serverResponse.message, Toast.LENGTH_LONG).show()
                        finish()
                    } else {
                        resetButtonState()
                    }
                } else {
                    resetButtonState()
                }
            } catch (e: Exception) {
                resetButtonState()
            }
        }
    }

    private fun resetButtonState() {
        btnSaveAddress.isEnabled = true
        btnSaveAddress.text = if (isEditMode) "UPDATE ADDRESS" else "SAVE ADDRESS"
    }
}