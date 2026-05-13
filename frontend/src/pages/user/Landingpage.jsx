import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight,MoveRight, Plus, Instagram, Twitter, ChevronRight,  Play,ArrowUpRight } from 'lucide-react';

import Section1 from '../../components/Section1';
import Section2 from '../../components/Section2';
import Section3 from '../../components/Section3';
import HeroSection from '../../components/HeroSection';

const App = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

    useEffect(() => {
    /* Injecting AOS styles */
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/aos@2.3.1/dist/aos.css';
    document.head.appendChild(link);

    /* Injecting AOS script and initializing */
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/aos@2.3.1/dist/aos.js';
    script.onload = () => {
      window.AOS.init({
        duration: 1000,
        once: false, // Set to false to repeat animation on scroll up/down
        offset: 100,
        easing: 'ease-out-quart',
        anchorPlacement: 'top-bottom',
      });
    };
    document.body.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFCFE] text-slate-900 overflow-x-hidden selection:bg-violet-100 selection:text-violet-600">
      <HeroSection/>
      <Section1/>
      <Section2/>
      <Section3/>

     {}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
        
        :root {
          scroll-behavior: smooth;
        }

        .font-serif { font-family: 'Playfair Display', serif; }
        body { 
          font-family: 'Inter', sans-serif; 
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }
        
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #fffdfa; }
        ::-webkit-scrollbar-thumb { background: #e5e5e5; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #b36b5d; }

        /* AOS Custom Tweaks */
        [data-aos] {
          transition-timing-function: cubic-bezier(.165,.84,.44,1);
        }
      `}</style>

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