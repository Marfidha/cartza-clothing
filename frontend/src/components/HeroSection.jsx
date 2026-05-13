import React from 'react'
import { ChevronRight } from "lucide-react";
import heroimage from "../assets/hero.webp";

const HeroSection = () => {
  return (
    <div>
        {/* Cinematic Hero Experience - UNCHANGED */}
      <header className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 transition-transform duration-300 ease-out"
          style={{ transform: `scale(${1 + scrollY * 0.0005}) translateY(${scrollY * 0.1}px)` }}
        >
          <img 
            src={heroimage}
            alt="Editorial Fashion" 
            className="w-full h-full object-cover grayscale-[20%]"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-[#FDFCFE]" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-7xl md:text-9xl font-extralight text-white tracking-tighter leading-none mb-10 overflow-hidden">
            <span className="inline-block animate-reveal-text-slow">
              Timeless <br /> 
              <span className="italic font-serif font-light text-violet-300">Elegance</span>
            </span>
          </h1>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 animate-fade-in-up">
            <button className="group relative px-12 py-5 bg-white text-slate-900 rounded-full font-bold text-xs tracking-[0.2em] uppercase overflow-hidden transition-all hover:bg-violet-600 hover:text-white active:scale-95 shadow-2xl">
              <span className="relative z-10 flex items-center gap-3">
                Shop Collection <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            
            <div className="flex items-center gap-4 text-white/80 group cursor-pointer hover:text-white transition-colors">
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase">The Lookbook</span>
              <div className="w-10 h-[1px] bg-white/50 group-hover:w-16 group-hover:bg-violet-400 transition-all duration-500" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
          <div className="w-[1px] h-20 bg-leniear-to-b from-white to-transparent" />
        </div>
      </header>
    </div>
  )
}

export default HeroSection