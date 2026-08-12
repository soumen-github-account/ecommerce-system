package ui.Pickups
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.ecommerce.pickuppartnerapp.R
import com.google.android.material.button.MaterialButton
import data.model.pickup.PickupModel

class PickupAdapter(

    private val pickupList: List<PickupModel>

) : RecyclerView.Adapter<PickupAdapter.PickupViewHolder>() {

    inner class PickupViewHolder(itemView: View) :
        RecyclerView.ViewHolder(itemView) {

        val txtPickupId: TextView =
            itemView.findViewById(R.id.txtPickupId)

        val txtSellerName: TextView =
            itemView.findViewById(R.id.txtSellerName)

        val txtAddress: TextView =
            itemView.findViewById(R.id.txtAddress)

        val txtDistance: TextView =
            itemView.findViewById(R.id.txtDistance)

        val txtTime: TextView =
            itemView.findViewById(R.id.txtTime)

        val txtStatus: TextView =
            itemView.findViewById(R.id.txtStatus)

        val btnViewDetails: MaterialButton =
            itemView.findViewById(R.id.btnViewDetails)

        val btnCall: ImageView =
            itemView.findViewById(R.id.btnCall)

    }

    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): PickupViewHolder {

        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_pickup, parent, false)

        return PickupViewHolder(view)

    }

    override fun onBindViewHolder(
        holder: PickupViewHolder,
        position: Int
    ) {

        val pickup = pickupList[position]

        holder.txtPickupId.text = pickup.pickupId

        holder.txtSellerName.text = pickup.sellerName

        holder.txtAddress.text = pickup.address

        holder.txtDistance.text = pickup.distance

        holder.txtTime.text = pickup.time

        holder.txtStatus.text = pickup.status

        holder.btnViewDetails.setOnClickListener {

            // TODO
            // Open Pickup Details

        }

        holder.btnCall.setOnClickListener {

            // TODO
            // Call Seller

        }

    }

    override fun getItemCount(): Int {

        return pickupList.size

    }

}