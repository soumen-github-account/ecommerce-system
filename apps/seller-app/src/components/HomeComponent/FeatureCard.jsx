import React from 'react';
import { Target, Zap, TrendingUp, Headphones } from 'lucide-react'; // Lucide-react icons use kiye hain

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
    <div className="bg-blue-50 w-14 h-14 rounded-full flex items-center justify-center mb-6 text-blue-600">
      <Icon size={28} />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const WhySection = () => {
  const features = [
    { icon: Target, title: "Opportunity", description: "Reach 45 crore+ customers across 19000+ pincodes and participate in massive shopping festivals." },
    { icon: Zap, title: "Ease of Business", description: "Get started in under 10 minutes with just your GSTIN number and a single product." },
    { icon: TrendingUp, title: "Massive Growth", description: "Scale your business with 2.8X growth spikes and 5X visibility during major sale events." },
    { icon: Headphones, title: "Premium Support", description: "Get dedicated account management, exclusive training programs, and business insights." }
  ];

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-6">Why do sellers love selling with us?</h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            Join a community of millions who trust our platform to grow their business 24/7 with seamless tools and dedicated support.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <FeatureCard key={i} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySection;