import React from 'react'

const EditorialSection = () => {
  return (
    <>
      <section className="py-12 px-6">
    <div className="container mx-auto">
      <div className="relative h-[400px] md:h-[600px] overflow-hidden bg-[#F8FAFC]">
        <img 
          src="https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&q=80&w=2000" 
          className="w-full h-full object-cover opacity-90"
          alt="Editorial"
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[95%] h-[95%] border border-white/30" />
        </div>
      </div>
    </div>
  </section>
    </>
  )
}

export default EditorialSection