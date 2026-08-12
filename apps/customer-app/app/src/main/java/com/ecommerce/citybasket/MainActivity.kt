package com.ecommerce.citybasket

import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.bottomnavigation.BottomNavigationView

import ui.cart.CartFragment
import ui.category.CategoryFragment
import ui.home.HomeFragment
import ui.profile.ProfileFragment
import ui.wishlist.WishlistFragment

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)

        val bottomNav = findViewById<BottomNavigationView>(R.id.bottomNav)

        if (savedInstanceState == null) {
            // HomeFragment ko main screen par load karo
            supportFragmentManager.beginTransaction()
                .replace(R.id.frameLayout, HomeFragment())
                .commit()

            // Bottom navigation bar me 'Home' tab ko select dikhao
            bottomNav.selectedItemId = R.id.home
        }

        bottomNav.setOnItemSelectedListener { item ->
            when(item.itemId) {
                R.id.home -> {
                    supportFragmentManager.beginTransaction()
                        .replace(R.id.frameLayout, HomeFragment())
                        .commit()
                    true
                }
                R.id.wishlist -> {
                    supportFragmentManager.beginTransaction()
                        .replace(R.id.frameLayout, WishlistFragment())
                        .commit()
                    true
                }
                R.id.category -> {
                    supportFragmentManager.beginTransaction()
                        .replace(R.id.frameLayout, CategoryFragment())
                        .commit()
                    true
                }
                R.id.profile -> {
                    supportFragmentManager.beginTransaction()
                        .replace(R.id.frameLayout, ProfileFragment())
                        .commit()
                    true
                }
                R.id.cart -> {
                    supportFragmentManager.beginTransaction()
                        .replace(R.id.frameLayout, CartFragment())
                        .commit()
                    true
                }
                else -> false
            }
        }
    }
}