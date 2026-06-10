package ui.home

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
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
import utils.TokenManager
import kotlin.math.abs

class HomeFragment : Fragment() {
    private lateinit var homeSectionAdapter: HomeSectionAdapter
    private lateinit var rvHomeSections: RecyclerView
    private lateinit var topCategoryAdapter: TopCategoryAdapter
    private lateinit var tokenManager: TokenManager

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

        return view
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