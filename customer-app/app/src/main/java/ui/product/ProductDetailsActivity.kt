package com.ecommerce.citybasket.ui.product

import android.graphics.Color
import android.graphics.Paint
import android.graphics.Typeface
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.viewpager2.widget.ViewPager2
import com.ecommerce.citybasket.R
import com.google.android.material.button.MaterialButton
import kotlinx.coroutines.launch
import data.model.product.Product
import data.remote.api.RetrofitClient
import data.remote.request.CartRequest
import ui.product.ImageSliderAdapter
import utils.TokenManager

class ProductDetailsActivity : AppCompatActivity() {

    private lateinit var viewPagerImages: ViewPager2

    private lateinit var txtCategoryPath: TextView
    private lateinit var txtBrand: TextView
    private lateinit var txtTitle: TextView
    private lateinit var txtRating: TextView
    private lateinit var txtPrice: TextView
    private lateinit var txtOldPrice: TextView
    private lateinit var txtDiscount: TextView
    private lateinit var txtStock: TextView
    private lateinit var txtDescription: TextView
    private lateinit var txtSeller: TextView
    private lateinit var layoutVariantsContainer: LinearLayout

    // Variables for logic
    private var selectedSize: String? = null
    private var productId: String? = null // FIXED: Isko global banaya taaki har jagah use ho sake

    private lateinit var btnAddToCart: MaterialButton
    private lateinit var btnBuyNow: MaterialButton

    private lateinit var btnWishlist: ImageButton
    private lateinit var btnShare: ImageButton

    private lateinit var layoutHighlights: LinearLayout
    private lateinit var layoutSpecifications: LinearLayout
    private lateinit var btnMinus: ImageButton
    private lateinit var btnPlus: ImageButton
    private lateinit var txtQuantity: TextView

