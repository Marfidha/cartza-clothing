import React from 'react'


const Section2 = () => {
  return (
  <section className="py-32 px-6 bg-[#faf9f6] overflow-hidden">
    <div className="max-w-7xl mx-auto">
      <div className="mb-20 text-center lg:text-left" data-aos="fade-up">
        <h2 className="font-serif text-6xl mb-4 text-[#333]">Cartza <span className="italic font-normal text-[#b36b5d]">Edits</span></h2>
        <p className="text-gray-500 font-light max-w-md text-lg">Curated stories on style, sustainability, and mindful consumption.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {[
          {
            title: "The Minimalist Suit",
            desc: "Deconstructed tailoring for the modern workplace. Designed to be worn as a set or mixed separately.",
            img: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=800"
          },
          {
            title: "Ocean Blue Series",
            desc: "Inspired by the Mediterranean coastline. Breathable textures meet deep, mineral-dyed hues.",
            img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800"
          },
          {
            title: "Artisan Leather",
            desc: "Vegetable-tanned accessories that age with grace. Hand-stitched in our Florence workshop.",
            img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800"
          }
        ].map((item, idx) => (
          <div key={idx} className="group cursor-pointer" data-aos="fade-up" data-aos-delay={idx * 200}>
            <div className="aspect-[4/5] overflow-hidden rounded-3xl mb-8 relative">
              <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-[1.5s]" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-medium font-serif group-hover:text-[#b36b5d] transition-colors">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-light">{item.desc}</p>
              <button className="text-[10px] font-bold tracking-[0.2em] uppercase border-b border-black pb-1 group-hover:border-[#b36b5d] group-hover:text-[#b36b5d] transition-all">Read Journal</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>

  )
}

export default Section2