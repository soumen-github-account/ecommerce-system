package com.ecommerce.citybasket.ui.category

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.ecommerce.citybasket.R
import data.model.category.SubCategory

class SubCategoryGridAdapter(
    private val itemList: List<SubCategory>,
    private val onItemClick: (SubCategory) -> Unit
) : RecyclerView.Adapter<SubCategoryGridAdapter.GridViewHolder>() {

    class GridViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val imgItem: ImageView = view.findViewById(R.id.imgItem)
        val txtItem: TextView = view.findViewById(R.id.txtItem)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): GridViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_category_grid, parent, false)
        return GridViewHolder(view)
    }

    override fun onBindViewHolder(holder: GridViewHolder, position: Int) {
        val item = itemList[position]
        holder.txtItem.text = item.name

        // Image parsing absolute link check
        val finalImageUrl = if (item.img.isNullOrEmpty()) {
            ""
        } else if (item.img.startsWith("http")) {
            item.img
        } else {
            "http://10.0.2.2:5000/${item.img.trimStart('/')}" // ⚠️ Apna port numbers check kar lena
        }

        Glide.with(holder.itemView.context)
            .load(finalImageUrl)
            .placeholder(R.drawable.ic_fashion_tshirt)
            .error(R.drawable.ic_fashion_tshirt)
            .into(holder.imgItem)

        holder.itemView.setOnClickListener { onItemClick(item) }
    }

    override fun getItemCount(): Int = itemList.size
}