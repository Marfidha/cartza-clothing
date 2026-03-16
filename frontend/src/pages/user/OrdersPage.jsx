import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders ,cancelOrderById} from "../../Redux/Slices/OrderSlice";
import { useAlert } from "../../alerts/context/AlertContext";
import { 
  Package, 
  Calendar, 
  ChevronRight, 
  ShoppingBag, 
  XCircle,
  Loader2
} from "lucide-react";

const OrdersPage = () => {

      const navigate = useNavigate();
      const dispatch = useDispatch();
      const { orders, loading } = useSelector((state) => state.order);
      const { showModal } = useAlert();

      useEffect(() => {
        dispatch(fetchUserOrders());
      }, [dispatch]);
  
      const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
          case "delivered":
            return "bg-emerald-50 text-emerald-600 border-emerald-100";
          case "cancelled":
            return "bg-rose-50 text-rose-500 border-rose-100";
          case "processing":
            return "bg-blue-50 text-blue-600 border-blue-100";
          default:
            return "bg-slate-50 text-slate-500 border-slate-100";
        }
      };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 space-y-4">
        <Loader2 className="w-8 h-8 text-slate-300 animate-spin" />
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-48 bg-white border border-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 py-8 sm:py-16 px-4 sm:px-10 mt-3">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-10 flex items-end justify-between border-b border-slate-200 pb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">Orders</h1>
            <p className="text-slate-500 text-sm mt-2 font-medium">Manage your recent purchase history</p>
          </div>
          <div className="bg-white border border-slate-200 h-11 px-5 rounded-2xl flex items-center gap-2.5 text-xs font-bold text-slate-600 shadow-sm">
            <ShoppingBag size={16} className="text-slate-400" />
            <span>{orders.length} Orders</span>
          </div>
        </header>

        {/* Empty State */}
        {orders.length === 0 && (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200 px-6">
            <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800">No orders yet</h3>
            <p className="text-slate-400 text-sm mt-2 mb-10 max-w-xs mx-auto">Start your collection by exploring our curated catalog.</p>
            <button onClick={()=>navigate("/")} className="px-8 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors">
              Explore Products
            </button>
          </div>
        )}

        {/* Orders Grid - Responsive Multi-column on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 ">
          {orders.map((order) => (
            <div 
              key={order._id}
              onClick={() => navigate(`/orders/${order._id}`)}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all hover:shadow-lg hover:border-slate-300 flex flex-col"
            >
              {/* Card Meta Info */}
              <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    <Calendar size={14} className="text-slate-400" />
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                  <div className="h-3 w-px bg-slate-200" />
                  <p className="text-[10px] font-medium text-slate-400 font-mono tracking-tight">#{order._id?.slice(-8).toUpperCase()}</p>
                </div>
                
                <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${getStatusStyles(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
              </div>

              {/* Items Area */}
              <div className="p-6 grow">
                <div className="space-y-5">
                  {order.items?.map((item) => (
                    <div key={item._id} className="flex gap-4 items-center group/item">
                      <div className="relative shrink-0">
                        <img
                          src={item.image}
                          alt=""
                          className="w-16 h-16 object-cover rounded-xl border border-slate-100 shadow-sm"
                        />
                       
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-800 text-sm sm:text-base truncate group-hover/item:text-slate-900">
                          {item.name}
                        </h4>
                        <p className="text-xs font-semibold text-slate-500 mt-0.5">
                          ₹{item.price?.toLocaleString()}
                        </p>
                      </div>
                      
                      <ChevronRight size={18} className="text-slate-300 group-hover/item:text-slate-600 transition-all transform group-hover/item:translate-x-1" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Footer */}
              <div className="px-6 pb-6 pt-3 flex items-center justify-between border-t border-slate-50 mt-auto">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Total Amount</span>
                  <div className="text-slate-900 font-bold text-lg tracking-tight">
                    ₹{order.totalAmount?.toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                 {order.orderStatus === "processing" && (
                    <button
                       onClick={async (e) => {
                        showModal({
                          type: "danger",
                          title: "Cancel this order?",
                          message: "This action cannot be undone. Your payment will be refunded according to our policy.",
                          onConfirm: async () => {
                            await dispatch(cancelOrderById(order._id));
                            dispatch(fetchUserOrders());
                          },
                        });
                      }}
                      className="text-rose-500 hover:text-white hover:bg-rose-500 border border-transparent hover:border-rose-200 px-3 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-1.5"
                    >
                      <XCircle size={14} />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <footer className="mt-20 text-center pb-10 border-t border-slate-100 pt-10">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em]">
            Sustainable Living • Curated Designs
          </p>
        </footer>
      </div>
    </div>
  );
};

export default OrdersPage;
