package com.ecommerce.citybasket.ui.product

import android.graphics.Color
import android.graphics.Typeface
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import androidx.viewpager2.widget.ViewPager2
import com.bumptech.glide.Glide
import com.bumptech.glide.load.resource.bitmap.CenterCrop
import com.bumptech.glide.load.resource.bitmap.RoundedCorners
import com.ecommerce.citybasket.R
import com.google.android.material.button.MaterialButton
import com.google.android.material.tabs.TabLayout
import data.model.DetailItem
import data.model.DetailSection
import data.model.product.*
import data.remote.api.RetrofitClient
import data.remote.request.CartRequest
import kotlinx.coroutines.launch
import ui.product.DetailAdapter
import ui.product.DetailsCache
import ui.product.ImageSliderAdapter
import ui.product.ProductDetailsMapper
import ui.product.adapter.AllDetailsAdapter
import utils.TokenManager

class ProductDetailsActivity : AppCompatActivity() {

    // View declarations
    private lateinit var viewPagerImages: ViewPager2
    private lateinit var txtTitle: TextView
    private lateinit var txtBrand: TextView
    private lateinit var txtPrice: TextView
    private lateinit var txtOldPrice: TextView
    private lateinit var txtDiscount: TextView
    private lateinit var txtStock: TextView
    private lateinit var layoutHighlights: LinearLayout
    private lateinit var colorContainer: LinearLayout
    private lateinit var sizeContainer: LinearLayout

    private lateinit var tabDetails: TabLayout

    private lateinit var product: ProductDetails
    private var selectedVariant: ProductVariant? = null
    private var selectedSize: String? = null
    private var productId: String? = null
    private lateinit var tokenManager: TokenManager
    private lateinit var rvAllDetails: RecyclerView

    private lateinit var allDetailsAdapter: AllDetailsAdapter
    private lateinit var detailsCache: DetailsCache

    private var currentQuantity = 1
    private lateinit var txtQuantity: TextView
    private lateinit var btnPlus: ImageButton
    private lateinit var btnMinus: ImageButton
    private var baseProductPrice = 0
    private var baseOriginalPrice = 0

    private lateinit var peaceContainer: LinearLayout

    private lateinit var imgHighlightArrow: ImageView
    private lateinit var highlightHeader: RelativeLayout

