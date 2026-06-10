package com.ecommerce.citybasket.ui.home

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.ecommerce.citybasket.R
import data.model.HomeSection

class HomeSectionAdapter(
    private val sections: List<HomeSection>,
    private val onWishlistClick: (productId: String) -> Unit // FIXED: Wishlist callback function joda
) : RecyclerView.Adapter<HomeSectionAdapter.SectionViewHolder>() {

    class SectionViewHolder(v: View) : RecyclerView.ViewHolder(v) {
        val txtTitle: TextView = v.findViewById(R.id.txtSectionTitle)
        val rvProducts: RecyclerView = v.findViewById(R.id.rvProducts)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): SectionViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_section_header, parent, false)
        return SectionViewHolder(view)
    }

    override fun onBindViewHolder(holder: SectionViewHolder, position: Int) {
        val section = sections[position]
        holder.txtTitle.text = section.title

        holder.rvProducts.layoutManager = GridLayoutManager(holder.itemView.context, 2)

        // FIXED: HomeProductAdapter me lambda trigger pass kiya jo id bhejega
        holder.rvProducts.adapter = HomeProductAdapter(section.products) { productId ->
            onWishlistClick(productId) // Yeh call wapas HomeFragment ko trigger karegi
        }
    }

    override fun getItemCount(): Int = sections.size
}