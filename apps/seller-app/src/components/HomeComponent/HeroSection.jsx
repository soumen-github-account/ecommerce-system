import React from 'react'
import HeroImg from "../../assets/homePage.png"

const HeroSection = () => {
  return (
    <div className="bg-blue-50 py-16 px-4">
      {/* Main Content */}
      <div className="w-full">
        <img src={HeroImg} alt="" />
      </div>

      {/* Stats Section */}
      <div className="max-w-5xl mx-auto mt-12 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-wrap justify-around items-center divide-x divide-gray-200">
        <StatItem number="14 Lakh+" label="Seller community" />
        <StatItem number="24x7" label="Online Business" />
        <StatItem number="7" label="days* payment" />
        <StatItem number="19000+" label="Pincodes served" />
      </div>
    </div>
  )
}

const StatItem = ({ number, label }) => (
  <div className="text-center px-6">
    <h3 className="text-2xl font-bold text-blue-600">{number}</h3>
    <p className="text-sm text-gray-500 uppercase">{label}</p>
  </div>
);

export default HeroSection
