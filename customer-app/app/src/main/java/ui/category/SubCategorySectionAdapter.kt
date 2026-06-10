package com.ecommerce.citybasket.ui.category

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.ecommerce.citybasket.R
import data.model.category.SubCategory
import data.model.category.SubCategoryLevel2
import ui.category.GridSpacingItemDecoration

class SubCategorySectionAdapter(
    private val subCategories: List<SubCategory>,
    private val onLevel2ItemClick: (SubCategoryLevel2) -> Unit
) : RecyclerView.Adapter<SubCategorySectionAdapter.SectionViewHolder>() {

    class SectionViewHolder(v: View) : RecyclerView.ViewHolder(v) {
        val txtSectionHeader: TextView = v.findViewById(R.id.txtSectionTitle)
        val rvInnerGrid: RecyclerView = v.findViewById(R.id.rvProducts)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): SectionViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_section_header, parent, false)
        return SectionViewHolder(view)
    }

    override fun onBindViewHolder(holder: SectionViewHolder, position: Int) {
        val subCategory = subCategories[position]
        holder.txtSectionHeader.text = subCategory.name

        holder.rvInnerGrid.layoutManager = GridLayoutManager(holder.itemView.context, 3)

        if (holder.rvInnerGrid.itemDecorationCount == 0) {
            holder.rvInnerGrid.addItemDecoration(GridSpacingItemDecoration(3, 24, true))
        }

        // CategoryGridAdapter (Level 2 list) setup
        val innerAdapter = CategoryGridAdapter(subCategory.subCategoryLevel2Ids) { selectedLevel2 ->
            onLevel2ItemClick(selectedLevel2)
        }
        holder.rvInnerGrid.adapter = innerAdapter
    }

    override fun getItemCount(): Int = subCategories.size
}