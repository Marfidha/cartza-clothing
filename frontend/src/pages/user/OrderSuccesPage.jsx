import React, { useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight, ShoppingBag, Stars, Moon, Sun } from "lucide-react";


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




// import React from 'react'
// import { useLocation, useNavigate } from "react-router-dom";
// import { CheckCircle } from "lucide-react";
// import OrdersPage from './OrdersPage';
// import { useEffect } from 'react';

// const OrderSuccesPage = () => {
//       const location = useLocation();
//   const navigate = useNavigate();

//   const orderId = location.state?.orderId;
//   useEffect(() => {
//   window.history.replaceState({}, document.title);
// }, []);
//   return (
//     <>
//      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//       <div className="bg-white shadow-xl rounded-2xl max-w-lg w-full p-8 text-center">
        
//         {/* Success Icon */}
//         <CheckCircle className="mx-auto text-green-500" size={80} />

//         {/* Title */}
//         <h1 className="text-2xl md:text-3xl font-bold mt-4 text-gray-800">
//           Order Placed Successfully 🎉
//         </h1>

//         {/* Subtitle */}
//         <p className="text-gray-600 mt-2">
//           Thank you for your purchase. Your order has been confirmed.
//         </p>

//         {/* Order ID */}
//         {orderId && (
//           <div className="bg-gray-100 rounded-lg p-4 mt-6">
//             <p className="text-gray-600 text-sm">Order ID</p>
//             <p className="font-semibold text-gray-800">{orderId}</p>
//           </div>
//         )}

//         {/* Delivery Info */}
//         <p className="text-gray-600 mt-4">
//           Estimated delivery in <span className="font-semibold">3–5 days</span>
//         </p>

//         {/* Buttons */}
//         <div className="flex flex-col md:flex-row gap-3 mt-8">
          
//           {/* View Order */}
//           <button
//             onClick={() => navigate("/userorders")}
//             className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
//           >
//             View Order
//           </button>

//           {/* Continue Shopping */}
//           <button
//             // onClick={() => navigate("/userorders")}
//             className="flex-1 border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
//           >
//             Continue Shopping
//           </button>

//         </div>
//       </div>
//     </div>
//     </>
//   )
// }

// export default OrderSuccesPage