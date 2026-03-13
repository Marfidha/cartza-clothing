import React, { useEffect, useState } from 'react';
import { useDispatch ,useSelector} from 'react-redux'
import { getcartitems } from '../../Redux/Slices/CartSlice';
import { addAddress, getaddresses, } from '../../Redux/Slices/AddressSlice';
import { userprofiledata } from '../../Redux/Slices/UserSlice';
import { createOrder } from "../../Redux/Slices/OrderSlice";
import { useNavigate } from 'react-router-dom';
import { fetchWallet } from "../../Redux/Slices/WalletSlice";
import { useLocation } from "react-router-dom";
import useAlert from "../../alerts/hooks/useAlert";
import { 
  Check, 
  MapPin, 
  CreditCard, 
  Wallet, 
  ShieldCheck, 
  ChevronRight, 
  Plus, 
  X 
} from "lucide-react";
import axios from 'axios';

function Checkout() {
  const dispatch=useDispatch()
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast, showSnackbar, showModal } = useAlert();

  const directProduct = location.state?.product || null;
  const isDirect = location.state?.type === "direct";
  const [addAddressModal, setaddAddressModal] = useState(false);

  const [selectedPayment, setSelectedPayment] = useState("razorpay");
  const [addressData, setAddressData] = useState({
  name: "",
  phone: "",
  pincode: "",
  houseNumber: "",
  addressLine: "",
  locality: "",
  city: "",
  district: "",
  state: "",
  addressType: "Home",
  isDefault: false,
});
const [selectedAddressId, setSelectedAddressId] = useState(null);

  

  const cartItems = useSelector((state) => state.cart );
  const cartData = useSelector((state) => state.cart.items || []);
  const { user, loading:userloding, error } = useSelector((state) => state.user);
  const {addresses=[], loading:addressloading,error:addresserror }=useSelector((state)=>state.address)
  const walletBalance = useSelector( (state) => state.wallet?.balance ?? 0);

  const items = isDirect ? [directProduct] : cartData;
    const subtotal = items.reduce((total, item) => {
    const product = item.product || item;
    const price = product.price || 0;
    const qty = item.quantity || 1;
    return total + price * qty;
  }, 0);

  const shipping = subtotal > 500 ? 0 : 40;
  const tax = subtotal * 0.05;

  const total = subtotal + shipping + tax;

  const hasEnoughWallet = walletBalance >= total;

  // for direct purchase
  useEffect(() => {
  if (isDirect && !directProduct) {
    navigate("/cart", { replace: true });
  }
}, [isDirect, directProduct, navigate]);

  useEffect(()=>{
    if (!isDirect) {
        dispatch(getcartitems());
    }
        dispatch(userprofiledata())
        dispatch(getaddresses())
        dispatch(fetchWallet());
  },[dispatch])
  
useEffect(() => {
  if (user) {
    setAddressData((prev)=>({
      ...prev,
      name: user.name || "",
      phone: user.phoneno || "",
    }));
  }
}, [user]);

// useEffect(() => {
//   if (addresses?.data?.length > 0) {
//     const defaultAddress =
//       addresses.data.find((addr) => addr.isDefault) || addresses.data[0];

//     setSelectedAddressId(defaultAddress._id);
//   }
// }, [addresses]);


const hadleaddaddreedetails=async()=>{
  try {
    await dispatch(addAddress(addressData)).unwrap();

    showToast("Address added successfully", "success");
    setAddressData("");
    setaddAddressModal(false);
  } catch (error) {
    showToast(error?.message || "Failed to add address", "error");
  }
}


