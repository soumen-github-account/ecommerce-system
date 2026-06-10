package ui.home

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.ecommerce.citybasket.R
import com.ecommerce.citybasket.ui.home.HomeSectionAdapter
import com.ecommerce.citybasket.ui.home.TopCategoryAdapter
import com.ecommerce.citybasket.ui.search.SearchActivity
import com.google.android.material.appbar.AppBarLayout
import data.model.HomeSection
import data.model.category.Category
import data.model.category.TopCategory
import data.remote.api.RetrofitClient
import data.remote.request.WishlistRequest
import kotlinx.coroutines.launch
import ui.address.AddAddressActivity
import ui.address.AddressManagementActivity // 🔥 Naya import add kiya
import utils.TokenManager
import kotlin.math.abs

class HomeFragment : Fragment() {
    private lateinit var homeSectionAdapter: HomeSectionAdapter
    private lateinit var rvHomeSections: RecyclerView
    private lateinit var topCategoryAdapter: TopCategoryAdapter
    private lateinit var tokenManager: TokenManager

    private lateinit var layoutLocationContainer: LinearLayout
    private lateinit var layoutAddAddressContainer: LinearLayout
    private lateinit var txtAddressTypeHeader: TextView
    private lateinit var txtShortAddress: TextView

    // 🔥 Dynamic Flag: Isse pata chalega user ke paas address saved hai ya nahi
    private var hasSavedAddresses: Boolean = false

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        val view = inflater.inflate(R.layout.fragment_home, container, false)
        tokenManager = TokenManager(requireContext())

        val appBarLayout = view.findViewById<AppBarLayout>(R.id.appBar)
        val searchSection = view.findViewById<LinearLayout>(R.id.searchSection)
        val searchInput = view.findViewById<LinearLayout>(R.id.searchInput)

        layoutLocationContainer = view.findViewById(R.id.layoutLocationContainer)
        layoutAddAddressContainer = view.findViewById(R.id.layoutAddAddressContainer)
        txtAddressTypeHeader = view.findViewById(R.id.txtAddressTypeHeader)
        txtShortAddress = view.findViewById(R.id.txtShortAddress)

        // 🔥 Updated Click Listener: Condition ke base par redirect karega
        val addressClickListener = View.OnClickListener {
            val savedToken = tokenManager.getToken()
            if (savedToken.isNullOrEmpty()) {
                Toast.makeText(requireContext(), "Please Login first!", Toast.LENGTH_SHORT).show()
                return@OnClickListener
            }

            if (hasSavedAddresses) {
                // Address hai -> Management page par bhejo
                startActivity(Intent(requireContext(), AddressManagementActivity::class.java))
            } else {
                // Address nahi hai -> Direct Form page par bhejo
                startActivity(Intent(requireContext(), AddAddressActivity::class.java))
            }
        }

        // Dono container par click listener bind kiya
        layoutLocationContainer.setOnClickListener(addressClickListener)
        layoutAddAddressContainer.setOnClickListener(addressClickListener)

        searchInput.setOnClickListener {
            startActivity(Intent(requireContext(), SearchActivity::class.java))
        }

        appBarLayout.addOnOffsetChangedListener { appBar, verticalOffset ->
            val totalScroll = appBar.totalScrollRange
            if (abs(verticalOffset) >= totalScroll) {
                searchSection.setPadding(0, dpToPx(25), 0, 0)
            } else {
                searchSection.setPadding(0, 0, 0, 0)
            }
        }

        val rvCategories = view.findViewById<RecyclerView>(R.id.rvCategories)
        rvCategories.layoutManager = LinearLayoutManager(requireContext(), LinearLayoutManager.HORIZONTAL, false)
        loadCategories()

        rvHomeSections = view.findViewById(R.id.rvHomeSections)
        rvHomeSections.layoutManager = LinearLayoutManager(requireContext())

        fetchAndSetupUserAddress()
        return view
    }

    private fun fetchAndSetupUserAddress() {
        val savedToken = tokenManager.getToken()

        if (savedToken.isNullOrEmpty()) {
            hasSavedAddresses = false
            layoutLocationContainer.visibility = View.GONE
            layoutAddAddressContainer.visibility = View.VISIBLE
            return
        }

        lifecycleScope.launch {
            try {
                val authHeader = "Bearer $savedToken"
                val response = RetrofitClient.userApi.getUserAddresses(authHeader)

                if (response.isSuccessful && response.body() != null) {
                    val addressList = response.body()!!.addresses

                    if (addressList.isNotEmpty()) {
                        hasSavedAddresses = true // Flag true kiya
                        val activeAddress = addressList.first()

                        txtAddressTypeHeader.text = (activeAddress.addressType ?: "HOME").uppercase()
                        txtShortAddress.text = " ${activeAddress.addressLine1}, ${activeAddress.city}"

                        // UI Switch
                        layoutAddAddressContainer.visibility = View.GONE
                        layoutLocationContainer.visibility = View.VISIBLE
                    } else {
                        hasSavedAddresses = false // Flag false kiya
                        layoutLocationContainer.visibility = View.GONE
                        layoutAddAddressContainer.visibility = View.VISIBLE
                    }
                } else {
                    hasSavedAddresses = false
                    layoutLocationContainer.visibility = View.GONE
                    layoutAddAddressContainer.visibility = View.VISIBLE
                }
            } catch (e: Exception) {
                Log.e("HOME_ADDRESS_DEBUG", "Failed to fetch top header address: ${e.message}")
                hasSavedAddresses = false
                layoutLocationContainer.visibility = View.GONE
                layoutAddAddressContainer.visibility = View.VISIBLE
            }
        }
    }

    override fun onResume() {
        super.onResume()
        fetchAndSetupUserAddress()
    }

    private fun loadHomeSections(categoryId: String) {
        lifecycleScope.launch {
            try {
                val savedToken = tokenManager.getToken()
                var userWishlistIds = setOf<String>()

                if (!savedToken.isNullOrEmpty()) {
                    try {
                        val wishlistResponse = RetrofitClient.userApi.getWishlist("Bearer $savedToken")
                        if (wishlistResponse.isSuccessful && wishlistResponse.body()?.success == true) {
                            userWishlistIds = wishlistResponse.body()?.wishlist?.mapNotNull { it.product?.id }?.toSet() ?: emptySet()
                        }
                    } catch (e: Exception) {
                        Log.e("HOME_DEBUG", "Wishlist fetch failed, skipping sync")
                    }
                }

                val response = RetrofitClient.categoryApi.getProductsByCategory(categoryId)

                if (response.success) {
                    val products = response.products

                    products.forEach { product ->
                        if (userWishlistIds.contains(product.id)) {
                            product.isWishlisted = true
                        }
                    }

                    val trendingProducts = products.take(4)
                    val bestProducts = products.takeLast(4)

                    val homeSections = listOf(
                        HomeSection("Trending", trendingProducts),
                        HomeSection("Best Deals", bestProducts)
                    )

                    homeSectionAdapter = HomeSectionAdapter(homeSections) { productId ->
                        addProductToWishlist(productId)
                    }

                    rvHomeSections.adapter = homeSectionAdapter
                }

            } catch (e: Exception) {
                Log.e("HOME_DEBUG", e.message ?: "Error")
                e.printStackTrace()
            }
        }
    }

    private fun addProductToWishlist(productId: String) {
        val savedToken = tokenManager.getToken()
        if (savedToken.isNullOrEmpty()) {
            Toast.makeText(requireContext(), "Please Login to add items to Wishlist!", Toast.LENGTH_SHORT).show()
            return
        }

        lifecycleScope.launch {
            try {
                val authHeader = "Bearer $savedToken"
                val request = WishlistRequest(productId)
                val response = RetrofitClient.userApi.addToWishlist(authHeader, request)

                if (response.isSuccessful) {
                    val wishlistRes = response.body()
                    if (wishlistRes != null && wishlistRes.success) {
                        Toast.makeText(requireContext(), wishlistRes.message ?: "Wishlist Updated!", Toast.LENGTH_SHORT).show()
                    }
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    private fun dpToPx(dp: Int): Int = (dp * resources.displayMetrics.density).toInt()

    private fun loadCategories() {
        lifecycleScope.launch {
            try {
                val response = RetrofitClient.categoryApi.getCategories()
                if (response.success) {
                    setupCategoryRecycler(response.categories)
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    private fun setupCategoryRecycler(categories: List<Category>) {
        val topTabs = categories.map {
            TopCategory(id = it.id, name = it.name, img = getCategoryIcon(it.name), subCategoryIds = emptyList())
        }

        topCategoryAdapter = TopCategoryAdapter(topTabs) { category, _ ->
            loadHomeSections(category.id)
        }

        view?.findViewById<RecyclerView>(R.id.rvCategories)?.adapter = topCategoryAdapter

        if (topTabs.isNotEmpty()) {
            loadHomeSections(topTabs.first().id)
        }
    }

    private fun getCategoryIcon(categoryName: String): Int {
        return when (categoryName.lowercase()) {
            "fashion" -> R.drawable.ic_fashion_tshirt
            "mobiles" -> R.drawable.ic_mobile
            "beauty" -> R.drawable.ic_lipstic
            "electronics" -> R.drawable.ic_laptop
            "home decore" -> R.drawable.ic_home_lamp
            "appliances" -> R.drawable.ic_appliances
            "toys" -> R.drawable.ic_toy
            "health" -> R.drawable.ic_health
            "sports" -> R.drawable.ic_sport
            "books" -> R.drawable.ic_book
            "furniture" -> R.drawable.ic_furniture
            else -> R.drawable.ic_fashion_tshirt
        }
    }
}