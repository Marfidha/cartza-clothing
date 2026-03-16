import React, { useEffect ,useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { getcartitems, updateQty ,removeFromCart,AddtoCart} from "../../Redux/Slices/CartSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAlert from "../../alerts/hooks/useAlert";
import API from "../../../config/api";
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, ShieldCheck, Tag } from "lucide-react";


const CartPage = () => {
   const dispatch = useDispatch();
    const navigate=useNavigate()
    const { showSnackbar,showToast } = useAlert();

    const [coupon, setCoupon] = useState("");
    const [applying, setApplying] = useState(false);
    const [discount, setDiscount] = useState(0);
    const [finalTotal, setFinalTotal] = useState(0);

    const { items = [], loading = false } = useSelector(
      (state) => state.cart
    );
    
    useEffect(() => {
     const token = localStorage.getItem("token")
     if (!token) {
      navigate("/login")
      return
    }
     dispatch(getcartitems())
     }, [dispatch])

     const subtotal = items.reduce(
       (sum, item) => sum + item.product.price * item.quantity,
        0
     );
    const tax = subtotal * 0.08;
    const total = subtotal + tax;


    const applyCoupon=async()=>{
      if(!coupon) return showToast("Please enter a coupon code", "error");
      const token = localStorage.getItem("token");
      try{
        const res= await  API.post("/api/user/auth/apply-coupon",{code:coupon} ,
          { headers: { Authorization: `Bearer ${token}`}})
          setApplying(true)
          showToast("Coupon applied successfully");
          setDiscount(res.data.discount);
          setFinalTotal(res.data.total);
      }catch(error){
       showToast(
        error.response?.data?.message || "Invalid coupon",
        "error"
      );
      }
      }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-100 border-t-[#8B5CF6] rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium animate-pulse">Refining your cart...</p>
        </div>
      </div>
    );
  }

  if (!loading && items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFBF9] flex flex-col items-center justify-center text-center px-6">
        <div className="relative mb-8">
          <div className="absolute -inset-4 bg-[#8B5CF6]/5 rounded-full blur-2xl"></div>
          <ShoppingBag className="w-20 h-20 text-slate-200 relative z-10" strokeWidth={1.5} />
        </div>
        <h2 className="text-3xl font-bold text-[#1E293B] mb-3">Your cart is empty</h2>
        <p className="text-slate-500 mb-10 max-w-sm leading-relaxed">
          Discover our latest collection and find something special to fill your bag.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-[#1E293B] hover:bg-[#0F172A] text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-slate-200 transition-all active:scale-95 flex items-center gap-3 group"
        >
          Explore Products
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#FDFBF9] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-20">
        
        <header className="mb-8 lg:mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#1E293B] tracking-tight">
            Shopping <span className="text-[#8B5CF6]">Bag.</span>
          </h1>
          <p className="text-slate-400 mt-1 font-medium text-sm lg:text-base">{items.length} items ready for checkout</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          <div className="lg:col-span-8 space-y-4 lg:space-y-6">
            <div className="bg-white rounded-3xl lg:rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-50 overflow-hidden">
              <div className="p-4 sm:p-6 lg:p-8 divide-y divide-slate-100">
                {items.map((item) => {
                  const product = item.product;
                  return (
                    <div key={item._id} className="py-4 lg:py-6 first:pt-2 last:pb-2 flex gap-4 lg:gap-8 group items-center">
                      {/* Left: Compact Image Thumbnail */}
                      <div className="relative w-20 h-20 lg:w-32 lg:h-32 rounded-2xl overflow-hidden bg-slate-50 shrink-0 shadow-sm border border-slate-100 flex items-center justify-center">
                        <img
                          src={product.image?.[0]?.url}
                          alt={product.productName}
                          className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Right: Details Section */}
                      <div className="flex-1 flex flex-col justify-between min-w-0 h-full">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <h2 className="text-sm lg:text-xl font-bold text-[#1E293B] leading-snug truncate lg:whitespace-normal lg:line-clamp-2">
                              {product.productName}
                            </h2>
                            <div className="flex items-center gap-2 mt-0.5 text-[10px] lg:text-sm font-semibold text-slate-400 uppercase tracking-wider">
                              <span className="truncate">{product.color || "Default"}</span>
                              <span className="text-slate-200">•</span>
                              <span>{item.size}</span>
                            </div>
                          </div>
                          <p className="text-sm lg:text-xl font-bold text-[#1E293B] shrink-0">₹{product.price.toLocaleString()}</p>
                        </div>

                        <div className="flex items-center justify-between mt-3 lg:mt-6">
                          {/* Compact Stepper */}
                          <div className="flex items-center bg-[#F8FAFC] border border-slate-100 rounded-xl lg:rounded-2xl p-0.5 shadow-inner">
                            <button
                              onClick={() => dispatch(updateQty({ productId: product._id, action: "dec", size: item.size }))}
                              className="w-7 h-7 lg:w-10 lg:h-10 flex items-center justify-center text-slate-400 hover:text-[#8B5CF6] hover:bg-white rounded-lg transition-all active:scale-90"
                            >
                              <Minus size={12} className="lg:w-4 lg:h-4" />
                            </button>
                            <span className="w-6 lg:w-10 text-center font-bold text-[#1E293B] text-xs lg:text-base">{item.quantity}</span>
                            <button
                              onClick={() => dispatch(updateQty({ productId: product._id, action: "inc", size: item.size }))}
                              className="w-7 h-7 lg:w-10 lg:h-10 flex items-center justify-center text-slate-400 hover:text-[#8B5CF6] hover:bg-white rounded-lg transition-all active:scale-90"
                            >
                              <Plus size={12} className="lg:w-4 lg:h-4" />
                            </button>
                          </div>

                          <button
                            onClick={() => {
                              dispatch(removeFromCart(item._id));
                              showSnackbar("Removed from bag");
                            }}
                            className="p-2 lg:p-0 text-slate-300 hover:text-red-400 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="px-4 lg:px-8 flex items-center gap-3 text-slate-400 text-[10px] lg:text-sm font-medium">
               <ShieldCheck size={16} className="text-emerald-500 lg:w-[18px]" />
               Secure, encrypted checkout
            </div>
          </div>

          <div className="lg:col-span-4 sticky top-8">
            <div className="bg-white rounded-3xl lg:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-white p-6 lg:p-10">
              <h2 className="text-xl lg:text-2xl font-bold text-[#1E293B] mb-6 lg:mb-8">Summary</h2>

              <div className="space-y-4 lg:space-y-5 mb-6 lg:mb-8">
                <div className="flex justify-between text-slate-500 text-sm lg:text-base font-medium">
                  <span>Subtotal</span>
                  <span className="text-[#1E293B]">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-sm lg:text-base font-medium">
                  <span>Shipping</span>
                  <span className="text-emerald-500 font-bold uppercase text-[9px] lg:text-[10px] bg-emerald-50 px-2 py-1 rounded-lg">Free</span>
                </div>
                <div className="flex justify-between text-slate-500 text-sm lg:text-base font-medium">
                  <span>Tax (8%)</span>
                  <span className="text-[#1E293B]">₹{tax.toLocaleString()}</span>
                </div>

                {applying && (
                  <div className="flex justify-between text-emerald-600 font-bold items-center text-sm">
                    <span className="flex items-center gap-2">
                      <Tag size={14} /> Discount
                    </span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                )}

                <div className="pt-4 lg:pt-5 border-t border-slate-50">
                  <div className="flex justify-between items-end">
                    <span className="text-slate-400 font-bold uppercase tracking-[0.1em] text-[10px] lg:text-xs">Total</span>
                    <span className="text-2xl lg:text-3xl font-black text-[#1E293B]">
                      ₹{(applying ? finalTotal : total).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6 lg:mb-8">
                <label className="text-[10px] lg:text-[11px] font-bold text-[#64748B] uppercase tracking-widest ml-1 mb-2 block">Promo Code</label>
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center bg-[#F8FAFC] border-2 border-transparent focus-within:border-[#C4B5FD] focus-within:bg-white rounded-xl lg:rounded-2xl transition-all duration-300">
                    <input
                      type="text"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="SAVE10"
                      className="w-full bg-transparent p-2.5 lg:p-3 outline-none text-[#1E293B] font-bold placeholder:text-slate-300 uppercase text-xs lg:text-base"
                    />
                  </div>
                  <button
                    onClick={applyCoupon}
                    className="px-4 lg:px-6 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl lg:rounded-2xl font-bold transition-all text-xs lg:text-sm active:scale-95"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full h-14 lg:h-16 bg-[#1E293B] hover:bg-[#0F172A] text-white rounded-2xl lg:rounded-3xl font-bold flex items-center justify-between px-6 lg:px-8 transition-all duration-300 group shadow-xl shadow-slate-200 active:scale-95"
              >
                <span className="text-base lg:text-lg">Checkout</span>
                <div className="bg-white/10 p-1.5 lg:p-2 rounded-lg lg:rounded-xl group-hover:translate-x-1 transition-transform">
                  <ArrowRight size={18} className="lg:w-5 lg:h-5" />
                </div>
              </button>

              <div className="mt-6 lg:mt-8 flex flex-wrap justify-center gap-3 lg:gap-4 opacity-30 grayscale scale-75 lg:scale-100">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="Paypal" className="h-3 lg:h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3 lg:h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-3 lg:h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

