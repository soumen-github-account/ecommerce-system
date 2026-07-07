package ui.product.adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.ecommerce.citybasket.R
import data.model.product.AllDetailsItem
import data.model.product.DescriptionItem
import data.model.product.FeatureItem
import data.model.product.ManufacturerItem
import data.model.product.SpecificationItem
import ui.product.AllDetailsDiffCallback
import ui.product.viewholder.DescriptionViewHolder
import ui.product.viewholder.FeatureViewHolder
import ui.product.viewholder.ManufacturerViewHolder
import ui.product.viewholder.SpecificationViewHolder


class AllDetailsAdapter :

    ListAdapter<AllDetailsItem, RecyclerView.ViewHolder>(

        AllDetailsDiffCallback()

    ) {
    companion object {

        const val TYPE_FEATURE = 1

        const val TYPE_SPECIFICATION = 2

        const val TYPE_DESCRIPTION = 3

        const val TYPE_MANUFACTURER = 4
    }

    override fun getItemCount() = currentList.size


    override fun getItemViewType(position: Int): Int {

        return when (currentList[position]) {

            is FeatureItem -> TYPE_FEATURE

            is SpecificationItem -> TYPE_SPECIFICATION

            is DescriptionItem -> TYPE_DESCRIPTION

            is ManufacturerItem -> TYPE_MANUFACTURER
        }
    }

    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): RecyclerView.ViewHolder {

        val inflater = LayoutInflater.from(parent.context)

        return when (viewType) {

            TYPE_FEATURE -> {

                FeatureViewHolder(

                    inflater.inflate(
                        R.layout.item_feature,
                        parent,
                        false
                    )
                )

            }

            TYPE_SPECIFICATION -> {

                SpecificationViewHolder(

                    inflater.inflate(
                        R.layout.item_specification_group,
                        parent,
                        false
                    )
                )

            }

            TYPE_DESCRIPTION -> {

                DescriptionViewHolder(

                    inflater.inflate(
                        R.layout.item_description,
                        parent,
                        false
                    )
                )

            }

            else -> {

                ManufacturerViewHolder(

                    inflater.inflate(
                        R.layout.item_manufacturer,
                        parent,
                        false
                    )
                )

            }

        }

    }

    override fun onBindViewHolder(
        holder: RecyclerView.ViewHolder,
        position: Int
    ) {

        when (val item = currentList[position]) {

            is FeatureItem ->

                (holder as FeatureViewHolder).bind(item)

            is SpecificationItem ->

                (holder as SpecificationViewHolder).bind(item)

            is DescriptionItem ->

                (holder as DescriptionViewHolder).bind(item)

            is ManufacturerItem ->

                (holder as ManufacturerViewHolder).bind(item)

        }

    }


}