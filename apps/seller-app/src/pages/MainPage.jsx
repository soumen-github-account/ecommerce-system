import React from 'react'
import Navbar from '../components/HomeComponent/Navbar'
import HeroSection from '../components/HomeComponent/HeroSection'
import WhySection from '../components/HomeComponent/FeatureCard'
import SuccessStories from '../components/HomeComponent/SuccessStories'
import GrowthTools from '../components/HomeComponent/GrowthTools'
import Footer from '../components/HomeComponent/Footer'

const MainPage = () => {
  return (
    <div>
        <Navbar />
        {/* home section */}
        <HeroSection />
        <WhySection />
        <SuccessStories />
        <GrowthTools />
        <Footer />
    </div>
  )
}

export default MainPage
