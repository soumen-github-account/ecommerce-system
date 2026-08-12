package ui.checkout

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.ecommerce.citybasket.R
import data.remote.response.CartItemResponse

class SummaryProductAdapter(private val items: List<CartItemResponse>) :
    RecyclerView.Adapter<SummaryProductAdapter.ViewHolder>() {

    class ViewHolder(v: View) : RecyclerView.ViewHolder(v) {
        val imgProduct: ImageView = v.findViewById(R.id.imgSummaryProduct)
        val txtName: TextView = v.findViewById(R.id.txtSummaryProductName)
        val txtQtyPrice: TextView = v.findViewById(R.id.txtSummaryProductQtyPrice)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_summary_product, parent, false)
        return ViewHolder(view)
    }

//    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
//        val item = items[position]
//        val product = item.product
//
//        holder.txtName.text = product?.name ?: "Product Item"
//
//        // Backend controller ke hisaab se price product.price[0] me hai
//        val singlePrice = product?.price?.firstOrNull() ?: 0
//        holder.txtQtyPrice.text = "Qty: ${item.quantity}  •  ₹${singlePrice * item.quantity}"
//
//        // Product image load karne ke liye safely check karein
//        if (!product?.images.isNullOrEmpty()) {
//            Glide.with(holder.itemView.context)
//                .load(product!!.images[0])
//                .placeholder(R.drawable.ic_launcher_background)
//                .into(holder.imgProduct)
//        }
//    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val item = items[position]
        val product = item.product

        // 1. Name mapping
        holder.txtName.text = product?.title ?: "Product Item"

        // 2. Pricing mapping (Ab 'item.price' direct use karein jo controller se aa raha hai)
        val totalItemPrice = item.price * item.quantity
        holder.txtQtyPrice.text = "Qty: ${item.quantity}  •  ₹$totalItemPrice"

        // 3. Image Loading (Consistency ke liye same logic)
        val finalImageUrl = when {
            item.image.isNullOrEmpty() -> ""
            item.image.startsWith("http") -> item.image
            else -> "http://10.0.2.2:5000/${item.image.trimStart('/')}"
        }

        Glide.with(holder.itemView.context)
            .load(finalImageUrl)
            .placeholder(R.drawable.ic_fashion_tshirt) // Placeholder update kar dein
            .error(R.drawable.ic_fashion_tshirt)
            .into(holder.imgProduct)
    }

    override fun getItemCount() = items.size
}