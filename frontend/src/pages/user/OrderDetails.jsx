import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderDetailsbyid ,cancelOrderById} from "../../Redux/Slices/OrderSlice";
import useAlert from "../../alerts/hooks/useAlert";
import { 
  Package, 
  Truck, 
  MapPin, 
  CreditCard, 
  ChevronLeft, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Phone
} from "lucide-react";

const OrderDetails = () => {
   const { orderId } = useParams();
        
  const dispatch = useDispatch();
  const { showModal } = useAlert();

  const { order, loading } = useSelector((state) => state.order);

  useEffect(() => {
  if (orderId) {
    dispatch(fetchOrderDetailsbyid(orderId));
  }
}, [dispatch, orderId]);

const handleCancel = () => {
 showModal({
    title: "Cancel Order?",
    message: `Are you sure you want to cancel order #${order._id}? This action cannot be undone and your payment will be refunded.`,
    type: "danger",
    onConfirm: () => dispatch(cancelOrderById(orderId)),
  });
};


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <Package className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Order not found</h2>
        <p className="text-gray-500 mt-2 text-center">We couldn't retrieve the details for this specific order ID.</p>
      </div>
    );
  }

  const statusSteps = [
    { id: "processing", label: "Processing" },
    { id: "shipped", label: "Shipped" },
    { id: "out_for_delivery", label: "Out for Delivery" },
    { id: "delivered", label: "Delivered" },
  ];

  const currentStatusIndex = statusSteps.findIndex(s => s.id === order.orderStatus);

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12">
      {/* COMPACT TOP HEADER */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors text-sm font-medium">
            <ChevronLeft size={18} />
            <span className="hidden sm:inline">Back to Orders</span>
          </button>
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span className="text-gray-400 font-mono hidden sm:inline">ID: {order._id}</span>
            <span className={`px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
              order.orderStatus === 'cancelled' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'
            }`}>
              {order.orderStatus.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* LEFT CONTENT: TRACKING & ITEMS */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* TRACKING CARD */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-50 flex items-center gap-3">
                <Truck className="text-indigo-600" size={20} />
                <h3 className="font-bold text-gray-800">Tracking Status</h3>
              </div>
              <div className="p-6">
                <div className="flex flex-row items-start justify-between relative">
                  <div className="absolute top-4 left-[10%] right-[10%] h-0.5 bg-gray-100 z-0 hidden sm:block"></div>
                  
                  {statusSteps.map((step, index) => {
                    const isActive = index <= currentStatusIndex && order.orderStatus !== 'cancelled';
                    const isCurrent = index === currentStatusIndex;
                    
                    return (
                      <div key={step.id} className="flex flex-col items-center relative z-10 flex-1">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                          isActive 
                            ? 'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-100' 
                            : 'bg-white border-gray-200'
                        }`}>
                          {isActive ? (
                            <CheckCircle2 size={16} className="text-white" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                          )}
                        </div>
                        <p className={`mt-3 text-[10px] sm:text-xs font-bold text-center uppercase tracking-tight sm:tracking-normal ${
                          isActive ? 'text-gray-900' : 'text-gray-400'
                        }`}>
                          {step.label}
                        </p>
                        {isCurrent && (
                          <span className="absolute -bottom-4 text-[9px] font-black text-indigo-500 animate-pulse hidden sm:block">
                            CURRENT
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ORDERED ITEMS */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Package className="text-indigo-600" size={20} />
                  <h3 className="font-bold text-gray-800">Items ({order.items.length})</h3>
                </div>
              </div>
              <div className="divide-y divide-gray-50">
                {order.items.map((item) => (
                  <div key={item._id} className="p-4 sm:p-6 flex items-start gap-4 sm:gap-6 hover:bg-gray-50/50 transition-colors">
                    <div className="w-20 h-20 sm:w-28 sm:h-28 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-sm sm:text-lg truncate mb-1">{item.name}</h4>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
                        <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                          Price: <span className="font-semibold text-gray-900">₹{item.price}</span>
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                          Qty: <span className="font-semibold text-gray-900">{item.quantity}</span>
                        </p>
                      </div>
                      <p className="text-base sm:text-xl font-black text-gray-900">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {order.orderStatus === "cancelled" && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-700">
                <AlertCircle size={20} />
                <p className="text-sm font-bold">This order has been cancelled and a refund is being processed.</p>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Clock size={18} className="text-indigo-600" /> Order Summary
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping Fee</span>
                  <span className={`font-medium ${order.shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Estimated Tax</span>
                  <span className="font-medium text-gray-900">₹{order.tax}</span>
                </div>
                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="font-bold text-gray-900 text-base">Total</span>
                  <span className="font-black text-2xl text-indigo-600 tracking-tight">₹{order.totalAmount}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-indigo-600" /> Delivery Address
              </h3>
              <div className="space-y-2">
                <p className="font-bold text-gray-900 text-sm">{order.shippingAddress.name}</p>
                <div className="flex items-start gap-2 text-gray-500 text-xs sm:text-sm">
                  <Phone size={14} className="mt-0.5 shrink-0" />
                  <span>{order.shippingAddress.phone}</span>
                </div>
                <div className="text-gray-600 text-xs sm:text-sm leading-relaxed pt-1">
                  {order.shippingAddress.addressLine}, {order.shippingAddress.city},<br />
                  {order.shippingAddress.state} — {order.shippingAddress.pincode}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-indigo-600" /> Payment
              </h3>
              <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <p className="text-gray-400 mb-1">Method</p>
                  <p className="font-bold text-gray-800 uppercase">{order.paymentMethod}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 mb-1">Status</p>
                  <p className={`font-bold uppercase ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-orange-500'}`}>
                    {order.paymentStatus}
                  </p>
                </div>
              </div>
            </div>

            {order.orderStatus === "processing" && (
              <button 
                onClick={handleCancel}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-red-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;




// import React, { useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchOrderDetailsbyid ,cancelOrderById} from "../../Redux/Slices/OrderSlice";

// const OrderDetails = () => {
//         const { orderId } = useParams();
//         console.log(orderId);
        
//         console.log(orderId);
        
//   const dispatch = useDispatch();

//   const { order, loading } = useSelector((state) => state.order);

//   useEffect(() => {
//   if (orderId) {
//     dispatch(fetchOrderDetailsbyid(orderId));
//   }
// }, [dispatch, orderId]);

// const handleCancel = () => {
//   if (!window.confirm("Are you sure you want to cancel this order?")) return;

//   dispatch(cancelOrderById(orderId));
// };



// if (!order) return <h2>Order not found</h2>;
// if (loading) return <h2>Loading...</h2>;
// ;

//   return (
//     <>
//       <div className="min-h-screen bg-gray-50 py-8 px-4">
//   <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

//     {/* ================= LEFT SIDE ================= */}
//     <div className="lg:col-span-2 space-y-6">

//       {/* ORDER HEADER */}
//       <div className="bg-white p-6 rounded-xl shadow-sm">
//         <h2 className="text-xl font-bold">Order Details</h2>
//         <p className="text-gray-500 mt-1">
//           Order ID: {order._id}
//         </p>
//       </div>

//       {/* TRACKING */}
//       <div className="bg-white p-6 rounded-xl shadow-sm">
//         {/* TRACKING — AMAZON STYLE */}
// <div className="bg-white p-6 rounded-xl shadow-sm">
//   <h3 className="font-semibold mb-6">Tracking</h3>

//   <p className="text-lg font-medium capitalize mb-6">
//     Status: {order.orderStatus}
//   </p>

//   {/* HORIZONTAL STEPPER */}
//   <div className="flex items-center justify-between">

//     {[
//       "processing",
//       "shipped",
//       "out_for_delivery",
//       "delivered",
//     ].map((step, index) => {
//       const steps = [
//         "processing",
//         "shipped",
//         "out_for_delivery",
//         "delivered",
//       ];

//       const isActive = steps.indexOf(order.orderStatus) >= index;

//       return (
//         <div
//           key={step}
//           className="flex-1 flex flex-col items-center relative"
//         >

//           {/* LINE */}
//           {index !== 0 && (
//             <div
//               className={`absolute top-2 left-0 w-full h-1 
//               ${isActive ? "bg-green-500" : "bg-gray-300"}`}
//             />
//           )}

//           {/* DOT */}
//           <div
//             className={`z-10 w-5 h-5 rounded-full border-2 
//             ${
//               isActive
//                 ? "bg-green-500 border-green-500"
//                 : "bg-white border-gray-400"
//             }`}
//           />

//           {/* LABEL */}
//           <p className="text-sm mt-2 text-center capitalize">
//             {step.replaceAll("_", " ")}
//           </p>
//         </div>
//       );
//     })}
//   </div>
// </div>

//       </div>
       
        
        

//       {/* ITEMS */}
//       <div className="bg-white p-6 rounded-xl shadow-sm">
//         <h3 className="font-semibold mb-4">Items</h3>

//         {order.items.map((item) => (
//           <div
//             key={item._id}
//             className="flex gap-4 items-center border-b pb-4 mb-4"
//           >
//             <img
//               src={item.image}
//               alt=""
//               className="w-24 h-24 rounded-lg object-cover"
//             />

//             <div className="flex-1">
//               <p className="font-medium text-lg">{item.name}</p>
//               <p className="text-gray-500">Qty: {item.quantity}</p>
//               <p className="text-gray-500">₹{item.price}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//     </div>

//     {/* ================= RIGHT SIDE ================= */}
//     <div className="space-y-6">

//       {/* ORDER SUMMARY */}
//       <div className="bg-white p-6 rounded-xl shadow-sm">
//         <h3 className="font-semibold mb-3">Order Summary</h3>

//         <p>Subtotal: ₹{order.subtotal}</p>
//         <p>Tax: ₹{order.tax}</p>
//         <p>Shipping: ₹{order.shipping}</p>

//         <p className="font-bold mt-2 text-lg">
//           Total: ₹{order.totalAmount}
//         </p>
//       </div>

//       {/* SHIPPING ADDRESS */}
//       <div className="bg-white p-6 rounded-xl shadow-sm">
//         <h3 className="font-semibold mb-3">Shipping Address</h3>

//         <p>{order.shippingAddress.name}</p>
//         <p>{order.shippingAddress.phone}</p>
//         <p className="text-gray-600">
//           {order.shippingAddress.addressLine},{" "}
//           {order.shippingAddress.city},{" "}
//           {order.shippingAddress.state} —{" "}
//           {order.shippingAddress.pincode}
//         </p>
//       </div>

//       {/* PAYMENT */}
//       <div className="bg-white p-6 rounded-xl shadow-sm">
//         <h3 className="font-semibold mb-3">Payment</h3>

//         <p>Method: {order.paymentMethod}</p>
//         <p>Status: {order.paymentStatus}</p>
//       </div>

//       {/* CANCEL BUTTON */}
//       {order.orderStatus === "processing" && (
//         <button onClick={handleCancel}
//         className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition">
//           Cancel Order
//         </button>
//       )}
//       {/* {order.orderStatus === "cancelled" && (
//   <div className="bg-red-50 text-red-600 p-4 rounded-xl font-semibold">
//     This order has been cancelled
//   </div>
// )} */}


//     </div>

//   </div>
// </div>

//     </>
//   )
// }

// export default OrderDetails