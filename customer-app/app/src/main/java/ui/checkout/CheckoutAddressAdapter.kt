package ui.checkout

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.RadioButton
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.ecommerce.citybasket.R
import data.model.address.AddressData

class CheckoutAddressAdapter(
    private val items: List<AddressData>,
    private val onSelected: (AddressData) -> Unit
) : RecyclerView.Adapter<CheckoutAddressAdapter.ViewHolder>() {

    // Backend default structure track index pointer
    private var selectedPosition = items.indexOfFirst { it.isDefault }.let { if (it == -1) 0 else it }

    init {
        if (items.isNotEmpty()) onSelected(items[selectedPosition])
    }

    class ViewHolder(v: View) : RecyclerView.ViewHolder(v) {
        val rbSelectAddress: RadioButton = v.findViewById(R.id.rbSelectAddress)
        val txtType: TextView = v.findViewById(R.id.txtType)
        val txtName: TextView = v.findViewById(R.id.txtName)
        val txtFullDetails: TextView = v.findViewById(R.id.txtFullDetails)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_checkout_address, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val address = items[position]
        holder.txtName.text = address.fullName
        holder.txtType.text = (address.addressType ?: "HOME").uppercase()
        holder.txtFullDetails.text = "${address.addressLine1}, ${address.city} - ${address.pincode}"

        // Match current selection state
        holder.rbSelectAddress.isChecked = (position == selectedPosition)

        holder.itemView.setOnClickListener {
            val copyOfLastChecked = selectedPosition
            selectedPosition = holder.adapterPosition
            notifyItemChanged(copyOfLastChecked)
            notifyItemChanged(selectedPosition)
            onSelected(address)
        }
    }

    override fun getItemCount() = items.size
}