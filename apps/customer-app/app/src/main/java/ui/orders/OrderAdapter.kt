package ui.orders

import android.content.Context
import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.ecommerce.citybasket.R
import data.model.order.Order
import ui.ordersDetail.OrderDetailsActivity

class OrderAdapter(
    private val context: Context
) : RecyclerView.Adapter<OrderAdapter.OrderViewHolder>() {

    private val orders = ArrayList<Order>()

    fun submitList(list: List<Order>) {
        orders.clear()
        orders.addAll(list)
        notifyDataSetChanged()
    }

    inner class OrderViewHolder(itemView: View) :
        RecyclerView.ViewHolder(itemView) {

        val imgProduct: ImageView =
            itemView.findViewById(R.id.imgProduct)

        val txtProductName: TextView =
            itemView.findViewById(R.id.txtProductName)

        val txtOrderNumber: TextView =
            itemView.findViewById(R.id.txtOrderNumber)

        val txtDate: TextView =
            itemView.findViewById(R.id.txtDate)

        val txtPrice: TextView =
            itemView.findViewById(R.id.txtPrice)

        val txtStatus: TextView =
            itemView.findViewById(R.id.txtStatus)
    }

    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): OrderViewHolder {

        val view = LayoutInflater.from(context)
            .inflate(
                R.layout.item_order,
                parent,
                false
            )

        return OrderViewHolder(view)
    }

    override fun getItemCount() = orders.size

    override fun onBindViewHolder(
        holder: OrderViewHolder,
        position: Int
    ) {

        val order = orders[position]

        val item =
            order.items.firstOrNull()

        holder.txtProductName.text =
            item?.snapshot?.title ?: "Product"

        holder.txtOrderNumber.text =
            order.orderNumber

        holder.txtDate.text =
            order.createdAt

        holder.txtPrice.text =
            "₹${order.pricing.totalAmount}"

        holder.txtStatus.text =
            order.status

        Glide.with(context)
            .load(item?.snapshot?.image)
            .placeholder(android.R.drawable.ic_menu_gallery)
            .error(android.R.drawable.ic_menu_report_image)
            .into(holder.imgProduct)

        when (order.status) {

            "PLACED" -> holder.txtStatus.setTextColor(
                context.getColor(android.R.color.holo_blue_dark)
            )

            "PACKED" -> holder.txtStatus.setTextColor(
                context.getColor(android.R.color.holo_orange_dark)
            )

            "SHIPPED" -> holder.txtStatus.setTextColor(
                context.getColor(android.R.color.holo_purple)
            )

            "OUT_FOR_DELIVERY" -> holder.txtStatus.setTextColor(
                context.getColor(android.R.color.holo_red_dark)
            )

            "DELIVERED" -> holder.txtStatus.setTextColor(
                context.getColor(android.R.color.holo_green_dark)
            )

            "CANCELLED" -> holder.txtStatus.setTextColor(
                context.getColor(android.R.color.darker_gray)
            )
        }

        holder.itemView.setOnClickListener {

            println("CLICK ORDER ID = ${order._id}")

            val intent = Intent(
                context,
                OrderDetailsActivity::class.java
            )

            intent.putExtra(
                "ORDER_ID",
                order._id
            )

            context.startActivity(intent)
        }
    }

}