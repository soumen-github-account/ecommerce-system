
package com.ecommerce.citybasket.ui.home

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.ecommerce.citybasket.R
import data.model.category.TopCategory

class TopCategoryAdapter(
    private val items: List<TopCategory>,
    private val onItemClick: (TopCategory, Int) -> Unit
) : RecyclerView.Adapter<TopCategoryAdapter.CategoryViewHolder>() {

    private var selectedPosition = 0

    class CategoryViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val rootLayout: View = view.findViewById(R.id.rootLayout)
        val iconContainer: androidx.cardview.widget.CardView = view.findViewById(R.id.iconContainer)
        val imgIcon: ImageView = view.findViewById(R.id.imgCategoryIcon)
        val txtName: TextView = view.findViewById(R.id.txtCategoryName)
        val selectionIndicator: View = view.findViewById(R.id.selectionIndicator)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CategoryViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_category, parent, false)
        return CategoryViewHolder(view)
    }

    override fun onBindViewHolder(holder: CategoryViewHolder, position: Int) {
        val currentItem = items[position]
        holder.txtName.text = currentItem.name
        holder.imgIcon.setImageResource(currentItem.img)

        // Context uthane ke liye
        val context = holder.itemView.context

        if (position == selectedPosition) {
            // 1. Jab select ho: BG white karo
            holder.iconContainer.setCardBackgroundColor(androidx.core.content.ContextCompat.getColor(context, R.color.white))

            // 2. Icon ka stroke color Black kar do dynamically
            holder.imgIcon.setColorFilter(androidx.core.content.ContextCompat.getColor(context, R.color.black))

            // Niche ki line aur text ko visible/bright karo
            holder.selectionIndicator.visibility = View.VISIBLE
            holder.txtName.alpha = 1.0f
        } else {
            // 1. Jab select na ho: BG Transparent ya thoda dim white (#1AFFFFFF)
            holder.iconContainer.setCardBackgroundColor(android.graphics.Color.parseColor("#1AFFFFFF"))

            // 2. Icon ko wapas pure White stroke me rakho
            holder.imgIcon.setColorFilter(androidx.core.content.ContextCompat.getColor(context, R.color.white))

            // Indicator chupao
            holder.selectionIndicator.visibility = View.INVISIBLE
            holder.txtName.alpha = 0.7f
        }

        holder.rootLayout.setOnClickListener {
            val previousSelected = selectedPosition
            selectedPosition = holder.adapterPosition

            notifyItemChanged(previousSelected)
            notifyItemChanged(selectedPosition)

            onItemClick(currentItem, selectedPosition)
        }
    }

    override fun getItemCount(): Int = items.size
}