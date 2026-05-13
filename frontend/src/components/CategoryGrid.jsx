import React from 'react'
import { motion } from "framer-motion";

const CategoryGrid = () => {

    const categories = [
    { name: 'Bikinis', size: 'row-span-2', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800' },
    { name: 'One-Pieces', size: 'col-span-1', img: 'https://images.unsplash.com/photo-1596435764223-745a2789f214?auto=format&fit=crop&q=80&w=800' },
    { name: 'Cover-Ups', size: 'col-span-1', img: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&q=80&w=800' },
    { name: 'Rompers', size: 'col-span-1', img: 'https://images.unsplash.com/photo-1515377651230-07e324029437?auto=format&fit=crop&q=80&w=800' },
    { name: 'Dresses', size: 'col-span-1', img: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=800' },
    { name: 'Tops', size: 'col-span-1', img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800' },
    { name: 'Bottoms', size: 'col-span-1', img: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&q=80&w=800' },
  ];
  return (
    <>
      <section className="py-24 bg-white px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-serif text-slate-900 uppercase tracking-widest mb-4">
            CASA DEL SOL COLLECTION
          </h3>
          <div className="w-12 h-px bg-slate-300 mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[250px] md:auto-rows-[300px]">
          {categories.map((cat, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -5 }}
              className={`relative overflow-hidden group cursor-pointer ${cat.size}`}
            >
              <img 
                src={cat.img} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                alt={cat.name}
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors duration-300" />
              <div className="absolute bottom-6 left-6">
                <span className="bg-white px-4 py-2 text-[10px] uppercase tracking-widest font-semibold text-slate-900 shadow-sm opacity-90 group-hover:opacity-100 transition-opacity">
                  {cat.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-10">
          {['Bikinis', 'Dresses', 'New Arrivals', 'Bottoms'].map((link) => (
            <a key={link} href="#" className="text-[11px] uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors font-medium">
              {link}
            </a>
          ))}
        </div>
      </div>
    </section>
    </>
  )
}

export default CategoryGrid