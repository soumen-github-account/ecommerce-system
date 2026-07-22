package ui.ordersDetail

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import com.bumptech.glide.Glide
import com.ecommerce.citybasket.R

class OrderDetailsActivity : AppCompatActivity() {

    private lateinit var viewModel: OrderDetailsViewModel

    private lateinit var imgProduct: ImageView
    private lateinit var txtProductName: TextView
    private lateinit var txtVariant: TextView
    private lateinit var txtOrderNumber: TextView
    private lateinit var txtDeliveryStatus: TextView
    private lateinit var txtAddress: TextView
    private lateinit var txtUserName: TextView
    private lateinit var txtPhone: TextView
    private lateinit var txtMrp: TextView
    private lateinit var txtDiscount: TextView
    private lateinit var txtDeliveryCharge: TextView
    private lateinit var txtPlatformFee: TextView
    private lateinit var txtTotalAmount: TextView
    private lateinit var txtPaymentMethod: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_order_details)

        viewModel =
            ViewModelProvider(this)[OrderDetailsViewModel::class.java]

        initViews()

        val orderId =
            intent.getStringExtra("ORDER_ID") ?: ""
        Log.d("ORDER id", "Order Id in order details = $orderId")


        viewModel.loadOrder(orderId)

        observeData()

        findViewById<TextView>(R.id.btnTracking)
            .setOnClickListener {

                val order =
                    viewModel.order.value ?: return@setOnClickListener
                Log.d("TRACKING", "Button Click")
                Log.d("TRACKING", "ID = ${order._id}")

                startActivity(

                    Intent(
                        this,
                        TrackingActivity::class.java
                    ).putExtra(
                        "ORDER_ID",
                        order._id
                    )

                )

            }

    }

    private fun initViews() {

        imgProduct =
            findViewById(R.id.imgProduct)

        txtProductName =
            findViewById(R.id.txtProductName)

        txtVariant =
            findViewById(R.id.txtVariant)

        txtOrderNumber =
            findViewById(R.id.txtOrderNumber)

        txtDeliveryStatus =
            findViewById(R.id.txtDeliveryStatus)

        txtAddress =
            findViewById(R.id.txtAddress)

        txtUserName =
            findViewById(R.id.txtUserName)

        txtPhone =
            findViewById(R.id.txtPhone)

        txtMrp =
            findViewById(R.id.txtMrp)

        txtDiscount =
            findViewById(R.id.txtDiscount)

        txtDeliveryCharge =
            findViewById(R.id.txtDeliveryCharge)

        txtPlatformFee =
            findViewById(R.id.txtPlatformFee)

        txtTotalAmount =
            findViewById(R.id.txtTotalAmount)

        txtPaymentMethod =
            findViewById(R.id.txtPaymentMethod)

    }

    private fun observeData() {

        viewModel.order.observe(this) { order ->

            if (order.items.isEmpty())
                return@observe

            val item = order.items.first()
            txtProductName.text = item.snapshot.title
            txtVariant.text =
                item.variant?.variantName
                    ?: item.snapshot.variantName
                            ?: ""

            txtOrderNumber.text = order.orderNumber
            txtDeliveryStatus.text = order.status.replace("_", " ")
            txtAddress.text = order.shippingAddress.fullAddress
            txtUserName.text = order.shippingAddress.fullName
            txtPhone.text = order.shippingAddress.phone
            txtMrp.text = "₹${order.pricing.subtotal}"
            txtDiscount.text = "-₹${order.pricing.discount}"
            txtDeliveryCharge.text = "₹${order.pricing.shippingCharge}"
            txtPlatformFee.text = "₹${order.pricing.platformFee ?: 0}"
            txtTotalAmount.text = "₹${order.pricing.totalAmount}"
            txtPaymentMethod.text = order.payment.method

            Glide.with(this)
                .load(item.snapshot.image)
                .placeholder(R.drawable.ic_launcher_logo_background)
                .error(R.drawable.ic_launcher_logo_background)
                .into(imgProduct)

        }
    }
}