import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function OrderProcessing() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // simulate processing time
    const timer = setTimeout(() => {
      navigate("/order-success", {
        state: location.state, // pass order data forward
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f6f4f1] text-center">

      {/* Spinner */}
      <div className="w-16 h-16 border-4 border-gray-300 border-t-black rounded-full animate-spin mb-6" />

      <h2 className="text-xl font-medium mb-2">
        Processing your order…
      </h2>

      <p className="text-gray-500 text-sm">
        Please do not close this page
      </p>
    </div>
  );
}

export default OrderProcessing;