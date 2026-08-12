package ui.orders

import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.SearchView
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.ecommerce.citybasket.R

class OrdersActivity : AppCompatActivity() {

    private lateinit var recyclerOrders: RecyclerView
    private lateinit var searchView: SearchView
    private lateinit var viewModel: OrdersViewModel
    private lateinit var adapter: OrderAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        enableEdgeToEdge()

        setContentView(R.layout.activity_orders)

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { view, insets ->

            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())

            view.setPadding(
                systemBars.left,
                systemBars.top,
                systemBars.right,
                systemBars.bottom
            )

            insets
        }

        initViews()

        setupRecycler()

        setupSearch()

        viewModel = ViewModelProvider(this)[OrdersViewModel::class.java]

        observeData()

        viewModel.loadOrders()
    }

    private fun initViews() {

        recyclerOrders = findViewById(R.id.recyclerOrders)

        searchView = findViewById(R.id.searchView)

    }

    private fun setupRecycler() {

        adapter = OrderAdapter(this)

        recyclerOrders.layoutManager =
            LinearLayoutManager(this)

        recyclerOrders.adapter = adapter

        recyclerOrders.setHasFixedSize(true)
    }

    private fun setupSearch() {

        searchView.queryHint = "Search Order"

        searchView.setOnQueryTextListener(object : SearchView.OnQueryTextListener {

            override fun onQueryTextSubmit(query: String?): Boolean {

                // API Search

                return true

            }

            override fun onQueryTextChange(newText: String?): Boolean {

                // Adapter Filter

                return true

            }

        })

    }

    private fun observeData() {

        viewModel.orders.observe(this) { orders ->
            adapter.submitList(orders)
        }

        viewModel.loading.observe(this) {

            println("Loading = $it")

        }

        viewModel.error.observe(this) {

            println(it)

        }

    }

}