    private var isHighlightExpanded = true
    private lateinit var btnAddToCart: MaterialButton

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_product_details)
        tokenManager = TokenManager(this)

        initViews()
        // setupTabs()
        setupRecycler()

        productId = intent.getStringExtra("PRODUCT_ID")

        Log.d("PRODUCT_DEBUG", "Received Product ID = $productId")
        if (!productId.isNullOrEmpty()) loadProduct(productId!!)
    }

    private fun initViews() {
        viewPagerImages = findViewById(R.id.viewPagerImages)
        txtTitle = findViewById(R.id.txtTitle)
        txtBrand = findViewById(R.id.txtBrand)
        txtPrice = findViewById(R.id.txtPrice)
        txtOldPrice = findViewById(R.id.txtOldPrice)
        txtDiscount = findViewById(R.id.txtDiscount)
        txtStock = findViewById(R.id.txtStock)
        layoutHighlights = findViewById(R.id.layoutHighlights)
        txtQuantity = findViewById(R.id.txtQuantity)
        btnPlus = findViewById(R.id.btnPlus)
        btnMinus = findViewById(R.id.btnMinus)

        // Ensure XML mein ye IDs maujood hain
        colorContainer = findViewById(R.id.colorContainer)
        sizeContainer = findViewById(R.id.sizeContainer)
        peaceContainer = findViewById(R.id.peaceContainer)

        highlightHeader = findViewById(R.id.highlightHeader)
        imgHighlightArrow = findViewById(R.id.imgHighlightArrow)
        tabDetails = findViewById(R.id.tabDetails)

        btnPlus.setOnClickListener {
            selectedVariant?.let {
                if (currentQuantity < it.stock) {
                    currentQuantity++
                    updatePriceAndQuantityUI()
                }
            }
        }

        btnMinus.setOnClickListener {
            if (currentQuantity > 1) {
                currentQuantity--
                updatePriceAndQuantityUI()
            }
        }

        highlightHeader.setOnClickListener {

            if (isHighlightExpanded) {

                layoutHighlights.visibility = View.GONE

                imgHighlightArrow.animate()
                    .rotation(180f)
                    .setDuration(250)
                    .start()

            } else {

                layoutHighlights.visibility = View.VISIBLE

                imgHighlightArrow.animate()
                    .rotation(0f)
                    .setDuration(250)
                    .start()
            }

            isHighlightExpanded = !isHighlightExpanded
        }

        rvAllDetails = findViewById(R.id.rvAllDetails)
        btnAddToCart = findViewById(R.id.btnAddToCart)
        btnAddToCart.setOnClickListener {
            addToCart()
        }
    }

    private fun showSection(
        section: DetailSection
    ) {

        val data = when(section){

            DetailSection.FEATURES ->

                detailsCache.features

            DetailSection.SPECIFICATIONS ->

                detailsCache.specifications

            DetailSection.DESCRIPTION ->

                detailsCache.description

            DetailSection.MANUFACTURER ->

                detailsCache.manufacturer

        }

        allDetailsAdapter.submitList(data)

    }

    private fun setupRecycler() {

        allDetailsAdapter = AllDetailsAdapter()

        rvAllDetails.layoutManager = LinearLayoutManager(this)

        rvAllDetails.adapter = allDetailsAdapter

    }

    private fun loadProduct(id: String) {
        lifecycleScope.launch {
            try {
                val response = RetrofitClient.productApi.getProductById(id)
                if (response.success) {
                    product = response.product
                    selectedVariant = product.variants.firstOrNull()
                    setProductData()
                }
            } catch (e: Exception) {
                Log.e("ERROR", e.message.toString())
            }
        }
    }

    private fun setProductData() {
        txtTitle.text = product.title
        txtBrand.text = product.brand

        setupAttributes()
        setupPeaceOfMind()
        setupHighlights()
        detailsCache = DetailsCache(

            features =
                ProductDetailsMapper.getFeatures(product),

            specifications =
                ProductDetailsMapper.getSpecifications(product),

            description =
                ProductDetailsMapper.getDescription(product),

            manufacturer =
                ProductDetailsMapper.getManufacturer(product)

        )

        setupTabs()


        showSection(
            DetailSection.FEATURES
        )
        updateUI(selectedVariant!!)
    }


    private fun setupPeaceOfMind() {

        peaceContainer.removeAllViews()

        addPeaceItem(
            R.drawable.ic_warranty,
            "1 Year Limited Warranty"
        )

        addPeaceItem(
            R.drawable.ic_support,
            "7 Days Brand Support"
        )

        addPeaceItem(
            R.drawable.ic_secure_payment,
            "Secure Payment"
        )

        addPeaceItem(
            R.drawable.ic_verified,
            "100% Genuine Product"
        )
    }

    private fun addPeaceItem(icon: Int, title: String) {

        val view = layoutInflater.inflate(
            R.layout.item_peace,
            peaceContainer,
            false
        )

        view.findViewById<ImageView>(R.id.icon).setImageResource(icon)

        view.findViewById<TextView>(R.id.title).text = title

        peaceContainer.addView(view)
    }

    private fun setupAttributes() {

        colorContainer.removeAllViews()
        colorContainer.addView(createTitleView("Select Color"))

        val colorLayout = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
        }

        val colors = product.availableAttributes["Color"] ?: emptyList()

        val views = mutableListOf<View>()

        colors.forEach { color ->

            val view = layoutInflater.inflate(
                R.layout.item_color,
                colorLayout,
                false
            )

            val img = view.findViewById<ImageView>(R.id.imgColor)
            val txt = view.findViewById<TextView>(R.id.txtColor)

            txt.text = color.value
            txt.setTextColor(Color.BLACK)

            Glide.with(this)
                .load(color.image)
                .transform(CenterCrop(), RoundedCorners(20))
                .into(img)

            views.add(view)

            view.setOnClickListener {

                views.forEach {
                    it.setBackgroundResource(android.R.color.transparent)
                }

                view.setBackgroundResource(R.drawable.selected_color_border)

                selectedVariant = product.variants.firstOrNull {
                    it.variantId == color.variantId
                }

                updateUI(selectedVariant!!)
                drawSizeButtons()
            }

            colorLayout.addView(view)
        }

        colorContainer.addView(colorLayout)

        if (views.isNotEmpty()) {
            views[0].performClick()
        }
    }

    private fun drawSizeButtons() {
        sizeContainer.removeAllViews()
        sizeContainer.addView(createTitleView("Select Size"))

        val sizeLayout = LinearLayout(this).apply { orientation = LinearLayout.HORIZONTAL }
        val sizes = selectedVariant?.attributes?.find { it.name.equals("Size", true) }?.value?.split(",") ?: emptyList()
        val buttons = mutableListOf<MaterialButton>()

        sizes.forEach { size ->
            val btn = createStyledButton(size.trim())
            btn.setOnClickListener {
                selectedSize = size.trim()
                buttons.forEach { b -> styleButton(b, b == btn) }
            }
            buttons.add(btn)
            sizeLayout.addView(btn)
        }
        sizeContainer.addView(sizeLayout)
        if (buttons.isNotEmpty()) buttons[0].performClick()
    }

    private fun updateUI(variant: ProductVariant) {

        baseProductPrice = variant.price.sellingPrice.toInt()
        baseOriginalPrice = variant.price.mrp.toInt()

        txtPrice.text = "₹$baseProductPrice"
        txtOldPrice.text = "₹$baseOriginalPrice"
        txtDiscount.text = "${variant.price.discount.toInt()}% OFF"

        txtStock.text =
            if (variant.stock > 0) "In Stock"
            else "Out of Stock"

        currentQuantity = 1
        updatePriceAndQuantityUI()

        viewPagerImages.adapter =
            ImageSliderAdapter(product.images.map { it.url })
    }

    private fun createStyledButton(text: String): MaterialButton {
        return MaterialButton(this, null, com.google.android.material.R.attr.materialButtonOutlinedStyle).apply {
            this.text = text
            isAllCaps = false
            cornerRadius = 16
            strokeWidth = 2
            setPadding(40, 0, 40, 0)
            layoutParams = LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, 120).apply { marginEnd = 20 }
        }
    }

    private fun styleButton(btn: MaterialButton, isSelected: Boolean) {
        btn.setBackgroundColor(if (isSelected) Color.parseColor("#212121") else Color.WHITE)
        btn.setTextColor(if (isSelected) Color.WHITE else Color.parseColor("#212121"))
        btn.strokeColor = android.content.res.ColorStateList.valueOf(Color.parseColor("#212121"))
    }

    private fun createTitleView(text: String): TextView {
        return TextView(this).apply {
            this.text = text
            setTypeface(null, Typeface.BOLD)
            setTextColor(Color.BLACK)
            setPadding(0, 30, 0, 16)
        }
    }

    private fun updatePriceAndQuantityUI() {

        txtQuantity.text = currentQuantity.toString()

        val finalPrice = baseProductPrice * currentQuantity
        val oldPrice = baseOriginalPrice * currentQuantity

        txtPrice.text = "₹$finalPrice"
        txtOldPrice.text = "₹$oldPrice"
    }

    private fun setupHighlights() {

        layoutHighlights.removeAllViews()

        product.highlights.forEach { highlight ->

            val view = layoutInflater.inflate(
                R.layout.item_highlight,
                layoutHighlights,
                false
            )

            val txt = view.findViewById<TextView>(R.id.txtHighlight)
//            val img = view.findViewById<ImageView>(R.id.imgIcon)

            txt.text = highlight

//            img.setImageResource(getHighlightIcon(highlight))

            layoutHighlights.addView(view)
        }
    }

    private fun getHighlightIcon(text: String): Int {

        return when {

            text.contains("Fabric", true) ->
                R.drawable.ic_highlight

            text.contains("Sleeve", true) ->
                R.drawable.ic_highlight

            text.contains("Neck", true) ->
                R.drawable.ic_highlight

            text.contains("Pattern", true) ->
                R.drawable.ic_highlight

            text.contains("Camera", true) ->
                R.drawable.ic_highlight

            text.contains("Battery", true) ->
                R.drawable.ic_highlight

            text.contains("Display", true) ->
                R.drawable.ic_highlight

            text.contains("Storage", true) ->
                R.drawable.ic_highlight

            else ->
                R.drawable.ic_highlight
        }
    }

    private fun setupTabs() {

        val tabs = listOf(
            "Features",
            "Specifications",
            "Description",
            "Manufacturer"
        )

        tabs.forEach { title ->
            tabDetails.addTab(
                tabDetails.newTab().setCustomView(createTab(title))
            )
        }

        updateTabSelection(0)

        tabDetails.addOnTabSelectedListener(object : TabLayout.OnTabSelectedListener {

            override fun onTabSelected(tab: TabLayout.Tab) {

                updateTabSelection(tab.position)

                when(tab.position){

                    0 -> showSection(DetailSection.FEATURES)

                    1 -> showSection(DetailSection.SPECIFICATIONS)

                    2 -> showSection(DetailSection.DESCRIPTION)

                    3 -> showSection(DetailSection.MANUFACTURER)

                }

            }


            override fun onTabUnselected(tab: TabLayout.Tab) {}

            override fun onTabReselected(tab: TabLayout.Tab) {}
        })
    }

    private fun createTab(title: String): View {

        val view = layoutInflater.inflate(
            R.layout.item_detail_tab,
            null
        )

        view.findViewById<TextView>(R.id.txtTab).text = title

        return view
    }

    private fun updateTabSelection(selected: Int) {

        for (i in 0 until tabDetails.tabCount) {

            val tab = tabDetails.getTabAt(i)

            val txt = tab?.customView?.findViewById<TextView>(R.id.txtTab)

            if (i == selected) {
                txt?.setBackgroundResource(R.drawable.bg_tab_selected)
                txt?.setTextColor(Color.WHITE)
            } else {
                txt?.setBackgroundResource(R.drawable.bg_tab_unselected)
                txt?.setTextColor(Color.parseColor("#424242"))
            }
        }
    }

    private fun addToCart() {

        val token = tokenManager.getToken()

        if (token.isNullOrEmpty()) {

            Toast.makeText(
                this,
                "Please Login First",
                Toast.LENGTH_SHORT
            ).show()

            return
        }

        val variantId = selectedVariant?.variantId

        if (variantId == null) {

            Toast.makeText(
                this,
                "Please select variant",
                Toast.LENGTH_SHORT
            ).show()

            return
        }

        lifecycleScope.launch {

            try {

                val response = RetrofitClient.userApi.addToCart(
                    "Bearer $token",
                    CartRequest(
                        productId = product.productId!!,
                        variant = variantId,
                        quantity = currentQuantity
                    )
                )

                if (response.success) {

                    Toast.makeText(
                        this@ProductDetailsActivity,
                        response.message ?: "Added to Cart",
                        Toast.LENGTH_SHORT
                    ).show()

                } else {

                    Toast.makeText(
                        this@ProductDetailsActivity,
                        response.message ?: "Failed to Add Cart",
                        Toast.LENGTH_SHORT
                    ).show()

                }

            } catch (e: Exception) {

                Toast.makeText(
                    this@ProductDetailsActivity,
                    e.message,
                    Toast.LENGTH_SHORT
                ).show()

            }

        }

    }
}