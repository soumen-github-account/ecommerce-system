package ui.profile

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.ecommerce.citybasket.R
import ui.auth.register.RegisterActivity
import ui.checkout.OrderSuccessActivity
import ui.orders.OrdersActivity
import utils.TokenManager
import viewmodel.SharedUserViewModel
import viewmodel.UserViewModel

class ProfileFragment : Fragment() {

    private lateinit var userViewModel: UserViewModel
    private lateinit var sharedUserViewModel: SharedUserViewModel

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        sharedUserViewModel = ViewModelProvider(requireActivity())[SharedUserViewModel::class.java]

        val view = inflater.inflate(
            R.layout.fragment_profile,
            container,
            false
        )

        val txtName = view.findViewById<TextView>(R.id.txtName)

        val txtEmail = view.findViewById<TextView>(R.id.txtEmail)

        val layoutRegister = view.findViewById<View>(R.id.layoutRegister)

        val imgLayoutRegister = view.findViewById<ImageView>(R.id.imgIcon)

        val textLayoutRegister = view.findViewById<TextView>(R.id.txtOption)

        imgLayoutRegister.setImageResource(
            R.drawable.ic_profile
        )

        textLayoutRegister.text = "Sign In / Sign Up"

        userViewModel = ViewModelProvider(this)[UserViewModel::class.java]

        val token =
            TokenManager(requireContext())
                .getToken()

        if (token != null) {
            println("TOKEN = $token")

            userViewModel.getUser(token)

            layoutRegister.visibility = View.GONE

        } else {

            txtName.text = "Guest User"
            txtEmail.text = "Please Sign In"

            layoutRegister.visibility = View.VISIBLE
        }

//        userViewModel.user.observe(
//            viewLifecycleOwner
//        ) { user ->
//
//            txtName.text =
//                "${user.firstName} ${user.lastName}"
//
//            txtEmail.text =
//                user.email ?: ""
//        }
        userViewModel.user.observe(viewLifecycleOwner) { user ->

            txtName.text = "${user.firstName} ${user.lastName}"
            txtEmail.text = user.email ?: ""

            sharedUserViewModel.setUser(
                user.email,
                user.phone
            )
        }

        userViewModel.error.observe(
            viewLifecycleOwner
        ) {

            Toast.makeText(
                requireContext(),
                it,
                Toast.LENGTH_SHORT
            ).show()
        }

        layoutRegister.setOnClickListener {

            startActivity(
                Intent(
                    requireContext(),
                    RegisterActivity::class.java
                )
            )
        }

        val layoutEditProfile =
            view.findViewById<View>(R.id.editProfile)

        val imgEditProfile =
            layoutEditProfile.findViewById<ImageView>(R.id.imgIcon)

        val txtEditProfile =
            layoutEditProfile.findViewById<TextView>(R.id.txtOption)

        imgEditProfile.setImageResource(
            R.drawable.ic_profile
        )

        txtEditProfile.text = "Edit Profile"

        layoutEditProfile.setOnClickListener {
            startActivity(Intent(requireContext(), OrderSuccessActivity::class.java))
        }

        val layoutOrders =
            view.findViewById<View>(R.id.layoutOrders)

        val imgOrders =
            layoutOrders.findViewById<ImageView>(R.id.imgIcon)

        val txtOrders =
            layoutOrders.findViewById<TextView>(R.id.txtOption)

        imgOrders.setImageResource(
            R.drawable.ic_profile
        )

        txtOrders.text = "My Orders"
        layoutOrders.setOnClickListener {
            startActivity(Intent(requireContext(), OrdersActivity::class.java))
        }

        val layoutAddress =
            view.findViewById<View>(R.id.layoutAddress)

        val imgAddress =
            layoutAddress.findViewById<ImageView>(R.id.imgIcon)

        val txtAddress =
            layoutAddress.findViewById<TextView>(R.id.txtOption)

        imgAddress.setImageResource(
            R.drawable.ic_profile
        )

        txtAddress.text = "Saved Addresses"

        val layoutWishlist =
            view.findViewById<View>(R.id.layoutWishlist)

        val imgWishlist =
            layoutWishlist.findViewById<ImageView>(R.id.imgIcon)

        val txtWishlist =
            layoutWishlist.findViewById<TextView>(R.id.txtOption)

        imgWishlist.setImageResource(
            R.drawable.ic_heart
        )

        txtWishlist.text = "Wishlist"

        // ------- logout -----------
        val btnLogout =
            view.findViewById<Button>(R.id.btnLogout)

        btnLogout.setOnClickListener {

            TokenManager(requireContext()).clearToken()

            startActivity(
                Intent(
                    requireContext(),
                    RegisterActivity::class.java
                )
            )

            requireActivity().finish()

        }

        return view
    }
}