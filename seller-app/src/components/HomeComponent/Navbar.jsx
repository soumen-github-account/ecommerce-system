import React from 'react'
import logoImg from "../../assets/Logo.png"
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-7">
            <div className="flex justify-between items-center h-16">
            
            <div className="flex items-center gap-3">
                <img 
                src={logoImg}
                alt="Logo" 
                className="w-13 rounded-full"
                />
                <h1 className='text-2xl font-medium'>CityBasket</h1>
            </div>
            <div className="flex items-center space-x-4">
                <Link to={"/login-seller-account"}><button className="text-gray-700 px-5 cursor-pointer font-medium transition duration-200">
                Login
                </button></Link>
                <Link to={"/register-seller-account"}><button className="bg-black px-7 text-white px-4 py-4 cursor-pointer transition duration-200">
                Start Selling
                </button></Link>
            </div>
            
            </div>
        </div>
    </nav>
  )
}

export default Navbar
