import React, { useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight, ShoppingBag,  } from "lucide-react";


const OrderSuccesPage = () => {

      const location = useLocation();
      const navigate = useNavigate();

      const orderId = location.state?.orderId;
      useEffect(() => {
      window.history.replaceState({}, document.title);
      }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FDFBF9] font-sans p-4 relative overflow-hidden">
      <div className="w-full max-w-[440px] relative z-10">
        <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 md:p-10 border border-white/50 text-center">
          
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-[#8B5CF6]/10 rounded-full scale-125 animate-pulse"></div>
              <CheckCircle2 className="relative text-[#8B5CF6]" size={70} strokeWidth={1.5} />
            </div>
          </div>

          <header className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-[#1E293B] mb-2">
              Order <span className="text-[#8B5CF6]">Confirmed.</span>
            </h1>
            <p className="text-sm text-[#64748B] font-medium leading-relaxed px-2">
              We've received your order and are preparing it with care.
            </p>
          </header>

          <div className="flex items-center justify-center gap-2 mb-8 text-[13px] text-[#64748B] font-semibold">
            <ShoppingBag size={16} className="text-[#8B5CF6]" />
            <span>Delivery: <span className="text-[#1E293B]">3–5 Business Days</span></span>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/userorders")}
              className="w-full h-14 bg-[#1E293B] hover:bg-[#0F172A] text-white rounded-2xl md:rounded-3xl font-bold flex items-center justify-between px-6 transition-all duration-300 group shadow-md active:scale-[0.98]"
            >
              <span className="text-base">View Orders</span>
              <div className="bg-white/10 p-1.5 rounded-lg group-hover:translate-x-1 transition-transform">
                <ArrowRight size={18} />
              </div>
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full h-14 bg-white border border-[#F1F5F9] hover:border-[#C4B5FD] text-[#64748B] hover:text-[#8B5CF6] rounded-2xl md:rounded-3xl font-bold text-base transition-all duration-300 active:scale-[0.98]"
            >
              Back to Store
            </button>
          </div>

          <footer className="mt-8 pt-5 border-t border-slate-50">
            <p className="text-[11px] text-slate-400 font-medium tracking-wide">
              Check your email for the order receipt.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccesPage;
