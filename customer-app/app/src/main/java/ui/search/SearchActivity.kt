package com.ecommerce.citybasket.ui.search

import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.ecommerce.citybasket.R
import com.ecommerce.citybasket.ui.home.HomeProductAdapter
import data.model.product.Product
import data.remote.api.RetrofitClient
import data.remote.request.WishlistRequest
import kotlinx.coroutines.launch
import utils.TokenManager

class SearchActivity : AppCompatActivity() {

    private lateinit var edtSearch: EditText
    private lateinit var rvSearch: RecyclerView
    private lateinit var adapter: HomeProductAdapter
    private lateinit var tokenManager: TokenManager // FIXED: TokenManager jodha

    private var allProducts = listOf<Product>()

//    override fun onCreate(savedInstanceState: Bundle?) {
//        super.onCreate(savedInstanceState)
//        setContentView(R.layout.activity_search)
//
//        tokenManager = TokenManager(this) // Initialize token manager
//
//        edtSearch = findViewById(R.id.edtSearch)
//        rvSearch = findViewById(R.id.rvSearchProducts)
//
//        rvSearch.layoutManager = LinearLayoutManager(this)
//
//        // FIXED: Adapter initialization me lambda callback pass kiya
//        adapter = HomeProductAdapter(allProducts) { productId ->
//            addProductToWishlist(productId)
//        }
//        rvSearch.adapter = adapter
//
//        edtSearch.addTextChangedListener(object : TextWatcher {
//            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
//
//            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
//                filterProducts(s?.toString().orEmpty())
//            }
//
//            override fun afterTextChanged(s: Editable?) {}
//        })
//    }

//    private fun filterProducts(query: String) {
//        val filteredList = allProducts.filter { product ->
//            product.name?.contains(query, ignoreCase = true) == true
//        }
//
//        // FIXED: Filtering ke time par bhi adapter ko lambda callback diya
//        rvSearch.adapter = HomeProductAdapter(filteredList) { productId ->
//            addProductToWishlist(productId)
//        }
//    }

    // FIXED: Search page se bhi wishlist add karne ka functionality jodha
//    private fun addProductToWishlist(productId: String) {
//        val savedToken = tokenManager.getToken()
//        if (savedToken.isNullOrEmpty()) {
//            Toast.makeText(this, "Please Login to add items to Wishlist!", Toast.LENGTH_SHORT).show()
//            return
//        }
//
//        lifecycleScope.launch {
//            try {
//                val authHeader = "Bearer $savedToken"
//                val request = WishlistRequest(productId)
//
//                val response = RetrofitClient.userApi.addToWishlist(authHeader, request)
//
//                if (response.isSuccessful) {
//                    val wishlistRes = response.body()
//                    if (wishlistRes != null && wishlistRes.success) {
//                        Toast.makeText(this@SearchActivity, wishlistRes.message ?: "Added to wishlist! ❤️", Toast.LENGTH_SHORT).show()
//                    } else {
//                        Toast.makeText(this@SearchActivity, wishlistRes?.message ?: "Something went wrong!", Toast.LENGTH_SHORT).show()
//                    }
//                } else {
//                    if (response.code() == 400) {
//                        Toast.makeText(this@SearchActivity, "Product already in wishlist!", Toast.LENGTH_SHORT).show()
//                    } else {
//                        Toast.makeText(this@SearchActivity, "Error Code: ${response.code()}", Toast.LENGTH_SHORT).show()
//                    }
//                }
//            } catch (e: Exception) {
//                e.printStackTrace()
//                Toast.makeText(this@SearchActivity, "Network Error: ${e.message}", Toast.LENGTH_SHORT).show()
//            }
//        }
//    }
}