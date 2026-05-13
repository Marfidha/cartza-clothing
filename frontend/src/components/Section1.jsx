import React from 'react'
import ProductCard from "./ProductCard";

import {
  ChevronRight,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
const Section1 = () => {
  return (
  <section className="py-32 px-6 max-w-[1600px] mx-auto overflow-hidden">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
      <div className="lg:col-span-3 space-y-10" data-aos="fade-right" data-aos-duration="1200">
        <div className="space-y-4">
          <h2 className="font-serif text-5xl text-[#333] leading-tight">Organic <br />Essentials.</h2>
          <p className="text-gray-500 text-sm leading-relaxed font-light">
            Our most-loved pieces, crafted from GOTS certified cotton and European flax linen.
          </p>
        </div>
        <button className="group text-[10px] font-bold tracking-[0.3em] uppercase flex items-center border-b border-gray-200 pb-2 hover:border-[#b36b5d] transition-all">
          View All Staples
          <ChevronRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
        <div className="flex space-x-4 pt-10">
          <button className="w-12 h-12 border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:border-black hover:text-black transition-all"><ArrowLeft size={18} /></button>
          <button className="w-12 h-12 border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:border-black hover:text-black transition-all"><ArrowRight size={18} /></button>
        </div>
      </div>

      <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        <ProductCard 
          image="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=600"
          category="Linen"
          title="The Relaxed Linen Shirt"
          price="£95.00"
          delay="100"
          tag="Sustainable Flax"
        />
        <ProductCard 
          image="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600"
          category="Denim"
          title="Raw Selvedge Straight Jean"
          price="£140.00"
          delay="300"
          tag="Limited Run"
        />
        <ProductCard 
          image="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=600"
          category="Silk"
          title="Bias Cut Recycled Silk Dress"
          price="£210.00"
          delay="500"
        />
        <ProductCard 
          image="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=600"
          category="Knitwear"
          title="Merino Wool Oversized Cardigan"
          price="£185.00"
          delay="700"
        />
      </div>
    </div>
  </section>

  )
}

export default Section1