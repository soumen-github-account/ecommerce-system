package ui.checkout

import adapters.UpiAppsAdapter
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.ecommerce.citybasket.R
import data.model.upi.UpiApp

class PaymentFragment : Fragment() {

    private lateinit var rvUpiApps: RecyclerView
    // btnPayNow wali line remove kar do

    private var selectedUpiApp: UpiApp? = null

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        val view = inflater.inflate(R.layout.fragment_payment, container, false)

        initViews(view)
        // setupPayButton() ko yaha se hata do
        loadInstalledUpiApps()

        return view
    }

    private fun initViews(view: View) {
        rvUpiApps = view.findViewById(R.id.rvUpiApps)
        rvUpiApps.layoutManager = LinearLayoutManager(requireContext())
        // btnPayNow = view.findViewById(R.id.btnPayNow) // YE LINE DELETE KAR DO
    }

    private fun loadInstalledUpiApps() {
        val apps = getInstalledUpiApps()
        rvUpiApps.adapter = UpiAppsAdapter(apps) { selectedApp ->
            selectedUpiApp = selectedApp
        }
    }

    private fun getInstalledUpiApps(): MutableList<UpiApp> {

        val apps = mutableListOf<UpiApp>()

        val intent = Intent(Intent.ACTION_VIEW)
        intent.data = Uri.parse("upi://pay")

        val activities =
            requireContext()
                .packageManager
                .queryIntentActivities(intent, 0)

        activities.forEach {

            apps.add(
                UpiApp(
                    appName = it.loadLabel(
                        requireContext().packageManager
                    ).toString(),

                    packageName =
                        it.activityInfo.packageName,

                    icon =
                        it.loadIcon(
                            requireContext().packageManager
                        )
                )
            )
        }

        return apps
    }
}