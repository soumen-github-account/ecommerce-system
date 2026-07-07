package ui.product

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.ecommerce.citybasket.R
import data.model.DetailItem

class DetailAdapter(
    private val list: MutableList<DetailItem>
) : RecyclerView.Adapter<DetailAdapter.ViewHolder>() {

    inner class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {

        val title: TextView = view.findViewById(R.id.txtTitle)

        val value: TextView = view.findViewById(R.id.txtValue)

    }

    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): ViewHolder {

        val view = LayoutInflater.from(parent.context)

            .inflate(
                R.layout.item_detail,
                parent,
                false
            )

        return ViewHolder(view)

    }

    override fun onBindViewHolder(
        holder: ViewHolder,
        position: Int
    ) {

        val item = list[position]

        holder.title.text = item.title

        holder.value.text = item.value

    }

    override fun getItemCount() = list.size

    fun submitList(newList: List<DetailItem>) {

        list.clear()

        list.addAll(newList)

        notifyDataSetChanged()

    }

}