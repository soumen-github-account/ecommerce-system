package com.ecommerce.pickuppartnerapp

import android.os.Bundle
import android.view.View
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import ui.Earnings.EarningsFragment
import ui.Home.HomeFragment
import ui.Pickups.PickupsFragment
import ui.Profile.ProfileFragment
import androidx.drawerlayout.widget.DrawerLayout
import androidx.core.view.GravityCompat

class MainActivity : AppCompatActivity() {

    private lateinit var navHome: LinearLayout
    private lateinit var navPickups: LinearLayout
    private lateinit var navEarnings: LinearLayout
    private lateinit var navProfile: LinearLayout

    // Icons
    private lateinit var iconHome: ImageView
    private lateinit var iconPickups: ImageView
    private lateinit var iconEarnings: ImageView
    private lateinit var iconProfile: ImageView

    // Text
    private lateinit var textHome: TextView
    private lateinit var textPickups: TextView
    private lateinit var textEarnings: TextView
    private lateinit var textProfile: TextView

    // Toolbar
    private lateinit var btnMenu: ImageView
    private lateinit var btnNotification: ImageView
    private lateinit var txtTitle: TextView

    companion object {

        private const val TAB_HOME = 0
        private const val TAB_PICKUPS = 1
        private const val TAB_EARNINGS = 2
        private const val TAB_PROFILE = 3
        private lateinit var drawerLayout: DrawerLayout

    }

    private var currentTab = TAB_HOME

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        initViews()

        if (savedInstanceState == null) {

            currentTab = TAB_HOME

            openFragment(HomeFragment())

            selectHome()

        }

        // Home
        navHome.setOnClickListener {

            if (currentTab == TAB_HOME) return@setOnClickListener

            currentTab = TAB_HOME

            openFragment(HomeFragment())

            selectHome()

        }

        // Pickups
        navPickups.setOnClickListener {

            if (currentTab == TAB_PICKUPS) return@setOnClickListener

            currentTab = TAB_PICKUPS

            openFragment(PickupsFragment())

            selectPickups()

        }

        // Earnings
        navEarnings.setOnClickListener {

            if (currentTab == TAB_EARNINGS) return@setOnClickListener

            currentTab = TAB_EARNINGS

            openFragment(EarningsFragment())

            selectEarnings()

        }

        // Profile
        navProfile.setOnClickListener {

            if (currentTab == TAB_PROFILE) return@setOnClickListener

            currentTab = TAB_PROFILE

            openFragment(ProfileFragment())

            selectProfile()

        }

        btnMenu.setOnClickListener {

            drawerLayout.openDrawer(GravityCompat.START)

        }

    }

    override fun onBackPressed() {
        if (drawerLayout.isDrawerOpen(GravityCompat.START)) {
            drawerLayout.closeDrawer(GravityCompat.START)
        } else {
            super.onBackPressed()
        }
    }

    fun updateToolbar(
        title: String,
        showMenu: Boolean,
        showNotification: Boolean
    ) {

        txtTitle.text = title

        btnMenu.visibility =
            if (showMenu) View.VISIBLE else View.GONE

        btnNotification.visibility =
            if (showNotification) View.VISIBLE else View.GONE

    }

    private fun initViews() {

        navHome = findViewById(R.id.navHome)
        navPickups = findViewById(R.id.navPickups)
        navEarnings = findViewById(R.id.navEarnings)
        navProfile = findViewById(R.id.navProfile)

        iconHome = findViewById(R.id.iconHome)
        iconPickups = findViewById(R.id.iconPickups)
        iconEarnings = findViewById(R.id.iconEarnings)
        iconProfile = findViewById(R.id.iconProfile)

        textHome = findViewById(R.id.textHome)
        textPickups = findViewById(R.id.textPickups)
        textEarnings = findViewById(R.id.textEarnings)
        textProfile = findViewById(R.id.textProfile)

        btnMenu = findViewById(R.id.btnMenu)
        btnNotification = findViewById(R.id.btnNotification)
        txtTitle = findViewById(R.id.txtTitle)

        drawerLayout = findViewById(R.id.drawerLayout)

    }

    private fun openFragment(fragment: Fragment) {
        supportFragmentManager.beginTransaction()
            .setReorderingAllowed(true)
            .replace(R.id.fragmentContainer, fragment)
            .commit()

    }

    private fun resetTabs() {

        val gray = ContextCompat.getColor(this, R.color.text_hint)

        iconHome.setImageResource(R.drawable.ic_home)
        iconHome.setColorFilter(gray)

        iconPickups.setImageResource(R.drawable.ic_pickup)
        iconPickups.setColorFilter(gray)

        iconEarnings.setImageResource(R.drawable.ic_earning)
        iconEarnings.setColorFilter(gray)

        iconProfile.setImageResource(R.drawable.ic_profile)
        iconProfile.setColorFilter(gray)

        textHome.setTextColor(gray)
        textPickups.setTextColor(gray)
        textEarnings.setTextColor(gray)
        textProfile.setTextColor(gray)

    }

    // ===========================
    // Home
    // ===========================

    private fun selectHome() {

        resetTabs()

        val blue = ContextCompat.getColor(this, R.color.primary)

        iconHome.setImageResource(R.drawable.ic_home_fill)
        iconHome.setColorFilter(blue)

        textHome.setTextColor(blue)

    }

    // ===========================
    // Pickups
    // ===========================

    private fun selectPickups() {

        resetTabs()

        val blue = ContextCompat.getColor(this, R.color.primary)

        iconPickups.setImageResource(R.drawable.ic_pickup_fill)
        iconPickups.setColorFilter(blue)

        textPickups.setTextColor(blue)

    }

    // ===========================
    // Earnings
    // ===========================

    private fun selectEarnings() {

        resetTabs()

        val blue = ContextCompat.getColor(this, R.color.primary)

        iconEarnings.setImageResource(R.drawable.ic_earning_fill)
        iconEarnings.setColorFilter(blue)

        textEarnings.setTextColor(blue)

    }

    // ===========================
    // Profile
    // ===========================

    private fun selectProfile() {

        resetTabs()

        val blue = ContextCompat.getColor(this, R.color.primary)

        iconProfile.setImageResource(R.drawable.ic_profile_fill)
        iconProfile.setColorFilter(blue)

        textProfile.setTextColor(blue)

    }

}