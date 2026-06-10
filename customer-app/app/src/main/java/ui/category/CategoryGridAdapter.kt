package com.ecommerce.citybasket.ui.category

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.ecommerce.citybasket.R
import data.model.category.SubCategoryLevel2

class CategoryGridAdapter(
    private val itemList: List<SubCategoryLevel2>,
    private val onItemClick: (SubCategoryLevel2) -> Unit // 🔥 Click handle karne ke liye add kiya
) : RecyclerView.Adapter<CategoryGridAdapter.GridViewHolder>() {

    class GridViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val imgItem: ImageView = view.findViewById(R.id.imgItem)
        val txtItem: TextView = view.findViewById(R.id.txtItem)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): GridViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_category_grid, parent, false)
        return GridViewHolder(view)
    }

    override fun onBindViewHolder(holder: GridViewHolder, position: Int) {
        val item = itemList[position]
        holder.txtItem.text = item.name

        Glide.with(holder.itemView.context)
            .load(item.img)
            .placeholder(R.drawable.ic_fashion_tshirt)
            .error(R.drawable.ic_fashion_tshirt)
            .into(holder.imgItem)

        // Click wrapper connection
        holder.itemView.setOnClickListener { onItemClick(item) }
    }

    override fun getItemCount(): Int = itemList.size
}