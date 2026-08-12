package ui.product.viewholder

import android.view.View
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.ecommerce.citybasket.R
import data.model.product.DescriptionItem

class DescriptionViewHolder(
    itemView: View
) : RecyclerView.ViewHolder(itemView) {

    private val txtDescription =
        itemView.findViewById<TextView>(R.id.txtDescription)

    private val txtReadMore =
        itemView.findViewById<TextView>(R.id.txtReadMore)

    private var expanded = false

    fun bind(item: DescriptionItem) {

        txtDescription.text = item.description

        txtDescription.post {

            if (txtDescription.lineCount > 6) {

                txtReadMore.visibility = View.VISIBLE

            } else {

                txtReadMore.visibility = View.GONE

            }

        }

        txtReadMore.setOnClickListener {

            expanded = !expanded

            if (expanded) {

                txtDescription.maxLines = Int.MAX_VALUE

                txtReadMore.text = "Read Less"

            } else {

                txtDescription.maxLines = 6

                txtReadMore.text = "Read More"

            }

        }

    }

}