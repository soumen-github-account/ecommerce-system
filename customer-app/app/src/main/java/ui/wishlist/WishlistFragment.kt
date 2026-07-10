package ui.wishlist

import android.os.Bundle
import android.util.Log
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

        val token = tokenManager.getToken()

        if (token.isNullOrEmpty()) {

            txtWishlistCount.text = "(0)"

            Toast.makeText(
                requireContext(),
                "Please Login First",
                Toast.LENGTH_SHORT
            ).show()

            return
        }

        lifecycleScope.launch {

            try {

                val response =
                    RetrofitClient.userApi.getWishlist("Bearer $token")
                Log.d("WISHLIST_API", "Code = ${response.code()}")
                Log.d("WISHLIST_API", "Message = ${response.message()}")
                Log.d("WISHLIST_API", "URL = ${response.raw().request().url()}")

                if (!response.isSuccessful) {
                    Toast.makeText(
                        requireContext(),
                        "Server Error : ${response.code()}",
                        Toast.LENGTH_SHORT
                    ).show()
                    return@launch
                }

                val body = response.body()

                if (body == null || !body.success) {

                    Toast.makeText(
                        requireContext(),
                        "Something went wrong",
                        Toast.LENGTH_SHORT
                    ).show()

                    return@launch
                }

                val productList = body.wishlist.toMutableList()

                productList.forEach {
                    it.isWishlisted = true
                }

                txtWishlistCount.text = "(${productList.size})"

                if (productList.isEmpty()) {
                    Toast.makeText(
                        requireContext(),
                        "Your Wishlist is Empty",
                        Toast.LENGTH_SHORT
                    ).show()
                }

                txtWishlistCount.text = "(${productList.size})"

                if (productList.isEmpty()) {

                    Toast.makeText(
                        requireContext(),
                        "Your Wishlist is Empty",
                        Toast.LENGTH_SHORT
                    ).show()
                }

                rvWishlist.adapter =
                    HomeProductAdapter(productList) {
                            productId,
                            variantId,
                            sellerId,
                            isWishlisted,
                            position ->

                        toggleWishlistProduct(
                            productId,
                            variantId,
                            sellerId
                        )
                    }

            } catch (e: Exception) {

                e.printStackTrace()

                Toast.makeText(
                    requireContext(),
                    e.message,
                    Toast.LENGTH_SHORT
                ).show()
            }

        }

    }

    private fun toggleWishlistProduct(
        productId: String,
        variantId: String,
        sellerId: String
    ) {

        val token = tokenManager.getToken() ?: return

        lifecycleScope.launch {

            try {

                val request = WishlistRequest(
                    productId = productId,
                    variantId = variantId,
                    sellerId = sellerId
                )

                val response = RetrofitClient.userApi.addToWishlist(
                    "Bearer $token",
                    request
                )

                if (response.isSuccessful) {

                    loadWishlistData()

                } else {

                    Toast.makeText(
                        requireContext(),
                        "Failed",
                        Toast.LENGTH_SHORT
                    ).show()
                }

            } catch (e: Exception) {

                Toast.makeText(
                    requireContext(),
                    e.message,
                    Toast.LENGTH_SHORT
                ).show()
            }

        }

    }

}