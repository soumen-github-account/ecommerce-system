package ui.address

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.ecommerce.citybasket.R
import com.google.android.material.button.MaterialButton
import data.model.address.AddressData
import data.remote.api.RetrofitClient
import kotlinx.coroutines.launch
import utils.TokenManager

class AddressManagementActivity : AppCompatActivity() {

    private lateinit var rvAddresses: RecyclerView
    private lateinit var btnAddNewAddressTrigger: MaterialButton
    private lateinit var progressLoader: ProgressBar
    private lateinit var txtEmptyAddresses: TextView

    private lateinit var tokenManager: TokenManager
    private lateinit var addressAdapter: AddressAdapter
    private val masterAddressList = mutableListOf<AddressData>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_address_management)

        tokenManager = TokenManager(this)

        rvAddresses = findViewById(R.id.rvAddresses)
        btnAddNewAddressTrigger = findViewById(R.id.btnAddNewAddressTrigger)
        progressLoader = findViewById(R.id.progressLoader)
        txtEmptyAddresses = findViewById(R.id.txtEmptyAddresses)

        rvAddresses.layoutManager = LinearLayoutManager(this)

        addressAdapter = AddressAdapter(
            masterAddressList,
            onEditClick = { selectedAddress ->
                // 🔥 Intent ke sath pura address object pass karenge edit karne ke liye
                val intent = Intent(this, AddAddressActivity::class.java).apply {
                    putExtra("IS_EDIT_MODE", true)
                    putExtra("ADDRESS_ID", selectedAddress.id)
                    putExtra("FULL_NAME", selectedAddress.fullName)
                    putExtra("PHONE", selectedAddress.phone)
                    putExtra("PINCODE", selectedAddress.pincode)
                    putExtra("CITY", selectedAddress.city)
                    putExtra("STATE", selectedAddress.state)
                    putExtra("LINE1", selectedAddress.addressLine1)
                    putExtra("LINE2", selectedAddress.addressLine2)
                    putExtra("LANDMARK", selectedAddress.landmark)
                    putExtra("TYPE", selectedAddress.addressType)
                    putExtra("IS_DEFAULT", selectedAddress.isDefault)
                }
                startActivity(intent)
            },
            onDeleteClick = { selectedAddress, position ->
                deleteAddressFromServer(selectedAddress.id, position)
            }
        )
        rvAddresses.adapter = addressAdapter

        btnAddNewAddressTrigger.setOnClickListener {
            startActivity(Intent(this, AddAddressActivity::class.java))
        }
    }

    override fun onResume() {
        super.onResume()
        loadAllSavedAddresses()
    }

    private fun loadAllSavedAddresses() {
        val token = tokenManager.getToken()
        if (token.isNullOrEmpty()) return

        progressLoader.visibility = View.VISIBLE
        txtEmptyAddresses.visibility = View.GONE

        lifecycleScope.launch {
            try {
                val response = RetrofitClient.userApi.getUserAddresses("Bearer $token")
                progressLoader.visibility = View.GONE

                if (response.isSuccessful && response.body() != null) {
                    val list = response.body()!!.addresses
                    masterAddressList.clear()
                    masterAddressList.addAll(list)
                    addressAdapter.notifyDataSetChanged()

                    if (masterAddressList.isEmpty()) {
                        txtEmptyAddresses.visibility = View.VISIBLE
                    }
                }
            } catch (e: Exception) {
                progressLoader.visibility = View.GONE
                e.printStackTrace()
            }
        }
    }

    private fun deleteAddressFromServer(addressId: String, position: Int) {
        val token = tokenManager.getToken() ?: return

        lifecycleScope.launch {
            try {
                val response = RetrofitClient.userApi.deleteAddress("Bearer $token", addressId)
                if (response.isSuccessful && response.body()?.success == true) {
                    addressAdapter.removeAt(position)
                    Toast.makeText(this@AddressManagementActivity, "Address deleted safely", Toast.LENGTH_SHORT).show()

                    if (masterAddressList.isEmpty()) {
                        txtEmptyAddresses.visibility = View.VISIBLE
                    }
                } else {
                    Toast.makeText(this@AddressManagementActivity, "Failed to delete item", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
}