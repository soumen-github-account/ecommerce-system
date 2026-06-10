package ui.address

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.ecommerce.citybasket.R
import data.model.address.AddressData

class AddressAdapter(
    private val addressList: MutableList<AddressData>,
    private val onEditClick: (AddressData) -> Unit,
    private val onDeleteClick: (AddressData, Int) -> Unit
) : RecyclerView.Adapter<AddressAdapter.AddressViewHolder>() {

    class AddressViewHolder(v: View) : RecyclerView.ViewHolder(v) {
        val txtRowAddressType: TextView = v.findViewById(R.id.txtRowAddressType)
        val txtRowDefaultTag: TextView = v.findViewById(R.id.txtRowDefaultTag)
        val txtRowFullName: TextView = v.findViewById(R.id.txtRowFullName)
        val txtRowFullAddress: TextView = v.findViewById(R.id.txtRowFullAddress)
        val txtRowPhone: TextView = v.findViewById(R.id.txtRowPhone)
        val btnRowEdit: TextView = v.findViewById(R.id.btnRowEdit)
        val btnRowDelete: TextView = v.findViewById(R.id.btnRowDelete)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): AddressViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_address_row, parent, false)
        return AddressViewHolder(view)
    }

    override fun onBindViewHolder(holder: AddressViewHolder, position: Int) {
        val address = addressList[position]

        holder.txtRowAddressType.text = (address.addressType ?: "HOME").uppercase()
        holder.txtRowFullName.text = address.fullName
        holder.txtRowPhone.text = "Phone: ${address.phone}"

        // Dynamic Full String Address Formatting
        val fullAddrStr = listOfNotNull(
            address.addressLine1,
            address.addressLine2,
            address.landmark,
            "${address.city}, ${address.state} - ${address.pincode}"
        ).joinToString(", ")
        holder.txtRowFullAddress.text = fullAddrStr

        // Default Address handling
        if (address.isDefault) {
            holder.txtRowDefaultTag.visibility = View.VISIBLE
        } else {
            holder.txtRowDefaultTag.visibility = View.GONE
        }

        // Click Listeners
        holder.btnRowEdit.setOnClickListener { onEditClick(address) }
        holder.btnRowDelete.setOnClickListener { onDeleteClick(address, holder.adapterPosition) }
    }

    override fun getItemCount(): Int = addressList.size

    fun removeAt(position: Int) {
        if (position in addressList.indices) {
            addressList.removeAt(position)
            notifyItemRemoved(position)
            notifyItemRangeChanged(position, addressList.size)
        }
    }
}