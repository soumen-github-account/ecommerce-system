plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)

    id("com.google.gms.google-services")
}

android {
    namespace = "com.ecommerce.citybasket"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.ecommerce.citybasket"
        minSdk = 24
        targetSdk = 36
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
    kotlinOptions {
        jvmTarget = "11"
    }
}

dependencies {

    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.appcompat)
    implementation(libs.material)
    implementation(libs.androidx.activity)
    implementation(libs.androidx.constraintlayout)

    // Glide for Images
    implementation("com.github.bumptech.glide:glide:4.16.0")

    // Firebase BoM (Bill of Materials) - Sabhi Firebase libraries ke versions manage karta hai
    implementation(platform("com.google.firebase:firebase-bom:33.10.0")) // Stable version updated

    // Firebase Authentication Library (Bina -ktx ke use karein, ab standard yahi hai)
    implementation("com.google.firebase:firebase-auth")

    // PHONE AUTHENTICATION KE LIYE YEH ZAROORI HAI:
    implementation("com.google.android.gms:play-services-auth:21.2.0")

    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
    implementation("com.squareup.retrofit2:retrofit:2.11.0")
    implementation("com.squareup.retrofit2:converter-gson:2.11.0")
    implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:2.8.7")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.1")

    // image slider
    implementation ("com.google.android.material:material:1.12.0")
    implementation ("androidx.viewpager2:viewpager2:1.1.0")
    implementation ("me.relex:circleindicator:2.1.6")
    implementation ("com.github.bumptech.glide:glide:4.16.0")
    implementation ("com.razorpay:checkout:1.6.40")
    implementation ("com.google.code.gson:gson:2.10.1")

    // lottie
    implementation("com.airbnb.android:lottie:6.6.0")
}