import React from 'react';
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube, FaTwitter } from "react-icons/fa";
import logo from "../../assets/Logo.png"

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-gray-300 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Popular Categories */}
        <div className="mb-12">
          <h3 className="text-white font-bold text-lg mb-6">Popular categories to sell across India</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {['Mobile', 'Shoes', 'Paintings', 'Beauty', 'Clothes', 'Jewellery', 'Watch', 'Toys', 'Sarees', 'Tshirts', 'Books', 'Appliances', 'Electronics', 'Furniture', 'Home Products', 'Shirts'].map((item) => (
              <a href="#" key={item} className="hover:text-white transition">Sell {item} Online</a>
            ))}
          </div>
        </div>

        <hr className="border-slate-700 mb-12" />

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {[
            { title: "Sell Online", links: ["Create Account", "List Products", "Storage & Shipping", "Fees & Commission", "Help & Support"] },
            { title: "Grow Your Business", links: ["Insights & Tools", "Flipkart Ads", "Flipkart Value Services", "Shopping Festivals"] },
            { title: "Learn More", links: ["FAQs", "Seller Success Stories", "Seller Blogs"] }
          ].map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-bold mb-4">{section.title}</h4>
              <ul className="space-y-3 text-sm">
                {section.links.map((link) => <li key={link}><a href="#" className="hover:text-white">{link}</a></li>)}
              </ul>
            </div>
          ))}

          {/* Social & Apps */}
          <div>
            <h4 className="text-white font-bold mb-4">Download Mobile App</h4>
            <div className="space-y-2 mb-6">
              <div className="w-32 h-10 bg-black rounded flex items-center justify-center text-[10px]">Google Play</div>
              <div className="w-32 h-10 bg-black rounded flex items-center justify-center text-[10px]">App Store</div>
            </div>
            <h4 className="text-white font-bold mb-4">Stay Connected</h4>
            <div className="flex space-x-4">
                <FaFacebook size={20} />
                <FaInstagram size={20} />
                <FaLinkedin size={20} />
                <FaYoutube size={20} />
                <FaTwitter size={20} />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm pt-6 border-t border-slate-700">
          <div className="flex items-center gap-2">
            <div className="bg-white p-1 rounded font-bold text-blue-600">
                <img src={logo} className='w-8 rounded-full' alt="" />
            </div>
            <span>© 2024 CityBasket. All Rights Reserved</span>
          </div>
          <div className="space-x-6 mt-4 md:mt-0">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;