import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight,MoveRight,  Instagram, Twitter, ChevronRight,  Play,
  ArrowUpRight } from 'lucide-react';
import heroimage from "../../assets/hero.webp"

const App = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFCFE] text-slate-900 overflow-x-hidden selection:bg-violet-100 selection:text-violet-600">
      
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

      
 
      {/* Symmetric Full-Width Grid - SEAMLESS CONNECTION */}
      <section className="bg-[#FDFCFE] text-slate-900">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          
          {/* Row 1 */}
          <div className="border-r border-b border-black/5 aspect-[4/5] relative group overflow-hidden">
            <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105" alt="Look 01" />
            <div className="absolute inset-0 bg-violet-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-8 left-8 text-white z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
               <p className="text-[9px] font-black tracking-widest uppercase mb-1">Look 01</p>
               <h3 className="text-xl font-black uppercase tracking-tighter">Wool Overcoat</h3>
            </div>
          </div>

          <div className="border-r border-b border-black/5 aspect-[4/5] flex flex-col justify-center p-16 bg-[#F9F8FA] text-center">
            <span className="text-[9px] font-black tracking-[0.6em] uppercase text-zinc-400 mb-10">Philosophy</span>
            <h2 className="text-6xl font-black tracking-tighter leading-[0.85] uppercase mb-10 italic">LESS <br /> BUT <br /> <span className="text-outline-black text-transparent">BETTER</span></h2>
            <div className="h-[1px] w-12 bg-black mx-auto" />
          </div>

          <div className="border-b border-black/5 aspect-[4/5] relative group overflow-hidden">
            <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Detail" />
            <div className="absolute inset-0 flex items-center justify-center">
               <button className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/30 hover:bg-violet-600 transition-all duration-500">
                 <Play size={20} fill="currentColor" />
               </button>
            </div>
          </div>

          {/* Row 2 */}
          <div className="border-r border-b border-black/5 aspect-[4/5] relative group overflow-hidden">
            <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" alt="Material" />
          </div>

          <div className="border-r border-b border-black/5 aspect-[4/5] bg-slate-900 text-white flex flex-col justify-center p-16">
             <h3 className="text-4xl font-black uppercase tracking-tighter leading-tight mb-8">MATERIAL <br /> INNOVATION</h3>
             <p className="text-xs font-bold tracking-[0.1em] uppercase leading-relaxed text-zinc-400 mb-12">Japanese technical silks fused with recycled Italian cashmere for a tactile response to the environment.</p>
             <button className="text-[9px] font-black tracking-[0.4em] uppercase border-b border-white pb-2 self-start hover:opacity-50 transition-opacity">Read more</button>
          </div>

          <div className="border-b border-black/5 aspect-[4/5] relative group overflow-hidden">
            <img src="https://images.unsplash.com/photo-1537905569824-f89f14cceb68?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt="Model" />
          </div>

          {/* Row 3 - Designed to transition into your separate dark blue footer */}
          <div className="border-r border-black/5 aspect-[4/5] relative group overflow-hidden">
            <img src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Detail 02" />
          </div>

          {/* Transition Card: Uses a dark shade that bridges white to your dark blue footer */}
          <div className="border-r border-black/5 aspect-[4/5] flex flex-col justify-end p-12 bg-slate-900 text-white">
            <h2 className="text-4xl font-black tracking-tighter leading-none mb-4 uppercase italic">V.04 <br /> Archive</h2>
            <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.4em] hover:gap-4 transition-all group">
              Digital Library <ArrowUpRight size={14} className="group-hover:rotate-45 transition-transform" />
            </button>
          </div>

          <div className="aspect-[4/5] relative group overflow-hidden">
            <img src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" alt="Detail 03" />
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .text-outline-black { -webkit-text-stroke: 1px #000; }
        @keyframes reveal-text {
          0% { transform: translateY(100%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-reveal-text-slow {
          animation: reveal-text 1.5s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }
        @keyframes fade-in-up {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1.2s cubic-bezier(0.19, 1, 0.22, 1) 0.5s forwards;
          opacity: 0;
        }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #FDFCFE; }
        ::-webkit-scrollbar-thumb { background: #ddd; }
      ` }} />
    </div>
  
  );
};

export default App;