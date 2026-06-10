package ui.cart

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.ecommerce.citybasket.R
import com.ecommerce.citybasket.ui.cart.CartAdapter
import data.remote.api.RetrofitClient
import data.remote.request.RemoveCartRequest
import data.remote.request.UpdateCartRequest
import data.remote.response.CartItemResponse
import kotlinx.coroutines.launch
import ui.checkout.CheckoutActivity
import utils.TokenManager

class CartFragment : Fragment() {

    private lateinit var rvCart: RecyclerView
    private lateinit var tokenManager: TokenManager
    private lateinit var progressBar: ProgressBar

    private lateinit var txtCartCount: TextView
    private lateinit var txtTotalPrice: TextView
    private var currentGrandTotal: Double = 0.0
    // 🔥 CheckoutActivity ke andar in lines ko add/update karein:
    var selectedAddressForCheckout: data.model.address.AddressData? = null
    var totalCartAmount: Double = 0.0
    var checkoutCartItems: List<CartItemResponse> = emptyList() // 🔥 Products track karne ke liye

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {

        val view = inflater.inflate(R.layout.fragment_cart, container, false)

        tokenManager = TokenManager(requireContext())
        rvCart = view.findViewById(R.id.rvCart)
        progressBar = view.findViewById(R.id.progressBar)

        txtCartCount = view.findViewById(R.id.txtCartCount)
        txtTotalPrice = view.findViewById(R.id.txtTotalPrice)

        rvCart.layoutManager = LinearLayoutManager(requireContext())

        val btnCheckout = view.findViewById<Button>(R.id.btnCheckout)
        btnCheckout.setOnClickListener {
            if (currentGrandTotal <= 0.0) {
                Toast.makeText(requireContext(), "Your cart is empty!", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            // 🔥 Intent ke sath amount aur cart items dono pass kar rahe hain
            val intent = Intent(requireContext(), CheckoutActivity::class.java).apply {
                putExtra("TOTAL_BILL_AMOUNT", currentGrandTotal)
                // Agar CartItem ya Product model Serializable/Parcelable hai toh direct bhej sakte hain,
                // ya fir sabse best aur safe tarika hai ki CheckoutActivity khud hi apne onCreate me ya fragments ke through share kare.
            }
            startActivity(intent)
        }

        loadCartData()

        return view
    }

    private fun loadCartData() {
        val savedToken = tokenManager.getToken()

        if (savedToken.isNullOrEmpty()) {
            Toast.makeText(requireContext(), "Please Login to see cart items!", Toast.LENGTH_SHORT).show()
            return
        }

        progressBar.visibility = View.VISIBLE

        lifecycleScope.launch {
            try {
                val authHeader = "Bearer $savedToken"
                val networkResponse = RetrofitClient.userApi.getCart(authHeader)

                if (networkResponse.isSuccessful) {
                    val cartResponse = networkResponse.body()

                    if (cartResponse != null && cartResponse.success) {

                        // 🔥 FIXED: Variable ko update kiya taaki checkout empty na bole
                        currentGrandTotal = cartResponse.grandTotal.toString().toDoubleOrNull() ?: 0.0

                        rvCart.adapter = CartAdapter(
                            cartResponse.cartItems,
                            cartResponse.subTotal,
                            cartResponse.shippingCharges,
                            cartResponse.grandTotal,
                            { productId -> deleteCartItem(productId) },
                            { productId, action -> updateQuantity(productId, action) }
                        )

                        txtCartCount.text = "(${cartResponse.count} Items)"
                        txtTotalPrice.text = "₹${cartResponse.grandTotal}"

                    } else {
                        val msg = cartResponse?.message ?: "Failed to parse cart data"
                        Toast.makeText(requireContext(), msg, Toast.LENGTH_SHORT).show()
                    }
                } else {
                    val errorBodyString = networkResponse.errorBody()?.string()
                    Toast.makeText(requireContext(), "Server Error: $errorBodyString", Toast.LENGTH_LONG).show()
                }
            } catch (e: Exception) {
                e.printStackTrace()
                Toast.makeText(requireContext(), "Parsing Error: ${e.message}", Toast.LENGTH_SHORT).show()
            } finally {
                progressBar.visibility = View.GONE
            }
        }
    }

    // Delete item functionality
    private fun deleteCartItem(productId: String) {
        val savedToken = tokenManager.getToken() ?: return
        progressBar.visibility = View.VISIBLE

        lifecycleScope.launch {
            try {
                val authHeader = "Bearer $savedToken"
                val request = RemoveCartRequest(productId)
                val response = RetrofitClient.userApi.removeFromCart(authHeader, request)

                if (response.isSuccessful) {
                    val cartResponse = response.body()
                    if (cartResponse != null && cartResponse.success) {
                        Toast.makeText(requireContext(), "Item removed!", Toast.LENGTH_SHORT).show()

                        // 🔥 FIXED: Variable ko yahan bhi update kiya string translation se safely
                        currentGrandTotal = cartResponse.grandTotal.toString().toDoubleOrNull() ?: 0.0

                        // Local refresh
                        rvCart.adapter = CartAdapter(
                            cartResponse.cartItems,
                            cartResponse.subTotal,
                            cartResponse.shippingCharges,
                            cartResponse.grandTotal,
                            { id -> deleteCartItem(id) },
                            { id, act -> updateQuantity(id, act) }
                        )

                        txtCartCount.text = "(${cartResponse.count} Items)"
                        txtTotalPrice.text = "₹${cartResponse.grandTotal}"
                    } else {
                        Toast.makeText(requireContext(), cartResponse?.message ?: "Failed to remove", Toast.LENGTH_SHORT).show()
                    }
                } else {
                    Toast.makeText(requireContext(), "Error: ${response.code()}", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(requireContext(), "Error: ${e.message}", Toast.LENGTH_SHORT).show()
            } finally {
                progressBar.visibility = View.GONE
            }
        }
    }

    private fun updateQuantity(productId: String, action: String) {
        val savedToken = tokenManager.getToken() ?: return
        progressBar.visibility = View.VISIBLE

        lifecycleScope.launch {
            try {
                val authHeader = "Bearer $savedToken"
                val request = UpdateCartRequest(productId, action)

                val response = RetrofitClient.userApi.updateCartQuantity(authHeader, request)

                if (response.isSuccessful) {
                    val cartResponse = response.body()
                    if (cartResponse != null && cartResponse.success) {

                        // 🔥 FIXED: Variable ko yahan bhi sync kiya naye amount ke sath
                        currentGrandTotal = cartResponse.grandTotal.toString().toDoubleOrNull() ?: 0.0

                        // Live sync with new data
                        rvCart.adapter = CartAdapter(
                            cartResponse.cartItems,
                            cartResponse.subTotal,
                            cartResponse.shippingCharges,
                            cartResponse.grandTotal,
                            { id -> deleteCartItem(id) },
                            { id, act -> updateQuantity(id, act) }
                        )

                        txtCartCount.text = "(${cartResponse.count} Items)"
                        txtTotalPrice.text = "₹${cartResponse.grandTotal}"
                    } else {
                        Toast.makeText(requireContext(), cartResponse?.message ?: "Failed to update", Toast.LENGTH_SHORT).show()
                    }
                } else {
                    Toast.makeText(requireContext(), "Error: ${response.code()}", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(requireContext(), "Error: ${e.message}", Toast.LENGTH_SHORT).show()
            } finally {
                progressBar.visibility = View.GONE
            }
        }
    }
}