import React from 'react'

const Section3 = () => {
  return (
  <section className="py-32 px-6 bg-white overflow-hidden">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-baseline mb-20 space-y-6 md:space-y-0" data-aos="fade-up">
        <h2 className="font-serif text-5xl text-[#333]">Popular Collections</h2>
        <a href="#" className="text-[10px] font-bold tracking-[0.3em] uppercase border-b border-gray-200 hover:border-black transition-all pb-1">Shop The Archive</a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { name: "Ready-To-Wear", tag: "Seasonal Drops", img: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&q=80&w=600" },
          { name: "Formalwear", tag: "Evening Luxury", img: "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=600" },
          { name: "Accessories", tag: "Small Goods", img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=600" },
          { name: "Last Call", tag: "Final Sale", img: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=600" }
        ].map((cat, idx) => (
          <div key={idx} className="relative group overflow-hidden rounded-3xl aspect-[3/4]" data-aos="zoom-in-up" data-aos-delay={idx * 150}>
            <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:via-black/40 transition-all duration-500"></div>
            <div className="absolute inset-0 flex flex-col justify-end p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <h3 className="text-white text-3xl font-medium font-serif mb-1">{cat.name}</h3>
              <p className="text-white/70 text-[10px] tracking-[0.2em] uppercase mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">{cat.tag}</p>
              <button className="w-fit bg-white text-black text-[10px] font-bold px-8 py-3.5 rounded-full uppercase tracking-widest hover:bg-black hover:text-white transition-all transform opacity-0 group-hover:opacity-100 shadow-xl">
                SHOP NOW
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>

  )
}

export default Section3