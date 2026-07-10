package com.ecommerce.citybasket.ui.home

import android.content.Intent
import android.graphics.Paint
import android.util.Log
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

    private val productList: MutableList<Product>,

    private val onWishlistClick: (
        productId: String,
        variantId: String,
        sellerId: String,
        isWishlisted: Boolean,
        position: Int
    ) -> Unit

) : RecyclerView.Adapter<HomeProductAdapter.ProductViewHolder>() {

    class ProductViewHolder(itemView: View) :
        RecyclerView.ViewHolder(itemView) {

        val imgProduct: ImageView =
            itemView.findViewById(R.id.imgProduct)

        val imgWishlist: ImageView =
            itemView.findViewById(R.id.imgWishlist)

        val txtTitle: TextView =
            itemView.findViewById(R.id.txtTitle)

        val txtBrand: TextView =
            itemView.findViewById(R.id.txtBrand)

        val txtPrice: TextView =
            itemView.findViewById(R.id.txtPrice)

        val txtOriginalPrice: TextView =
            itemView.findViewById(R.id.txtOriginalPrice)

        val txtDiscount: TextView =
            itemView.findViewById(R.id.txtDiscount)

        val txtRating: TextView =
            itemView.findViewById(R.id.txtRating)
    }

    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): ProductViewHolder {

        val view = LayoutInflater.from(parent.context)
            .inflate(
                R.layout.item_product_card,
                parent,
                false
            )

        return ProductViewHolder(view)
    }

    override fun onBindViewHolder(
        holder: ProductViewHolder,
        position: Int
    ) {

        val product = productList[position]

        //---------------------------
        // TITLE
        //---------------------------

        holder.txtTitle.text =
            product.title ?: ""

        holder.txtBrand.text =
            product.brand ?: ""

        holder.txtRating.text = "4.5"

        //---------------------------
        // PRICE
        //---------------------------

        val selling =
            product.pricing?.sellingPrice ?: 0.0

        val mrp =
            product.pricing?.mrp ?: 0.0

        val discount =
            product.pricing?.discount ?: 0.0

        holder.txtPrice.text =
            "₹${selling.toInt()}"

        holder.txtOriginalPrice.text =
            "₹${mrp.toInt()}"

        holder.txtOriginalPrice.paintFlags =
            holder.txtOriginalPrice.paintFlags or
                    Paint.STRIKE_THRU_TEXT_FLAG

        holder.txtDiscount.text =
            "${discount.toInt()}% OFF"

        //---------------------------
        // IMAGE
        //---------------------------

        Glide.with(holder.itemView.context)
            .load(product.image)
            .placeholder(R.drawable.ic_fashion_tshirt)
            .error(R.drawable.ic_fashion_tshirt)
            .into(holder.imgProduct)

        //---------------------------
        // HEART
        //---------------------------

        updateWishlistIcon(holder, product.isWishlisted)

        holder.imgWishlist.setOnClickListener {

            val newState = !product.isWishlisted

            // Instant UI update

            product.isWishlisted = newState

            updateWishlistIcon(holder, newState)

            product.productId?.let {
                val productId = product.productId ?: return@setOnClickListener
                val variantId = product.variantId ?: return@setOnClickListener
                val sellerId = product.sellerId ?: return@setOnClickListener

                onWishlistClick(
                    productId,
                    variantId,
                    sellerId,
                    newState,
                    holder.adapterPosition
                )

            }

        }

        holder.itemView.setOnClickListener {

            Log.d("HOME_CLICK", "id = ${product.id}")
            Log.d("HOME_CLICK", "productId = ${product.productId}")

            val intent = Intent(holder.itemView.context, ProductDetailsActivity::class.java)

            intent.putExtra("PRODUCT_ID", product.variantId)

            holder.itemView.context.startActivity(intent)
        }

    }

    private fun updateWishlistIcon(
        holder: ProductViewHolder,
        isWishlisted: Boolean
    ) {

        if (isWishlisted) {

            holder.imgWishlist.setImageResource(
                R.drawable.heart
            )

        } else {

            holder.imgWishlist.setImageResource(
                R.drawable.ic_heart
            )

        }

    }

    /**
     * API fail hone par rollback
     */

    fun rollbackWishlist(
        position: Int
    ) {

        if (position !in productList.indices)
            return

        productList[position].isWishlisted =
            !productList[position].isWishlisted

        notifyItemChanged(position)

    }

    /**
     * Wishlist page se remove
     */

    fun removeProduct(
        position: Int
    ) {

        if (position !in productList.indices)
            return

        productList.removeAt(position)

        notifyItemRemoved(position)

    }

    override fun getItemCount(): Int {

        return productList.size

    }

}