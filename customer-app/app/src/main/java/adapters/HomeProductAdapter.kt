package com.ecommerce.citybasket.ui.home

import android.content.Intent
import android.graphics.Paint
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.ecommerce.citybasket.R
import com.ecommerce.citybasket.ui.product.ProductDetailsActivity
import data.model.product.Product

class HomeProductAdapter(
    private val productList: List<Product>,
    private val onWishlistClick: (productId: String) -> Unit
) : RecyclerView.Adapter<HomeProductAdapter.ProductViewHolder>() {

    class ProductViewHolder(v: View) : RecyclerView.ViewHolder(v) {
        val imgProduct: ImageView = v.findViewById(R.id.imgProduct)
        val txtBrand: TextView = v.findViewById(R.id.txtBrand)
        val txtRating: TextView = v.findViewById(R.id.txtRating)
        val txtTitle: TextView = v.findViewById(R.id.txtTitle)
        val txtPrice: TextView = v.findViewById(R.id.txtPrice)
        val txtOriginalPrice: TextView = v.findViewById(R.id.txtOriginalPrice)
        val txtDiscount: TextView = v.findViewById(R.id.txtDiscount)
        val imgWishlist: ImageView = v.findViewById(R.id.imgWishlist)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ProductViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_product_card, parent, false)
        return ProductViewHolder(view)
    }

    override fun onBindViewHolder(holder: ProductViewHolder, position: Int) {
        val product = productList[position]

        // 1. TITLE
        holder.txtTitle.text = product.name ?: "Product Name"

        // 2. BRAND (Safe extraction check)
        // Agar details array null/empty hai toh safe "CityBasket" standard string fallback diya
        holder.txtBrand.text = try {
            product.details?.getOrNull(0) ?: "Brand"
        } catch (e: Exception) {
            "Brand"
        }

        // 3. RATING
        holder.txtRating.text = "4.5"

        // 4. PRICE PARSING (Most Critical Crash point)
        // Agar price list array format me nahi aa rahi direct string/int hai, toh crash se bachayega
        val finalPrice = try {
            product.price?.getOrNull(0) ?: 0
        } catch (e: Exception) {
            0
        }
        holder.txtPrice.text = "₹$finalPrice"

        // 5. ORIGINAL PRICE & DISCOUNT
        val discountPercent = product.discount ?: 0
        val originalPrice = finalPrice + ((finalPrice * discountPercent) / 100)
        holder.txtOriginalPrice.text = "₹$originalPrice"
        holder.txtOriginalPrice.paintFlags = holder.txtOriginalPrice.paintFlags or Paint.STRIKE_THRU_TEXT_FLAG

        holder.txtDiscount.text = "$discountPercent% OFF"

        // 6. IMAGE PARSING WITH ABSOLUTE IP ADDRESS CHECK
        // Agar database me product image online link nahi hai toh URL format absolute banao
        val rawImage = try {
            product.images?.getOrNull(0)
        } catch (e: Exception) {
            null
        }

        val finalImageUrl = when {
            rawImage.isNullOrEmpty() -> ""
            rawImage.startsWith("http") -> rawImage
            else -> "http://10.0.2.2:5000/${rawImage.trimStart('/')}" // ⚠️ Apna node server port match kar lena
        }

        Glide.with(holder.itemView.context)
            .load(finalImageUrl)
            .placeholder(R.drawable.ic_fashion_tshirt)
            .error(R.drawable.ic_fashion_tshirt)
            .into(holder.imgProduct)

        // 7. WISHLIST CONTROL
        if (product.isWishlisted) {
            holder.imgWishlist.setImageResource(R.drawable.heart)
        } else {
            holder.imgWishlist.setImageResource(R.drawable.ic_heart)
        }

        holder.imgWishlist.setOnClickListener {
            product.id?.let { productId ->
                product.isWishlisted = !product.isWishlisted
                notifyItemChanged(position)
                onWishlistClick(productId)
            }
        }

        // 8. INTENT CLICK TO DETAILS
        holder.itemView.setOnClickListener {
            val context = holder.itemView.context
            val intent = Intent(context, ProductDetailsActivity::class.java)
            intent.putExtra("PRODUCT_ID", product.id)
            context.startActivity(intent)
        }
    }

    override fun getItemCount(): Int = productList.size
}