useEffect(() => {
  if (addresses.length > 0) {

    const defaultAddress = addresses.find(
      (addr) => addr.isDefault === true
    );

    if (defaultAddress) {
      setSelectedAddressId(defaultAddress._id);
    } else {
      setSelectedAddressId(addresses[0]._id);
    }
  }
}, [addresses]);

 
const handlePlaceOrder = async() => {
        if (!selectedAddressId) {
          showModal({title: "Delivery Address Required", message: "Please select or add a delivery address to continue.", type: "warning",  });
          return;
        }
      try{
        const token = localStorage.getItem("token");
        if(selectedPayment==="wallet"){
          const res=await dispatch(createOrder({selectedAddressId,selectedPayment,  directItem: isDirect ? directProduct : null})).unwrap()
          navigate("/processing", { state: { orderId: res.orderId}, replace: true})
        return
        }
       if (selectedPayment === "razorpay") {

      // 1️⃣ create razorpay order from backend
      const razorRes = await axios.post("http://localhost:3001/api/payment/create-razorpay-order",
        {amount: total},
        { headers: { Authorization: `Bearer ${token}`},}
      );
      const razorData = razorRes.data;
      const options = {
        key: razorData.key,
        amount: razorData.amount,
        currency: razorData.currency,
        order_id: razorData.razorpayOrderId,

        name: "Cartza Clothing",

        handler: async function (response) {
          console.log("Razorpay response:", response);
          const verifyRes = await axios.post("http://localhost:3001/api/payment/verify-payment",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            },
            {headers: {Authorization: `Bearer ${token}`},}
          );
          
          console.log("verify response:", verifyRes.data);
         const data = verifyRes.data;

          if (data.success) {
            // 3️⃣ create DB order
            const orderRes = await dispatch(createOrder({
              selectedAddressId,
              selectedPayment: "razorpay",
              directItem: isDirect ? directProduct : null
            })).unwrap();

            navigate("/processing", {
              state: { orderId: orderRes.orderId },
              replace: true
            });

          } else {
            showToast("Payment verification failed", "error");
          }

        }
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function () {
        showToast("Payment failed", "error");
      });

      razorpay.open();
    }


 }catch(error){
  if (error === "INSUFFICIENT_WALLET_BALANCE") {
      // navigate("/wallet");
      showModal({
    title: "Insufficient Wallet Balance",
    message: "Please recharge your wallet to continue.",
    type: "danger",
    onConfirm: () => navigate("/wallet"),
  });
  return;
 } 
  showToast(
  error?.message ||
  error?.response?.data?.message ||
  "Order failed",
  "error"
);
};
}

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] font-sans pt-20 pb-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT: Shipping & Payment */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Address Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
                  <MapPin size={20} className="text-gray-400" /> Shipping Address
                </h2>
                {addresses.length > 0 && (
                  <button 
                    onClick={() => setaddAddressModal(true)}
                    className="text-sm font-bold text-black border-b border-black hover:opacity-60 transition-opacity"
                  >
                    Add New
                  </button>
                )}
              </div>
              {addresses.length > 0 ? (
                <div className="space-y-4">
                 {addresses.map((address) => (
                    <div 
                      key={address._id}
                      onClick={() => setSelectedAddressId(address._id)}
                      className={`relative group cursor-pointer border rounded-2xl p-5 transition-all duration-300 ${
                        selectedAddressId === address._id 
                        ? 'border-black bg-white shadow-md' 
                        : 'border-gray-200 bg-transparent hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold uppercase text-sm tracking-wide">{address.name}</span>
                            <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full font-bold">
                              {address.addressType?.toUpperCase() || "HOME"}
                            </span>
                            {address.isDefault && (
                              <span className="text-[10px] text-gray-400 font-medium italic">Default</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed max-w-md">
                            {address.houseNumber}, {address.addressLine}, {address.locality}, {address.city}, {address.state} - {address.pincode}
                          </p>
                          <p className="text-sm font-medium text-gray-800">Mobile: {address.phone}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                          selectedAddressId === address._id ? 'bg-black border-black' : 'bg-white border-gray-300'
                        }`}>
                          {selectedAddressId === address._id && <Check size={12}  className="text-white" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-gray-100 rounded-3xl p-10 text-center space-y-4 shadow-sm">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                    <MapPin className="text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-medium">No saved addresses found</p>
                  <button 
                    onClick={() => setaddAddressModal(true)}
                    className="bg-black text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-zinc-800 transition-all"
                  >
                    Add First Address
                  </button>
                </div>
              )}
            </section>

            {/* Payment Section */}
            <section>
              <h2 className="text-xl font-semibold tracking-tight mb-6 flex items-center gap-2">
                <CreditCard size={20} className="text-gray-400" /> Payment Method
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  onClick={() => setSelectedPayment("razorpay")}
                  className={`border rounded-2xl p-5 cursor-pointer transition-all duration-300 ${
                    selectedPayment === "razorpay" ? 'border-black bg-white shadow-md' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-blue-50 rounded-xl">
                      <CreditCard className="text-blue-600" size={20} />
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      selectedPayment === "razorpay" ? 'bg-black border-black' : 'border-gray-300'
                    }`}>
                      {selectedPayment === "razorpay" && <Check size={12} className="text-white" />}
                    </div>
                  </div>
                  <h3 className="font-bold text-sm mb-1">Online Payment</h3>
                  <p className="text-xs text-gray-500 leading-tight">Cards, UPI, Netbanking via Razorpay</p>
                </div>

                <div 
                  onClick={() => hasEnoughWallet && setSelectedPayment("wallet")}
                  className={`border rounded-2xl p-5 transition-all duration-300 ${
                    !hasEnoughWallet ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer hover:border-gray-300'
                  } ${selectedPayment === "wallet" ? 'border-black bg-white shadow-md' : 'border-gray-200'}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-purple-50 rounded-xl">
                      <Wallet className="text-purple-600" size={20} />
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      selectedPayment === "wallet" ? 'bg-black border-black' : 'border-gray-300'
                    }`}>
                      {selectedPayment === "wallet" && <Check size={12} className="text-white" />}
                    </div>
                  </div>
                  <h3 className="font-bold text-sm mb-1">Wallet</h3>
                  <p className="text-xs text-gray-500">Balance: ₹{walletBalance.toFixed(2)}</p>
                  {!hasEnoughWallet && <p className="text-[10px] text-red-500 mt-2 font-medium">Insufficient balance</p>}
                </div>
              </div>
            </section>
          </div>


          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] sticky top-28">
              <h2 className="text-xl font-bold mb-8 tracking-tight">Order Summary</h2>
              
              <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {items.length > 0 ? items.map((item, index) => {
                   const product = item.product || item;
                  return (
                    <div key={index} className="flex gap-4 group">
                      <div className="w-20 h-24 bg-[#F5F5F5] rounded-2xl overflow-hidden ">
                        {product?.image && (
                          <img 
                            src={product.image?.[0]?.url || product.image} 
                            alt="" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                      </div>
                      <div className="flex-1 py-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-gray-800 line-clamp-1 uppercase">
                           {product.productName || product.name}
                          </h4>
                          <p className="text-xs text-gray-400 font-medium mt-1">
                            Qty: {item?.quantity || 1} • Size:  Size: {item.size}
                          </p>
                        </div>
                        <p className="text-sm font-black">₹{product.price?.toLocaleString()}</p>
                      </div>
                    </div>
                  );
                }) : (
                  <p className="text-sm text-gray-400 italic">No items in checkout.</p>
                )}
              </div>

              <div className="mt-8 pt-8 border-t border-gray-50 space-y-4">
                <div className="flex justify-between text-sm text-gray-500 font-medium">
                  <span>Subtotal</span>
                  <span className="text-black">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 font-medium">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-600" : "text-black"}>
                    {shipping === 0 ? "Free" : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 font-medium">
                  <span>GST (5%)</span>
                  <span className="text-black">₹{tax.toFixed(2)}</span>
                </div>
                
                <div className="pt-4 flex justify-between items-end">
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total</span>
                  <span className="text-2xl font-black tracking-tighter">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={handlePlaceOrder}
                className="w-full bg-black text-white h-16 rounded-2xl mt-8 font-bold text-base hover:bg-zinc-800 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl shadow-black/10"
              >
                Place Order <ChevronRight size={18} />
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                <ShieldCheck size={14} /> 100% Secure Checkout
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add Address */}
      {addAddressModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setaddAddressModal(false)} />
          <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl p-8 md:p-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-tight">New Address</h2>
              <button onClick={() => setaddAddressModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100"><X size={18} /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto px-1">
              <input 
                type="text" placeholder="Full Name" value={addressData.name}
                onChange={(e) => setAddressData({ ...addressData, name: e.target.value })}
                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm outline-none"
              />
              <input 
                type="text" placeholder="Phone Number" value={addressData.phone}
                onChange={(e) => setAddressData({ ...addressData, phone: e.target.value })}
                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm outline-none"
              />
              <input 
                type="text" placeholder="Pincode" value={addressData.pincode}
                onChange={(e) => setAddressData({ ...addressData, pincode: e.target.value })}
                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm outline-none"
              />
              <input 
                type="text" placeholder="House/Flat No." value={addressData.houseNumber}
                onChange={(e) => setAddressData({ ...addressData, houseNumber: e.target.value })}
                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm outline-none"
              />
              <div className="md:col-span-2">
                <input 
                  type="text" placeholder="Street / Area / Building" value={addressData.addressLine}
                  onChange={(e) => setAddressData({ ...addressData, addressLine: e.target.value })}
                  className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm outline-none"
                />
              </div>
              <input 
                type="text" placeholder="Locality" value={addressData.locality}
                onChange={(e) => setAddressData({ ...addressData, locality: e.target.value })}
                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm outline-none"
              />
              <input 
                type="text" placeholder="City" value={addressData.city}
                onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm outline-none"
              />
              <input 
                type="text" placeholder="State" value={addressData.state}
                onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm outline-none"
              />

              <div className="md:col-span-2 py-2 flex items-center justify-between">
                <div className="flex gap-4">
                  <button 
                    onClick={() => setAddressData({...addressData, addressType: 'Home'})}
                    className={`px-6 py-2 rounded-full text-xs font-bold border ${addressData.addressType === 'Home' ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-200'}`}
                  >HOME</button>
                  <button 
                    onClick={() => setAddressData({...addressData, addressType: 'Office'})}
                    className={`px-6 py-2 rounded-full text-xs font-bold border ${addressData.addressType === 'Office' ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-200'}`}
                  >OFFICE</button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <button onClick={() => setaddAddressModal(false)} className="h-14 rounded-2xl font-bold text-sm text-gray-400 hover:bg-gray-50">Cancel</button>
              <button onClick={hadleaddaddreedetails} className="h-14 bg-black text-white rounded-2xl font-bold text-sm">Save Address</button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E5E5; border-radius: 10px; }
      `}} />
    </div>
  );
}

export default Checkout;



// import React from 'react'
// import edit from "../../assets/edit-icon.png"
// import { Trash2 } from "lucide-react";
// import { useEffect } from 'react';
// import { useDispatch ,useSelector} from 'react-redux'
// import { getcartitems } from '../../Redux/Slices/CartSlice';
// import { addAddress, getaddresses, } from '../../Redux/Slices/AddressSlice';
// import { useState } from 'react';
// import { userprofiledata } from '../../Redux/Slices/UserSlice';
// import { createOrder } from "../../Redux/Slices/OrderSlice";
// import { useNavigate } from 'react-router-dom';
// import { fetchWallet } from "../../Redux/Slices/WalletSlice";
// import { useLocation } from "react-router-dom";



// function Checkout() {

//   const dispatch=useDispatch()
//   const navigate = useNavigate();
//   const location = useLocation();

//   const directProduct = location.state?.product || null;
//   const isDirect = location.state?.type === "direct";
//   const [addAddressModal, setaddAddressModal] = useState(false);

//   const [selectedPayment, setSelectedPayment] = useState("razorpay");
//   const [addressData, setAddressData] = useState({
//   name: "",
//   phone: "",
//   pincode: "",
//   houseNumber: "",
//   addressLine: "",
//   locality: "",
//   city: "",
//   district: "",
//   state: "",
//   addressType: "Home",
//   isDefault: false,
// });
// const [selectedAddressId, setSelectedAddressId] = useState(null);

  

//   const cartItems = useSelector((state) => state.cart );
//   const cartData = useSelector((state) => state.cart.items || []);
//   const { user, loading:userloding, error } = useSelector((state) => state.user);
//   const {addresses=[], loading:addressloading,error:addresserror }=useSelector((state)=>state.address)
//   const walletBalance = useSelector( (state) => state.wallet?.balance ?? 0);

//   const items = isDirect ? [directProduct] : cartData;
//     const subtotal = items.reduce((total, item) => {
//     const product = item.product || item;
//     const price = product.price || 0;
//     const qty = item.quantity || 1;
//     return total + price * qty;
//   }, 0);

//   const shipping = subtotal > 500 ? 0 : 40;
//   const tax = subtotal * 0.05;

//   const total = subtotal + shipping + tax;

//   const hasEnoughWallet = walletBalance >= total;

//   // for direct purchase
//   useEffect(() => {
//   if (isDirect && !directProduct) {
//     navigate("/cart", { replace: true });
//   }
// }, [isDirect, directProduct, navigate]);

//   useEffect(()=>{
//     if (!isDirect) {
//         dispatch(getcartitems());
//     }
//         dispatch(userprofiledata())
//         dispatch(getaddresses())
//         dispatch(fetchWallet());
//   },[dispatch])
  
// useEffect(() => {
//   if (user) {
//     setAddressData((prev)=>({
//       ...prev,
//       name: user.name || "",
//       phone: user.phoneno || "",
//     }));
//   }
// }, [user]);

// // useEffect(() => {
// //   if (addresses?.data?.length > 0) {
// //     const defaultAddress =
// //       addresses.data.find((addr) => addr.isDefault) || addresses.data[0];

// //     setSelectedAddressId(defaultAddress._id);
// //   }
// // }, [addresses]);


// const hadleaddaddreedetails=async()=>{
//   try {
//     await dispatch(addAddress(addressData)).unwrap();

//     alert("Address added successfully");
//     setAddressData("");
//     setaddAddressModal(false);
//   } catch (error) {
//     alert(error);
//   }
// }


// useEffect(() => {
//   if (addresses.length > 0) {

//     const defaultAddress = addresses.find(
//       (addr) => addr.isDefault === true
//     );

//     if (defaultAddress) {
//       setSelectedAddressId(defaultAddress._id);
//     } else {
//       setSelectedAddressId(addresses[0]._id);
//     }
//   }
// }, [addresses]);

 
// const handlePlaceOrder = async() => {
//   if (!selectedAddressId) {
//     alert("Please select a delivery address");
//     return;
//   }
//    if (selectedPayment === "razorpay") {
//     alert("Online payment is not available yet");
//     return;
//   }
//  try{
//  const res=await dispatch(createOrder({
//      selectedAddressId,selectedPayment,  directItem: isDirect ? directProduct : null
//   })).unwrap()

//       alert("Order placed successfully!");

//         navigate("/processing", { state: { orderId: res.orderId}, replace: true})
//  }catch(error){
//   if (error === "INSUFFICIENT_WALLET_BALANCE") {
//       navigate("/wallet");
//  } 
//   alert(
//   error?.message ||
//   error?.response?.data?.message ||
//   "Order failed"
// );
// };
// }
//   return (
//      <div className="min-h-screen bg-[#f6f6f6] p-4 flex justify-center items-center">
//       <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

//         {/* LEFT SECTION */}
//         <div className="bg-white rounded-xl px-20 p-15 shadow-sm h-fit">

//           {/* Contact Information */}
//         {addresses.length   > 0 && (
//   <>
//   {/* HEADER */}
//   <div className="flex items-center justify-between mb-4 ">
//     <h2 className="text-lg font-semibold">
//       Select Delivery Address
//     </h2>
    


//   </div>

 
  

//   {/* ADDRESS LIST */}
//   {addresses.map((address) => (
//     <div
//       key={address._id}
//       className=" rounded-lg pl-5 py-5 mb-4 shadow-sm"
//     >
//       {address.isDefault && (
//   <p className="text-xs font-semibold text-gray-500 mb-2">
//     DEFAULT ADDRESS
//   </p>
// )}

//       <div className="flex items-start gap-4">
//         {/* RADIO BUTTON */}
//         <input
//           type="radio"
//           name="address"
//           className="mt-1 accent-pink-500"
//          checked={selectedAddressId === address._id}
//   onChange={() => setSelectedAddressId(address._id)}
//         />

//         {/* ADDRESS DETAILS */}
//         <div className="flex-1">
//           <div className="flex items-center gap-3 mb-1">
//             <p className="font-semibold uppercase">
//               {address.name}
//             </p>

//             <span className="text-xs border border-green-500 text-green-600 px-2 py-0.5 rounded">
//               {address.addressType || "HOME"}
//             </span>
           
//           </div>

//           <p className="text-sm text-gray-700">
//             {address.addressLine}, {address.locality}, {address.city}
//           </p>

//           <p className="text-sm text-gray-700">
//             {address.state} - {address.pincode}
//           </p>

//           <p className="text-sm mt-2">
//             Mobile:{" "}
//             <span className="font-medium">
//               {address.phone}
//             </span>
//           </p>

//           <p className="text-sm mt-2 flex items-center gap-1">
//             • <span>Pay on Delivery available</span>
//           </p>

         
//         </div>
//       </div>
//     </div>
//   ))}
//   <div
//     onClick={() => setaddAddressModal(true)}
//     className="border border-dashed rounded-lg p-4 text-center text-pink-500 font-medium cursor-pointer hover:bg-pink-50"
//   >
//     + Add New Address
//   </div>
// </>

// )}
 


//           {addresses.length === 0 &&  (
//              <> 
//           <div className=" p-6 ">
//             <h2 className="text-xl  mb-4">Contact Information</h2>

//             <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
//               <input value={addressData.name}
//                 onChange={(e) =>setAddressData({ ...addressData, name: e.target.value })}
//                className="border border-gray-300 rounded-md p-2 w-full" placeholder="First Name" />
//               <input value={addressData.phone} onChange={(e) => setAddressData({ ...addressData, phone: e.target.value })}
//               className="border border-gray-300 rounded-md p-2 w-full" placeholder="Phone" />
//             </div>
//           </div>
          

//           {/* Shipping Information */}
//           <div className="px-6">
//            <h2 className="text-lg font-semibold mb-4">ADDRESS</h2>

//       {/* Pin Code */}
//       <div className="mb-4">
//         <input
//           type="text"
//            value={addressData.pincode} onChange={(e) =>  setAddressData({ ...addressData, pincode: e.target.value }) }
//           placeholder="Pin Code*"
//           className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-400"
//         />
//         <p className="text-sm text-red-500 mt-1">
//           This is a mandatory field
//         </p>
//       </div>

//       {/* House Number */}
//       <div className="mb-4">
//         <input
//          value={addressData.houseNumber}
//   onChange={(e) =>
//     setAddressData({ ...addressData, houseNumber: e.target.value })
//   }
//           type="text"
//           placeholder="House Number/Tower/Block*"
//           className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-400"
//         />
//         <p className="text-sm text-orange-500 mt-1">
//           *House Number will allow a doorstep delivery
//         </p>
//       </div>

//       {/* Address */}
//       <div className="mb-4">
//         <input
//          value={addressData.addressLine}
//   onChange={(e) =>
//     setAddressData({ ...addressData, addressLine: e.target.value })
//   }
//           type="text"
//           placeholder="Address (locality, building, street)*"
//           className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-400"
//         />
//         <p className="text-sm text-orange-500 mt-1">
//           *Please update society/apartment details
//         </p>
//       </div>

//       {/* Locality */}
//       <div className="mb-4">
//         <input
//          value={addressData.locality}
//   onChange={(e) =>
//     setAddressData({ ...addressData, locality: e.target.value })
//   }
//           type="text"
//           placeholder="Locality / Town*"
//           className="w-full border rounded px-3 py-2"
//         />
//       </div>

//       {/* City & State */}
//       <div className="grid grid-cols-2 gap-3 mb-6">
//         <input
//          value={addressData.city}
//   onChange={(e) =>
//     setAddressData({ ...addressData, city: e.target.value })
//   }
//           type="text"
//           placeholder="City / District*"
//           className="w-full border rounded px-3 py-2 bg-gray-100"
//         />
//         <input
//          value={addressData.state}
//   onChange={(e) =>
//     setAddressData({ ...addressData, state: e.target.value })
//   }
//           type="text"
//           placeholder="State*"
//           className="w-full border rounded px-3 py-2 bg-gray-100"
//         />
//       </div>

//       {/* Address Type */}
//       <div className="mb-4">
//         <p className="font-semibold mb-2">ADDRESS TYPE</p>
//         <div className="flex gap-6">
//           <label className="flex items-center gap-2 cursor-pointer">
//             <input 
//               value="home"
//                checked={addressData.addressType === "Home"}
//              onChange={(e) => setAddressData({ ...addressData, addressType: e.target.value })}
//             type="radio" name="addresstype"  />
//             <span>Home</span>
//           </label>

//           <label className="flex items-center gap-2 cursor-pointer">
//             <input
//              value="office"
//                checked={addressData.addressType === "Office"}
//              onChange={(e) => setAddressData({ ...addressData, addressType: e.target.value })}
//              type="radio" name="addresstype" />
//             <span>Office</span>
//           </label>
//         </div>
//       </div>

//       {/* Default Address */}
//       <div className="flex items-center gap-2">
//         <input type="checkbox"
//     checked={addressData.isDefault}
//     onChange={(e) =>
//       setAddressData({ ...addressData, isDefault: e.target.checked })
//     } 
//          />
//         <span>Make this as my default address</span>
//       </div>
      
//           </div>
// {/* Payment Method */}
// <div className="px-6 mt-6">
//   {/* <h2 className="text-lg font-semibold mb-4">PAYMENT METHOD</h2>

//   <div className="space-y-3">
//     <label className="flex items-center gap-3 cursor-pointer border p-3 rounded">
//       <input
//         type="radio"
//         name="payment"
//         value="razorpay"
//       />
//       <span>Razorpay (UPI / Card / Netbanking)</span>
//     </label>

//     <label className="flex items-center gap-3 cursor-pointer border p-3 rounded">
//       <input
//         type="radio"
//         name="payment"
//         value="cod"
//       />
//       <span>Cash on Delivery</span>
//     </label>

//     <label className="flex items-center gap-3 cursor-pointer border p-3 rounded">
//       <input
//         type="radio"
//         name="payment"
//         value="wallet"
//       />
//       <span>Wallet</span>
//     </label>
//   </div> */}

// </div>
// <div className=' py-4 grid grid-cols-1 lg:grid-cols-2 gap-4'>
//         <button className='border border-gray-300 rounded-md px-4 py-2'>CANCEL</button>
//     <button onClick={()=>hadleaddaddreedetails()}
//      className='bg-black text-white rounded-md px-4 py-2'>SAVE</button>
//       </div>
//      </>
// )}
//    <div className="bg-white p-6 rounded-xl shadow-sm">
//       <h2 className="text-lg font-semibold mb-4">Payment Method</h2>

//       <div className="space-y-4">

//         {/* Razorpay */}
//         <label
//           className={`flex items-start gap-4 border rounded-lg p-4 cursor-pointer transition 
//           ${selectedPayment === "razorpay"
//               ? "border-black bg-gray-50"
//               : "border-gray-200"
//             }`}
//         >
//           <input
//             type="radio"
//             name="payment"
//             value="razorpay"
//             checked={selectedPayment === "razorpay"}
//             onChange={(e) => setSelectedPayment(e.target.value)}
//             className="mt-1"
//           />
//           <div>
//             <p className="font-medium">Razorpay</p>
//             <p className="text-sm text-gray-500">
//               Pay using UPI, Debit/Credit Card, Net Banking
//             </p>
//           </div>
//         </label>

//         {/* COD */}
//         {/* <label
//           className={`flex items-start gap-4 border rounded-lg p-4 cursor-pointer transition 
//           ${selectedPayment === "cod"
//               ? "border-black bg-gray-50"
//               : "border-gray-200"
//             }`}
//         >
//           <input
//             type="radio"
//             name="payment"
//             value="cod"
//             checked={selectedPayment === "cod"}
//             onChange={(e) => setSelectedPayment(e.target.value)}
//             className="mt-1"
//           />
//           <div>
//             <p className="font-medium">Cash on Delivery</p>
//             <p className="text-sm text-gray-500">
//               Pay when your order is delivered
//             </p>
//           </div>
//         </label> */}

//         {/* Wallet */}
//         <label
//   className={`flex items-start gap-4 border rounded-lg p-4 transition
//     ${selectedPayment === "wallet"
//       ? "border-black bg-gray-50"
//       : "border-gray-200"}
//     ${!hasEnoughWallet ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
//   `}
// >
//   <input
//     type="radio"
//     name="payment"
//     value="wallet"
//     disabled={!hasEnoughWallet}
//     checked={selectedPayment === "wallet"}
//     onChange={(e) => setSelectedPayment(e.target.value)}
//     className="mt-1"
//   />

//   <div className="w-full">
//     <p className="font-medium">Wallet</p>

//     <p className="text-sm text-gray-500">
//       Balance: ₹{walletBalance.toFixed(2)}
//     </p>

//     {!hasEnoughWallet && (
//   <p className="text-xs text-red-500 mt-1">
//     Insufficient wallet balance. Please recharge your wallet to use this payment method.
//   </p>
// )}
//   </div>
// </label>

//       </div>
//     </div>

// {addAddressModal && (
//   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//     <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6">

//       {/* HEADER */}
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-lg font-semibold">Add New Address</h2>
//         <button
//           onClick={() => setaddAddressModal(false)}
//           className="text-gray-500 hover:text-black"
//         >
//           ✕
//         </button>
//       </div>

//       {/* FORM */}
//       <div className="space-y-3">

//         <input
//           type="text"
//           placeholder="Full Name"
//           value={addressData.name}
//           onChange={(e) =>
//             setAddressData({ ...addressData, name: e.target.value })
//           }
//           className="w-full border rounded-md px-3 py-2"
//         />

//         <input
//           type="text"
//           placeholder="Phone Number"
//           value={addressData.phone}
//           onChange={(e) =>
//             setAddressData({ ...addressData, phone: e.target.value })
//           }
//           className="w-full border rounded-md px-3 py-2"
//         />

//         <input
//           type="text"
//           placeholder="Pincode"
//           value={addressData.pincode}
//           onChange={(e) =>
//             setAddressData({ ...addressData, pincode: e.target.value })
//           }
//           className="w-full border rounded-md px-3 py-2"
//         />

//         <input
//           type="text"
//           placeholder="House No / Flat / Block"
//           value={addressData.houseNumber}
//           onChange={(e) =>
//             setAddressData({ ...addressData, houseNumber: e.target.value })
//           }
//           className="w-full border rounded-md px-3 py-2"
//         />

//         <input
//           type="text"
//           placeholder="Address (street / building)"
//           value={addressData.addressLine}
//           onChange={(e) =>
//             setAddressData({ ...addressData, addressLine: e.target.value })
//           }
//           className="w-full border rounded-md px-3 py-2"
//         />

//         <input
//           type="text"
//           placeholder="Locality"
//           value={addressData.locality}
//           onChange={(e) =>
//             setAddressData({ ...addressData, locality: e.target.value })
//           }
//           className="w-full border rounded-md px-3 py-2"
//         />

//         <div className="grid grid-cols-2 gap-3">
//           <input
//             type="text"
//             placeholder="City"
//             value={addressData.city}
//             onChange={(e) =>
//               setAddressData({ ...addressData, city: e.target.value })
//             }
//             className="w-full border rounded-md px-3 py-2 bg-gray-50"
//           />

//           <input
//             type="text"
//             placeholder="State"
//             value={addressData.state}
//             onChange={(e) =>
//               setAddressData({ ...addressData, state: e.target.value })
//             }
//             className="w-full border rounded-md px-3 py-2 bg-gray-50"
//           />
//         </div>

//         {/* ADDRESS TYPE */}
//         <div>
//           <p className="text-sm font-semibold mb-2">Address Type</p>
//           <div className="flex gap-6">
//             <label className="flex items-center gap-2">
//               <input
//                 type="radio"
//                 value="Home"
//                 checked={addressData.addressType === "Home"}
//                 onChange={(e) =>
//                   setAddressData({
//                     ...addressData,
//                     addressType: e.target.value,
//                   })
//                 }
//                 name="addressType"
//               />
//               Home
//             </label>

//             <label className="flex items-center gap-2">
//               <input
//                 type="radio"
//                 value="Office"
//                 checked={addressData.addressType === "Office"}
//                 onChange={(e) =>
//                   setAddressData({
//                     ...addressData,
//                     addressType: e.target.value,
//                   })
//                 }
//                 name="addressType"
//               />
//               Office
//             </label>
//           </div>
//         </div>

//         {/* DEFAULT ADDRESS */}
//         {/* <label className="flex items-center gap-2 mt-2">
//           <input
//             type="checkbox"
//             checked={addressData.isDefault}
//             onChange={(e) =>
//               setAddressData({
//                 ...addressData,
//                 isDefault: e.target.checked,
//               })
//             }
//           />
//           Make this my default address
//         </label> */}

//       </div>

//       {/* FOOTER */}
//       <div className="flex justify-end gap-3 mt-6">
//         <button
//           onClick={() => setaddAddressModal(false)}
//           className="px-4 py-2 border rounded-md"
//         >
//           Cancel
//         </button>

//         <button
//           onClick={() => hadleaddaddreedetails()}
//           className="px-4 py-2 bg-black text-white rounded-md"
//         >
//           Save Address
//         </button>
//       </div>
//     </div>
//   </div>
// )}

//         </div>

        

//         {/* RIGHT SECTION */}
//         <div className="bg-white rounded-xl p-6 shadow-sm h-fit">
//           <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
//            {/* ⭐ ADD THIS BLOCK HERE */}
//   {selectedPayment === "wallet" && (
//     <div className="text-sm mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
//       Wallet Balance: ₹{walletBalance.toFixed(2)}
//     </div>
//   )}

//        {items.map((item, index) => {
//   const product = item.product || item;

//   return (
//     <div key={index} className="flex gap-4 mb-4">

//       <div className="w-16 h-20 bg-gray-200 rounded-md">
//         <img
//           src={product.image?.[0]?.url || product.image}
//           alt=""
//         />
//       </div>

//       <div className="flex-1">
//         <p className="font-medium">
//           {product.productName || product.name}
//         </p>

//         <p className="text-sm text-gray-500">
//           Size: {item.size}
//         </p>
//       </div>

//       <p className="font-medium">
//         ₹{product.price}
//       </p>

//     </div>
//   );
// })}

//           <hr className="my-4" />
// <div className="space-y-2 text-sm">
//   <div className="flex justify-between">
//     <span>Subtotal</span>
//     <span>₹{subtotal.toFixed(2)}</span>
//   </div>

//   <div className="flex justify-between">
//     <span>Shipping</span>
//     <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
//   </div>

//   <div className="flex justify-between">
//     <span>Tax</span>
//     <span>₹{tax.toFixed(2)}</span>
//   </div>
// </div>

// <hr className="my-4" />

// <div className="flex justify-between font-semibold text-lg">
//   <span>Total</span>
//   <span>₹{total.toFixed(2)}</span>
// </div>

// <button
//   onClick={handlePlaceOrder}
//   className="w-full mt-6 bg-black text-white py-3 rounded-lg"
// >
//   Complete Order – ₹{total.toFixed(2)}
// </button>

//      </div>
//       </div>
//     </div>
  

//   )
// }

// export default Checkout