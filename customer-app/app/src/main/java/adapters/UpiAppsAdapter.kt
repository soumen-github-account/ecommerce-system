package adapters

import android.content.Intent
import android.net.Uri
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.ImageView
import android.widget.RadioButton
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import data.model.upi.UpiApp
import com.ecommerce.citybasket.R

class UpiAppsAdapter(
    private val apps: List<UpiApp>,
    private val onAppSelected: (UpiApp) -> Unit,
    private val onPayClicked: (UpiApp) -> Unit
) : RecyclerView.Adapter<UpiAppsAdapter.ViewHolder>() {

    private var selectedPosition = -1

    inner class ViewHolder(view: View)
        : RecyclerView.ViewHolder(view) {

        val radio = view.findViewById<RadioButton>(R.id.radioSelect)
        val name = view.findViewById<TextView>(R.id.txtAppName)
        val logo = view.findViewById<ImageView>(R.id.imgLogo)
        val btnPay = view.findViewById<Button>(R.id.btnPayItem)
    }

    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): ViewHolder {

        val view = LayoutInflater.from(parent.context)
            .inflate(
                R.layout.item_upi_app,
                parent,
                false
            )

        return ViewHolder(view)
    }

    override fun getItemCount() = apps.size


    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val app = apps[position]

        holder.name.text = app.appName
        holder.logo.setImageDrawable(app.icon)

        // Radio button logic
        holder.radio.isChecked = (selectedPosition == position)

        // Button visibility logic
        holder.btnPay.visibility = if (selectedPosition == position) View.VISIBLE else View.GONE

        holder.itemView.setOnClickListener {

            selectedPosition = holder.adapterPosition

            notifyDataSetChanged()

            onAppSelected(app)
        }

        // Pay button click
        holder.btnPay.setOnClickListener {

            onPayClicked(app)
        }
    }

}