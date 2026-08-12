package ui.product.viewholder
import android.view.View
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.ecommerce.citybasket.R
import data.model.product.ManufacturerItem

class ManufacturerViewHolder(
    itemView: View
) : RecyclerView.ViewHolder(itemView) {

    private val txtTitle =
        itemView.findViewById<TextView>(R.id.txtTitle)

    private val txtValue =
        itemView.findViewById<TextView>(R.id.txtValue)

    fun bind(item: ManufacturerItem) {

        txtTitle.text = item.title

        txtValue.text = item.value

    }

}