    private var currentQuantity = 1
    private var baseProductPrice = 0
    private var baseOriginalPrice = 0
    private lateinit var tokenManager: TokenManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_product_details)
        tokenManager = TokenManager(this)

        initViews()

        // FIXED: Global variable mein intent data store kiya
        productId = intent.getStringExtra("PRODUCT_ID")

        if (productId.isNullOrEmpty()) {
            Toast.makeText(this, "Product ID not found", Toast.LENGTH_SHORT).show()
            finish()
            return
        }

        loadProduct(productId!!)

        setClickListeners()
    }

    private fun initViews() {
        viewPagerImages = findViewById(R.id.viewPagerImages)

        txtCategoryPath = findViewById(R.id.txtCategoryPath)
        txtBrand = findViewById(R.id.txtBrand)
        txtTitle = findViewById(R.id.txtTitle)
        txtRating = findViewById(R.id.txtRating)
        txtPrice = findViewById(R.id.txtPrice)
        txtOldPrice = findViewById(R.id.txtOldPrice)
        txtDiscount = findViewById(R.id.txtDiscount)
        txtStock = findViewById(R.id.txtStock)
        txtDescription = findViewById(R.id.txtDescription)
        txtSeller = findViewById(R.id.txtSeller)

        btnAddToCart = findViewById(R.id.btnAddToCart)
        btnBuyNow = findViewById(R.id.btnBuyNow)

        btnWishlist = findViewById(R.id.btnWishlist)
        btnShare = findViewById(R.id.btnShare)

        layoutHighlights = findViewById(R.id.layoutHighlights)
        layoutSpecifications = findViewById(R.id.layoutSpecifications)
        layoutVariantsContainer = findViewById(R.id.layoutVariantsContainer)

        btnMinus = findViewById(R.id.btnMinus)
        btnPlus = findViewById(R.id.btnPlus)
        txtQuantity = findViewById(R.id.txtQuantity)
    }

    private fun setClickListeners() {
        btnWishlist.setOnClickListener {
            Toast.makeText(this, "Added to wishlist", Toast.LENGTH_SHORT).show()
        }

        btnShare.setOnClickListener {
            Toast.makeText(this, "Share product", Toast.LENGTH_SHORT).show()
        }

        btnBuyNow.setOnClickListener {
            Toast.makeText(this, "Buy now clicked", Toast.LENGTH_SHORT).show()
        }

        btnPlus.setOnClickListener {
            if (currentQuantity < 10) {
                currentQuantity++
                updatePriceAndQuantityUI()
            } else {
                Toast.makeText(this, "Maximum quantity reached", Toast.LENGTH_SHORT).show()
            }
        }

        btnMinus.setOnClickListener {
            if (currentQuantity > 1) {
                currentQuantity--
                updatePriceAndQuantityUI()
            }
        }

        // FIXED: Dono AddToCart click listeners ko ek sath merge kar diya hai
        btnAddToCart.setOnClickListener {
            val pId = productId

            // 1. SharedPreferences se token nikala
            val savedToken = tokenManager.getToken()

            // 2. Check kiya ki user logged in hai ya nahi
            if (savedToken.isNullOrEmpty()) {
                Toast.makeText(this, "Please login first!", Toast.LENGTH_SHORT).show()
                // Aap chahein to yahan se LoginActivity par redirect kar sakte hain
                return@setOnClickListener
            }

            if (layoutVariantsContainer.childCount > 0 && selectedSize == null) {
                Toast.makeText(this, "Please select a size/variant first!", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            if (!pId.isNullOrEmpty()) {
                lifecycleScope.launch {
                    try {
                        val cartRequest = CartRequest(
                            productId = pId,
                            quantity = currentQuantity,
                            varient = selectedSize ?: ""
                        )

                        // 3. Backend format ke mutabik "Bearer <token>" banaya
                        val authHeader = "Bearer $savedToken"

                        // 4. API Call mein header aur request body dono pass kar diye
                        val response = RetrofitClient.userApi.addToCart(authHeader, cartRequest)

                        if (response.success) {
                            Toast.makeText(this@ProductDetailsActivity, response.message ?: "Added to cart!", Toast.LENGTH_SHORT).show()
                        } else {
                            Toast.makeText(this@ProductDetailsActivity, response.message, Toast.LENGTH_SHORT).show()
                        }

                    } catch (e: Exception) {
                        Toast.makeText(this@ProductDetailsActivity, "Failed: ${e.message}", Toast.LENGTH_SHORT).show()
                    }
                }
            } else {
                Toast.makeText(this, "Invalid Product", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun loadProduct(productId: String) {
        lifecycleScope.launch {
            try {
                val response = RetrofitClient.productApi.getProductById(productId)

                if (response.success) {
                    setProductData(response.product)
                } else {
                    Toast.makeText(this@ProductDetailsActivity, "Product not found", Toast.LENGTH_SHORT).show()
                    finish()
                }
            } catch (e: Exception) {
                Toast.makeText(this@ProductDetailsActivity, e.message ?: "Error", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun setProductData(product: Product) {
        // 🔥 FIXED: category, subCategory, aur level2 ke objects ka sahi naam use kiya
        txtCategoryPath.text = listOfNotNull(
            product.categoryObj?.name,
            product.subCategoryObj?.name,
            product.subCategoryLevel2Obj?.name
        ).joinToString(" > ")

        txtBrand.text = "by ${product.details.getOrNull(0) ?: "Brand"}"
        txtTitle.text = product.name ?: "N/A"
        txtRating.text = "4.8 ★"

        val finalPrice = product.price.getOrNull(0) ?: 0
        val originalPrice = finalPrice + ((finalPrice * product.discount) / 100)

        baseProductPrice = finalPrice
        baseOriginalPrice = originalPrice
        currentQuantity = 1

        // FIXED: Yahan se price automatic handle ho jayega dono text views par
        updatePriceAndQuantityUI()

        txtDiscount.text = "${product.discount}% OFF"
        txtStock.text = "Only ${product.stock} left in stock"
        txtDescription.text = product.description ?: "No description available"
        txtSeller.text = "Sold By CityBasket Pro"

        txtOldPrice.paintFlags = txtOldPrice.paintFlags or Paint.STRIKE_THRU_TEXT_FLAG

        loadHighlights(product)
        loadSpecifications(product)
        setupImageSlider(product.images)
        setupDynamicVariants(product.type)
    }

    private fun loadHighlights(product: Product) {
        layoutHighlights.removeAllViews()

        if (product.details.isEmpty() || product.detailsType.isEmpty()) {
            val tv = TextView(this)
            tv.text = "No highlights available"
            tv.setTextColor(Color.parseColor("#424242"))
            layoutHighlights.addView(tv)
            return
        }

        val count = minOf(product.details.size, product.detailsType.size)

        for (i in 0 until count) {
            val tv = TextView(this)
            tv.text = "•  ${product.detailsType[i]}: ${product.details[i]}"
            tv.textSize = 14f
            tv.setTextColor(Color.parseColor("#424242"))
            tv.setPadding(0, 10, 0, 10)
            layoutHighlights.addView(tv)
        }
    }

    private fun loadSpecifications(product: Product) {
        layoutSpecifications.removeAllViews()

        // 🔥 FIXED: Yahan bhi category, subCategory aur level2 ke aage 'Obj' jodh diya hai
        addSpec("Category", product.categoryObj?.name ?: "N/A")
        addSpec("Sub Category", product.subCategoryObj?.name ?: "N/A")
        addSpec("Product Type", product.subCategoryLevel2Obj?.name ?: "N/A")
        addSpec("Unit", product.unit ?: "N/A")
        addSpec("Stock", product.stock.toString())

        // Type call check logic fallback configuration
        addSpec("Sizes", product.type?.joinToString(", ") ?: "N/A")
    }

    private fun addSpec(title: String, value: String) {
        val rowLayout = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            )
            setPadding(0, 12, 0, 12)
        }

        val tvTitle = TextView(this).apply {
            layoutParams = LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f)
            text = title
            textSize = 14f
            setTextColor(Color.parseColor("#757575"))
        }

        val tvValue = TextView(this).apply {
            layoutParams = LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 2f)
            text = value
            textSize = 14f
            setTextColor(Color.parseColor("#212121"))
            setTypeface(null, Typeface.BOLD)
        }

        rowLayout.addView(tvTitle)
        rowLayout.addView(tvValue)
        layoutSpecifications.addView(rowLayout)
    }

    private fun setupImageSlider(images: List<String>?) {
        val imageList = images?.filterNotNull() ?: emptyList()
        if (imageList.isEmpty()) return

        val adapter = ImageSliderAdapter(imageList)
        viewPagerImages.adapter = adapter
    }

    private fun setupDynamicVariants(sizes: List<String>?) {
        layoutVariantsContainer.removeAllViews()
        selectedSize = null

        val sizeList = sizes?.filterNotNull() ?: emptyList()

        if (sizeList.isEmpty()) {
            return
        }

        val buttonList = mutableListOf<com.google.android.material.button.MaterialButton>()

        for (size in sizeList) {
            val btn = com.google.android.material.button.MaterialButton(this, null, com.google.android.material.R.attr.materialButtonStyle).apply {
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.WRAP_CONTENT,
                    (52 * resources.displayMetrics.density).toInt()
                ).apply {
                    marginEnd = (12 * resources.displayMetrics.density).toInt()
                }

                text = size
                textSize = 14f
                isAllCaps = false
                includeFontPadding = false
                minWidth = (56 * resources.displayMetrics.density).toInt()
                cornerRadius = (16 * resources.displayMetrics.density).toInt()
                insetTop = 0
                insetBottom = 0

                setBackgroundColor(Color.parseColor("#FFFFFF"))
                setTextColor(Color.parseColor("#212121"))

                strokeColor = android.content.res.ColorStateList.valueOf(Color.parseColor("#E0E0E0"))
                strokeWidth = (1 * resources.displayMetrics.density).toInt()
            }

            btn.setOnClickListener {
                selectedSize = size

                for (b in buttonList) {
                    if (b == btn) {
                        b.setBackgroundColor(Color.parseColor("#212121"))
                        b.setTextColor(Color.parseColor("#FFFFFF"))
                        b.strokeColor = android.content.res.ColorStateList.valueOf(Color.parseColor("#212121"))
                    } else {
                        b.setBackgroundColor(Color.parseColor("#FFFFFF"))
                        b.setTextColor(Color.parseColor("#212121"))
                        b.strokeColor = android.content.res.ColorStateList.valueOf(Color.parseColor("#E0E0E0"))
                    }
                }
                Toast.makeText(this@ProductDetailsActivity, "Selected Size: $size", Toast.LENGTH_SHORT).show()
            }

            buttonList.add(btn)
            layoutVariantsContainer.addView(btn)
        }

        if (buttonList.isNotEmpty()) {
            buttonList[0].performClick()
        }
    }

    private fun updatePriceAndQuantityUI() {
        txtQuantity.text = currentQuantity.toString()

        val totalFinalPrice = baseProductPrice * currentQuantity
        val totalOriginalPrice = baseOriginalPrice * currentQuantity

        txtPrice.text = "₹$totalFinalPrice"
        txtOldPrice.text = "₹$totalOriginalPrice"
    }

}