package ui.ordersDetail

import android.os.Bundle
import android.util.Log
import android.widget.ImageView
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.ecommerce.citybasket.R

class TrackingActivity : AppCompatActivity() {

    private lateinit var recyclerTracking: RecyclerView
    private lateinit var adapter: TrackingAdapter
    private lateinit var viewModel: TrackingViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        Log.d("TRACKING", "TrackingActivity Started")

        setContentView(R.layout.activity_tracking)

        findViewById<ImageView>(R.id.btnBack).setOnClickListener {
            finish()
        }

        recyclerTracking = findViewById(R.id.recyclerTracking)
        adapter = TrackingAdapter(this)
        recyclerTracking.layoutManager = LinearLayoutManager(this)
        recyclerTracking.adapter = adapter
        viewModel = ViewModelProvider(this)[TrackingViewModel::class.java]
        val orderId = intent.getStringExtra("ORDER_ID") ?: ""
        viewModel.loadTracking(orderId)
        observeData()
    }

    private fun observeData() {

        viewModel.tracking.observe(this) { list ->

            adapter.submitList(list)

        }

    }
}