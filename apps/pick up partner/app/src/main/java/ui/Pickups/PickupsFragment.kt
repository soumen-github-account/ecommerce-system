package ui.Pickups

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.ecommerce.pickuppartnerapp.MainActivity
import com.ecommerce.pickuppartnerapp.R
import data.model.pickup.PickupModel


class PickupsFragment : Fragment() {

    private lateinit var rvPickups: RecyclerView
    private lateinit var pickupAdapter: PickupAdapter
    private val pickupList = ArrayList<PickupModel>()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {

        return inflater.inflate(
            R.layout.fragment_pickups,
            container,
            false
        )

    }

    override fun onResume() {
        super.onResume()

        (activity as? MainActivity)?.updateToolbar(
            title = "Assigned Pickups",
            showMenu = true,
            showNotification = true
        )
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        rvPickups = view.findViewById(R.id.rvPickups)

        setupRecyclerView()

        loadDummyData()

    }

    private fun setupRecyclerView() {

        pickupAdapter = PickupAdapter(pickupList)

        rvPickups.layoutManager = LinearLayoutManager(requireContext())

        rvPickups.adapter = pickupAdapter

    }

    private fun loadDummyData() {

        pickupList.clear()

        pickupList.add(
            PickupModel(
                pickupId = "PK1023",
                sellerName = "ABC Electronics",
                address = "Salt Lake, Kolkata",
                distance = "3.2 KM",
                time = "10:30 AM - 12:00 PM",
                status = "Pending"
            )
        )

        pickupList.add(
            PickupModel(
                pickupId = "PK1024",
                sellerName = "Fashion World",
                address = "Howrah",
                distance = "5.5 KM",
                time = "11:00 AM - 01:00 PM",
                status = "Pending"
            )
        )

        pickupList.add(
            PickupModel(
                pickupId = "PK1025",
                sellerName = "Mobile Planet",
                address = "New Town",
                distance = "7.8 KM",
                time = "12:30 PM - 02:30 PM",
                status = "Completed"
            )
        )

        pickupList.add(
            PickupModel(
                pickupId = "PK1026",
                sellerName = "Laptop Hub",
                address = "Barasat",
                distance = "9.5 KM",
                time = "02:00 PM - 04:00 PM",
                status = "Pending"
            )
        )

        pickupList.add(
            PickupModel(
                pickupId = "PK1027",
                sellerName = "Home Decor",
                address = "Dum Dum",
                distance = "2.4 KM",
                time = "03:00 PM - 05:00 PM",
                status = "Completed"
            )
        )

        pickupList.add(
            PickupModel(
                pickupId = "PK1028",
                sellerName = "Book Store",
                address = "Park Street",
                distance = "4.1 KM",
                time = "04:00 PM - 06:00 PM",
                status = "Pending"
            )
        )
        pickupAdapter.notifyDataSetChanged()
    }

}