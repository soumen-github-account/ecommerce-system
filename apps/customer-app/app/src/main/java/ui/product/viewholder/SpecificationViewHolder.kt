package ui.product.viewholder

import android.view.LayoutInflater
import android.view.View
import android.widget.LinearLayout
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.ecommerce.citybasket.R
import data.model.product.SpecificationItem

class SpecificationViewHolder(
    itemView: View
) : RecyclerView.ViewHolder(itemView) {

    private val txtGroupTitle =
        itemView.findViewById<TextView>(R.id.txtGroupTitle)

    private val layoutFields =
        itemView.findViewById<LinearLayout>(R.id.layoutFields)

    fun bind(item: SpecificationItem) {

        txtGroupTitle.text = item.group

        layoutFields.removeAllViews()

        item.fields.forEach { field ->

            val row = LayoutInflater.from(itemView.context)
                .inflate(
                    R.layout.item_specification_row,
                    layoutFields,
                    false
                )

            row.findViewById<TextView>(R.id.txtKey).text =
                field.key

            row.findViewById<TextView>(R.id.txtValue).text =
                field.value

            layoutFields.addView(row)

        }

    }

}