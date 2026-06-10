package ui.product

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.ecommerce.citybasket.R

class DotAdapter(
    private var count: Int
) : RecyclerView.Adapter<DotAdapter.DotVH>() {

    var selectedPos = 0

    inner class DotVH(view: View) : RecyclerView.ViewHolder(view) {
        val dot: View = view.findViewById(R.id.dotView)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): DotVH {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_dot, parent, false)
        return DotVH(view)
    }

    override fun onBindViewHolder(holder: DotVH, position: Int) {
        holder.dot.alpha = if (position == selectedPos) 1f else 0.3f
    }

    override fun getItemCount() = count

    fun update(pos: Int) {
        selectedPos = pos
        notifyDataSetChanged()
    }
}