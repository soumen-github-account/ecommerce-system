package ui.Home

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.ecommerce.pickuppartnerapp.MainActivity
import com.ecommerce.pickuppartnerapp.R

class HomeFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        return inflater.inflate(R.layout.fragment_home, container, false)
    }

    override fun onResume() {
        super.onResume()

        (activity as? MainActivity)?.updateToolbar(
            title = "Dashboard",
            showMenu = true,
            showNotification = true
        )
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // TODO:
        // Card Click
        // RecyclerView
        // API Call
        // Dashboard Data
    }
}