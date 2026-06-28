import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const stories = [
  { name: "Deep Bajaj", company: "Sirona Hygiene", text: "Flipkart created awareness about intimate & menstrual hygiene products. Their team's involvement made our innovative products household favourites." },
  { name: "Anita Sharma", company: "Ethnic Wear Co", text: "Growing my business online was a dream, and with the support provided, it became a reality in just a few months." },
  { name: "Rahul Verma", company: "Tech Gadgets", text: "The insights and tools provided helped me scale my reach to millions of customers across India." }
];

const SuccessStories = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => setCurrentIndex((prev) => (prev === stories.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? stories.length - 1 : prev - 1));

  return (
    <section className="min-h-[90vh] py-20 bg-blue-50 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        
        {/* Left Side Info */}
        <div className="md:w-1/2">
          <h2 className="text-6xl font-bold text-gray-900 mb-4">Seller Success <span className='text-blue-600'>Stories</span></h2>
          <p className="text-gray-600 mb-6 text-2xl">14 Lakh+ sellers trust our platform for their online business.</p>
          <button className="border-2 border-black-600 text-black-600 px-6 py-2 rounded-lg hover:bg-black cursor-pointer hover:text-white transition">See All Stories</button>
        </div>

        {/* Right Side Slider Card */}
        <div className="relative md:w-1/2 bg-white p-10 rounded-3xl shadow-lg flex items-center justify-center">
          <button onClick={prevSlide} className="absolute left-2 p-2 bg-gray-100 rounded-full hover:bg-gray-200"><ChevronLeft /></button>
          
          <div className="text-center w-full">
            <img src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?cs=srgb&dl=pexels-italo-melo-881954-2379004.jpg&fm=jpg" alt="Avatar" className="w-50 h-50 rounded-full mx-auto mb-4 border-4 border-yellow-400" />
            <h3 className="font-bold text-xl">{stories[currentIndex].name}</h3>
            <p className="text-gray-500 font-medium mb-4">{stories[currentIndex].company}</p>
            <p className="text-gray-700 italic">"{stories[currentIndex].text}"</p>
          </div>

          <button onClick={nextSlide} className="absolute right-2 p-2 bg-gray-100 rounded-full hover:bg-gray-200"><ChevronRight /></button>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;