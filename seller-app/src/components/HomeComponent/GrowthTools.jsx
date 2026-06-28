import React from 'react';
import { Target, Zap, TrendingUp, BookOpen, UserCog, Smartphone } from 'lucide-react';
import menImg from "../../assets/men.png"


const toolsData = [
  { id: 1, icon: Target, title: "Fulfilment by Flipkart", desc: "Worried about storing, packing, shipping, and delivering your products? Let Flipkart do it all for you." },
  { id: 2, icon: Zap, title: "Flipkart Ads", desc: "Curious how your products will stand out from your competitors and gain maximum visibility?" },
  { id: 3, icon: TrendingUp, title: "Shopping Festivals", desc: "Get access to India’s biggest shopping festivals, The Big Billion Day, and more." },
//   { id: 4, icon: BookOpen, title: "Learning Center", desc: "Personalised learning modules, exclusive webinars, tutorial videos, and more." },
//   { id: 5, icon: UserCog, title: "Account Management", desc: "Improve selection, pricing, and business insights with our expert managers." },
//   { id: 6, icon: Smartphone, title: "Mobile App", desc: "Manage your online seller account 24x7 with Flipkart Seller Hub App." },
];

const GrowthTools = () => {
  return (
    <div className="bg-white min-h-screen p-8 md:p-16 font-sans">
      {/* Header Style (Inspired by image_49fc01.jpg) */}
      <header className="mb-16">
        <h1 className="text-5xl font-medium text-slate-900 tracking-tight">
          Grow your <span className="text-blue-600">Business</span>
        </h1>
        <p className="mt-4 text-xl text-slate-600 max-w-2xl">
          Professional tools designed for your success. Start your journey today with our seamless platform.
        </p>
      </header>

      {/* Grid Cards (Inspired by image_49835c.png) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
        {toolsData.map((item) => {
            const Icon = item.icon; // Icon component ko variable mein assign kiya
            return (
            <div key={item.id} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-300">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl mb-6 flex items-center justify-center text-blue-600">
                <Icon size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
            );
        })}
        </section>

      {/* Highlight Section (Inspiredby image_499e05.jpg) */}
      <section className="mt-20 bg-neutral-800 rounded-[2rem] p-12 text-white flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1">
          <h2 className="text-4xl font-bold mb-6">Why Settle for Less?</h2>
          <p className="text-blue-100 text-lg">Join millions of successful sellers and take your brand to the next level with our trusted ecosystem.</p>
        </div>
        <div className="w-48 h-48 bg-white/20 rounded-full flex-shrink-0 overflow-hidden">
            <img src={menImg} alt="" />
        </div>
      </section>
    </div>
  );
};

export default GrowthTools;