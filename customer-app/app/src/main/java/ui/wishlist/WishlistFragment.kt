package ui.wishlist

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.ecommerce.citybasket.R
import com.ecommerce.citybasket.ui.home.HomeProductAdapter
import data.model.product.Product
import data.remote.api.RetrofitClient
import data.remote.request.WishlistRequest
import kotlinx.coroutines.launch
import utils.TokenManager

class WishlistFragment : Fragment() {

    private lateinit var rvWishlist: RecyclerView
    private lateinit var txtWishlistCount: TextView
    private lateinit var tokenManager: TokenManager

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        val view = inflater.inflate(R.layout.fragment_wishlist, container, false)

        tokenManager = TokenManager(requireContext())
        rvWishlist = view.findViewById(R.id.rvWishlist)
        txtWishlistCount = view.findViewById(R.id.txtWishlistCount)

        rvWishlist.layoutManager = GridLayoutManager(requireContext(), 2)
        loadWishlistData()

        return view
    }

    private fun loadWishlistData() {
        val savedToken = tokenManager.getToken()
        if (savedToken.isNullOrEmpty()) {
            Toast.makeText(requireContext(), "Please Login to see wishlist items!", Toast.LENGTH_SHORT).show()
            txtWishlistCount.text = "(0)"
            return
        }

        lifecycleScope.launch {
            try {
                val authHeader = "Bearer $savedToken"
                val response = RetrofitClient.userApi.getWishlist(authHeader)

                if (response.isSuccessful) {
                    val wishlistResponse = response.body()

                    if (wishlistResponse != null && wishlistResponse.success) {
                        val productList = mutableListOf<Product>()
                        wishlistResponse.wishlist?.forEach { item ->
                            item.product?.let {
                                // 🔥 Wishlist screen ke sabhi products ko true mark karenge
                                it.isWishlisted = true
                                productList.add(it)
                            }
                        }

                        txtWishlistCount.text = "(${productList.size})"

                        if (productList.isEmpty()) {
                            Toast.makeText(requireContext(), "Your Wishlist is empty!", Toast.LENGTH_SHORT).show()
                        }

                        rvWishlist.adapter = HomeProductAdapter(productList) { productId ->
                            // Wishlist page se toggle karne par direct remove operation chalega
                            toggleWishlistProduct(productId)
                        }

                    } else {
                        val msg = wishlistResponse?.message ?: "Failed to get wishlist data"
                        Toast.makeText(requireContext(), msg, Toast.LENGTH_SHORT).show()
                    }
                } else {
                    Toast.makeText(requireContext(), "Server Error Code: ${response.code()}", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                e.printStackTrace()
                Toast.makeText(requireContext(), "Data Error: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun toggleWishlistProduct(productId: String) {
        val savedToken = tokenManager.getToken() ?: return

        lifecycleScope.launch {
            try {
                val authHeader = "Bearer $savedToken"
                val request = WishlistRequest(productId)
                val response = RetrofitClient.userApi.addToWishlist(authHeader, request)

                if (response.isSuccessful) {
                    // Smoothly refresh full data inside wishlist screen to remove unselected item
                    loadWishlistData()
                }
            } catch (e: Exception) {
                Toast.makeText(requireContext(), "Error: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        }
    }
}