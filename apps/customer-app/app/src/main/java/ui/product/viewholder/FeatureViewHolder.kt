package ui.product.viewholder
import android.view.View
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.ecommerce.citybasket.R
import data.model.product.FeatureItem

class FeatureViewHolder(
    itemView: View
) : RecyclerView.ViewHolder(itemView) {

    private val imgIcon = itemView.findViewById<ImageView>(R.id.imgIcon)

    private val txtTitle = itemView.findViewById<TextView>(R.id.txtTitle)

    private val txtValue = itemView.findViewById<TextView>(R.id.txtValue)

    fun bind(item: FeatureItem) {

        txtTitle.text = item.title

        txtValue.text = item.value

        imgIcon.setImageResource(getIcon(item.title))

    }

    private fun getIcon(title: String): Int {

        return when {

            title.contains("Fabric", true) ->
                R.drawable.ic_highlight

            title.contains("Sleeve", true) ->
                R.drawable.ic_highlight

            title.contains("Pattern", true) ->
                R.drawable.ic_highlight

            title.contains("Neck", true) ->
                R.drawable.ic_highlight

            title.contains("Camera", true) ->
                R.drawable.ic_highlight

            title.contains("Battery", true) ->
                R.drawable.ic_highlight

            title.contains("Display", true) ->
                R.drawable.ic_highlight

            else ->
                R.drawable.ic_highlight

        }

    }

}