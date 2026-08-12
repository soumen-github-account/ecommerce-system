package ui.ordersDetail

import android.content.Context
import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.ecommerce.citybasket.R
import data.remote.response.TrackingItem

class TrackingAdapter(
    private val context: Context
) : RecyclerView.Adapter<TrackingAdapter.ViewHolder>() {

    private val list = ArrayList<TrackingItem>()

    fun submitList(data: List<TrackingItem>) {
        list.clear()
        list.addAll(data)
        notifyDataSetChanged()
    }

    inner class ViewHolder(itemView: View) :
        RecyclerView.ViewHolder(itemView) {

        val topLine: View =
            itemView.findViewById(R.id.topLine)

        val bottomLine: View =
            itemView.findViewById(R.id.bottomLine)

        val imgStatus: ImageView =
            itemView.findViewById(R.id.imgStatus)

        val txtTitle: TextView =
            itemView.findViewById(R.id.txtTitle)

        val txtDescription: TextView =
            itemView.findViewById(R.id.txtDescription)

        val txtDate: TextView =
            itemView.findViewById(R.id.txtDate)

        val txtTime: TextView =
            itemView.findViewById(R.id.txtTime)
    }

    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): ViewHolder {

        return ViewHolder(
            LayoutInflater.from(context).inflate(
                R.layout.item_tracking,
                parent,
                false
            )
        )
    }

    override fun getItemCount() = list.size

    override fun onBindViewHolder(
        holder: ViewHolder,
        position: Int
    ) {

        val item = list[position]

        holder.txtTitle.text = item.title
        holder.txtDescription.text = item.description

        holder.txtDate.text = item.date

//        holder.txtTime.text =
//            if (item.date.length >= 16)
//                item.date.substring(11, 16)
//            else
//                ""
        holder.txtDate.text =
            item.date ?: "Pending"

        holder.txtTime.text =
            item.date
                ?.takeIf { it.length >= 16 }
                ?.substring(11, 16)
                ?: "--:--"

        if (item.completed) {

            holder.imgStatus.setImageResource(
                R.drawable.ic_check_circle
            )

            holder.topLine.setBackgroundColor(
                Color.parseColor("#14A83B")
            )

            holder.bottomLine.setBackgroundColor(
                Color.parseColor("#14A83B")
            )

        } else {

            holder.imgStatus.setImageResource(
                R.drawable.ic_pending_circle
            )

            holder.topLine.setBackgroundColor(
                Color.parseColor("#DADADA")
            )

            holder.bottomLine.setBackgroundColor(
                Color.parseColor("#DADADA")
            )

        }

        holder.topLine.visibility =
            if (position == 0) View.INVISIBLE else View.VISIBLE

        holder.bottomLine.visibility =
            if (position == list.size - 1)
                View.INVISIBLE
            else
                View.VISIBLE
    }
}