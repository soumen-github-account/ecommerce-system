package com.ecommerce.citybasket.ui.cart

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.ecommerce.citybasket.R
import data.remote.response.CartItemResponse

class CartAdapter(
    private val cartList: List<CartItemResponse>,
    private val subTotal: Int,
    private val shippingCharges: Int,
    private val grandTotal: Int,
    private val onDeleteClick: (productId: String) -> Unit,
    private val onQuantityUpdateClick: (productId: String, action: String) -> Unit // FIXED: Quantity change callback joda
) : RecyclerView.Adapter<RecyclerView.ViewHolder>() {

    companion object {
        private const val TYPE_PRODUCT = 0
        private const val TYPE_FOOTER = 1
    }

    class CartViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val imgProduct: ImageView = view.findViewById(R.id.imgProduct)
        val txtBrand: TextView = view.findViewById(R.id.txtBrand)
        val txtTitle: TextView = view.findViewById(R.id.txtTitle)
        val txtPrice: TextView = view.findViewById(R.id.txtPrice)
        val txtQuantity: TextView = view.findViewById(R.id.txtQuantity)
        val txtVariant: TextView? = view.findViewById(R.id.txtVariant)
        val btnDelete: ImageButton = view.findViewById(R.id.btnDelete)
        val btnMinus: TextView = view.findViewById(R.id.btnMinus) // FIXED: Minus button linked
        val btnPlus: TextView = view.findViewById(R.id.btnPlus)   // FIXED: Plus button linked
    }

    class FooterViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val txtSubtotal: TextView = view.findViewById(R.id.txtSubtotal)
        val txtShipping: TextView = view.findViewById(R.id.txtShipping)
        val txtGrandTotal: TextView = view.findViewById(R.id.txtGrandTotal)
    }

    override fun getItemViewType(position: Int): Int = if (position == cartList.size) TYPE_FOOTER else TYPE_PRODUCT

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder {
        return if (viewType == TYPE_PRODUCT) {
            CartViewHolder(LayoutInflater.from(parent.context).inflate(R.layout.item_cart_product, parent, false))
        } else {
            FooterViewHolder(LayoutInflater.from(parent.context).inflate(R.layout.item_cart_footer, parent, false))
        }
    }

    override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
        // ... inside onBindViewHolder
        if (holder is CartViewHolder) {
            val cartItem = cartList[position]
            val product = cartItem.product

            // 1. Data Mapping
            holder.txtTitle.text = product?.title ?: "N/A"
            holder.txtBrand.text = product?.brand ?: "CityBasket"

            // 2. Direct Price from CartItemResponse
            holder.txtPrice.text = "₹${cartItem.price * cartItem.quantity}"
            holder.txtQuantity.text = "${cartItem.quantity}"

            // 3. Image loading (Using the clean field from response)
            val finalImageUrl = when {
                cartItem.image.isNullOrEmpty() -> ""
                cartItem.image.startsWith("http") -> cartItem.image
                else -> "http://10.0.2.2:5000/${cartItem.image.trimStart('/')}"
            }

            Glide.with(holder.itemView.context)
                .load(finalImageUrl)
                .placeholder(R.drawable.ic_fashion_tshirt)
                .into(holder.imgProduct)

            // 4. Listeners
            holder.btnDelete.setOnClickListener { onDeleteClick(cartItem._id) }
            holder.btnPlus.setOnClickListener { onQuantityUpdateClick(cartItem._id, "increment") }
            holder.btnMinus.setOnClickListener { onQuantityUpdateClick(cartItem._id, "decrement") }
        }
        else if (holder is FooterViewHolder) {
            holder.txtSubtotal.text = "₹$subTotal"
            holder.txtShipping.text = "₹$shippingCharges"
            holder.txtGrandTotal.text = "₹$grandTotal"
        }
    }

    override fun getItemCount(): Int = cartList.size + 1
}