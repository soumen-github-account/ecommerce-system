package ui.product
import androidx.recyclerview.widget.DiffUtil
import data.model.product.AllDetailsItem

class AllDetailsDiffCallback : DiffUtil.ItemCallback<AllDetailsItem>() {

    override fun areItemsTheSame(
        oldItem: AllDetailsItem,
        newItem: AllDetailsItem
    ): Boolean {

        return oldItem == newItem

    }

    override fun areContentsTheSame(
        oldItem: AllDetailsItem,
        newItem: AllDetailsItem
    ): Boolean {

        return oldItem == newItem

    }

}