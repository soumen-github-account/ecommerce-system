package com.ecommerce.citybasket.ui.category

import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.ecommerce.citybasket.R
import data.model.category.Category

class LeftCategoryAdapter(
    private val categoryList: List<Category>,

    private val onCategoryClick: (String) -> Unit

) : RecyclerView.Adapter<LeftCategoryAdapter.CategoryViewHolder>() {

    private var selectedPosition = 0

    class CategoryViewHolder(view: View) :
        RecyclerView.ViewHolder(view) {

        val imgCategory: ImageView =
            view.findViewById(R.id.imgCategory)

        val txtCategory: TextView =
            view.findViewById(R.id.txtCategory)

        val layoutRoot: View =
            view.findViewById(R.id.layoutRoot)
    }

    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): CategoryViewHolder {

        val view = LayoutInflater.from(parent.context)
            .inflate(
                R.layout.item_left_category,
                parent,
                false
            )

        return CategoryViewHolder(view)
    }

    override fun onBindViewHolder(
        holder: CategoryViewHolder,
        position: Int
    ) {

        val category = categoryList[position]

        holder.txtCategory.text = category.name

        // IMAGE

        Glide.with(holder.itemView.context)
            .load(category.img)
            .placeholder(R.drawable.ic_fashion_tshirt)
            .into(holder.imgCategory)

        // SELECTED EFFECT

        if (selectedPosition == position) {

            holder.layoutRoot.setBackgroundColor(
                Color.WHITE
            )

            holder.txtCategory.setTextColor(
                Color.BLACK
            )

        } else {

            holder.layoutRoot.setBackgroundColor(
                Color.parseColor("#F5F5F5")
            )

            holder.txtCategory.setTextColor(
                Color.parseColor("#666666")
            )
        }

        holder.itemView.setOnClickListener {

            val oldPosition = selectedPosition

            selectedPosition = holder.adapterPosition

            notifyItemChanged(oldPosition)
            notifyItemChanged(selectedPosition)
            onCategoryClick(category.id)

        }
    }

    override fun getItemCount(): Int {

        return categoryList.size
    }
}