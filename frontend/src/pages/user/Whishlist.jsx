import React, { useEffect, useState, useMemo } from "react";
import { Heart, ShoppingBag, X, Star, ArrowRight, ShoppingCart, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist,toggleWishlist  } from "../../Redux/Slices/WhishlistSlice";
import { useNavigate } from "react-router-dom";
import { AddtoCart } from "../../Redux/Slices/CartSlice";


const toast = {
  success: (msg) => console.log("Toast Success:", msg),
  error: (msg) => console.log("Toast Error:", msg),
};

function Whishlist() {
   
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showSizeModal, setShowSizeModal] = useState(false);
const [selectedProduct, setSelectedProduct] = useState(null);
const [selectedSize, setSelectedSize] = useState(null);
const [sizeError, setSizeError] = useState(false);


 const { products: Wishlist, loading } = useSelector(
  (state) => state.wishlist
);
const wishlistIds = useSelector(state => state.wishlist.ids);
const isLoggedIn = Boolean(localStorage.getItem("token"));

  useEffect(() => {
  const token = localStorage.getItem("token");
  if(!token){
    navigate("/login")
  }
  if (token) {
    dispatch(fetchWishlist());
  }
}, [dispatch]);


const handleAddToBagClick = (e, product) => {
  e.stopPropagation();
  setSelectedProduct(product);
  setSelectedSize(null);
  setSizeError(false);
  setShowSizeModal(true);
};
const handleConfirmAddToCart = () => {
  if (!selectedSize) {
    setSizeError(true);
    return;
  }

  dispatch(
    AddtoCart({
      productId: selectedProduct._id,
      size: selectedSize,
    })
  );

  toast.success("Product added to cart");
  setShowSizeModal(false);
};


  const handleWishlistClick = (e, productId) => {
  e.stopPropagation();

  if (!isLoggedIn) {
    navigate("/login");
    return;
  }

  dispatch(toggleWishlist(productId));
  
};



  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4 bg-white">
        <Loader2 className="w-10 h-10 text-black animate-spin" />
        <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Refining Selection</p>
      </div>
    );
  }

  // --- EMPTY STATE ---
  if (Wishlist.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="max-w-md w-full text-center">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gray-50 rounded-full scale-150 -z-10 animate-pulse"></div>
            <Heart size={64} strokeWidth={1} className="text-gray-300" />
          </div>
          <h2 className="text-3xl font-light text-gray-900 mb-4">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-10 leading-relaxed">
            Start adding items you love to your wishlist. They will be waiting for you here when you're ready to make them yours.
          </p>
          <button
            className="group inline-flex items-center justify-center gap-2 w-full bg-black text-white px-8 py-4 rounded-full font-medium transition-all hover:bg-gray-800 active:scale-[0.98]"
          >
            Explore Collections
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    );
  }

  // --- MAIN CONTENT ---
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-12 lg:py-20">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-10 mt-6 gap-4 border-b border-gray-100 pb-8">
          <div>
            {/* <nav className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              <span className="hover:text-black cursor-pointer">Home</span>
              <span>/</span>
              <span className="text-black">Wishlist</span>
            </nav> */}
            <h1 className="text-xl sm:text-3xl font-medium tracking-tight text-slate-900">
              My Wishlist
            </h1>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
            {Wishlist.length} {Wishlist.length === 1 ? "Product" : "Products"} Saved
          </div>
        </header>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
          {Wishlist.map((product) => (
            <article
              key={product._id}
              className="group flex flex-col cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative aspect-3/4 overflow-hidden bg-gray-50 mb-5 rounded-sm">
                <img
                  src={product.image?.[0]?.url}
                  alt={product.productName}
                  className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-110"
                />
                
                {/* Heart Button */}
                <div className="absolute top-4 right-4 z-10">
                  <button
                    onClick={(e) => handleWishlistClick(e, product._id)}
                    className="w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-md rounded-full shadow-sm hover:bg-white hover:scale-110 transition-all duration-300"
                  >
                    <Heart 
                      size={18} 
                      className={wishlistIds.includes(product._id) ? "fill-red-500 text-red-500" : "text-gray-400"} 
                    />
                  </button>
                </div>

              
                {/* Quick Add (Desktop Hover) */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 hidden md:block bg-gradient-to- from-black/40 to-transparent">
                  <button
                    onClick={(e) => handleAddToBagClick(e, product)}
                    className="w-full bg-white text-black py-4 text-[10px] font-bold uppercase tracking-[0.2em] shadow-2xl hover:bg-black hover:text-white transition-all active:scale-[0.98]"
                  >
                    Move to Bag
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="flex flex-col grow">
                {/* <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">
                    SS24 Collection
                  </span>
                  <div className="flex items-center gap-1">
                    <Star size={10} className="fill-black text-black" />
                    <span className="text-[10px] font-bold text-black">4.9</span>
                  </div>
                </div> */}
                
                <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-1 group-hover:text-gray-500 transition-colors">
                  {product.productName}
                </h3>

                <div className="mt-auto flex items-baseline gap-3">
                  <span className="text-sm font-bold text-black">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-gray-300 line-through">
                    ₹{Math.round(product.price * 1.5).toLocaleString()}
                  </span>
                </div>

                {/* Mobile Add Button */}
                <button
                  onClick={(e) => handleAddToBagClick(e, product)}
                  className="md:hidden w-full mt-5 flex items-center justify-center gap-2 border border-black text-black py-3 rounded-none text-[10px] font-bold uppercase tracking-[0.2em] active:bg-black active:text-white transition-all"
                >
                  <ShoppingCart size={14} />
                  Add to Bag
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Size Selection Drawer */}
      {showSizeModal && selectedProduct && (
        <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
            onClick={() => setShowSizeModal(false)}
          />
          
          <div className="relative bg-white w-full sm:max-w-[480px] rounded-t-[2.5rem] sm:rounded-sm shadow-2xl overflow-hidden animate-slideUp">
            
            <button
              onClick={() => setShowSizeModal(false)}
              className="absolute top-8 right-8 p-2 rounded-full hover:bg-gray-50 transition-colors z-10"
            >
              <X size={20} className="text-gray-900" />
            </button>

            <div className="p-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-2">Configure</p>
              <h2 className="text-2xl font-light text-gray-900 mb-8">Personalize Fit</h2>

              {/* Product Preview */}
              <div className="flex gap-8 mb-10 pb-8 border-b border-gray-100">
                <div className="w-24 h-32 shrink-0 bg-gray-50 overflow-hidden">
                  <img
                    src={selectedProduct.image?.[0]?.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    {selectedProduct.productName}
                  </p>
                  <p className="text-xl font-bold text-black">
                    ₹{selectedProduct.price.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Sizes */}
              <div className="mb-10">
                <div className="flex justify-between mb-5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900">Select Size</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 cursor-help border-b border-gray-200">Guide</span>
                </div>
                
                <div className="grid grid-cols-4 gap-3">
                  {selectedProduct.size?.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSize(size);
                        setSizeError(false);
                      }}
                      className={`h-14 flex items-center justify-center border text-xs font-bold transition-all
                        ${
                          selectedSize === size
                            ? "border-black bg-black text-white scale-105"
                            : "border-gray-100 hover:border-black text-gray-400"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                
                {sizeError && (
                  <p className="mt-6 text-[10px] font-bold uppercase tracking-widest text-red-500 text-center">
                    Please select a size to proceed
                  </p>
                )}
              </div>

              {/* Final CTA */}
              <button
                onClick={handleConfirmAddToCart}
                className="w-full bg-black text-white py-6 text-[11px] font-bold uppercase tracking-[0.3em] shadow-xl hover:bg-gray-900 active:scale-[0.98] transition-all"
              >
                Confirm & Add to Bag
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideUp { animation: slideUp 0.6s cubic-bezier(0.23, 1, 0.32, 1); }
      `}</style>
    </div>
  );
}

export default Whishlist;







// import React, { useEffect ,useState} from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchWishlist,toggleWishlist  } from "../../Redux/Slices/WhishlistSlice";
// import { Heart, ShoppingBag } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { AddtoCart } from "../../Redux/Slices/CartSlice";
// import toast from "react-hot-toast";



// function Whishlist() {
  
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [showSizeModal, setShowSizeModal] = useState(false);
// const [selectedProduct, setSelectedProduct] = useState(null);
// const [selectedSize, setSelectedSize] = useState(null);
// const [sizeError, setSizeError] = useState(false);


//  const { products: Wishlist, loading } = useSelector(
//   (state) => state.wishlist
// );
// const wishlistIds = useSelector(state => state.wishlist.ids);
// const isLoggedIn = Boolean(localStorage.getItem("token"));

//   useEffect(() => {
//   const token = localStorage.getItem("token");
//   if(!token){
//     navigate("/login")
//   }
//   if (token) {
//     dispatch(fetchWishlist());
//   }
// }, [dispatch]);


// const handleAddToBagClick = (e, product) => {
//   e.stopPropagation();
//   setSelectedProduct(product);
//   setSelectedSize(null);
//   setSizeError(false);
//   setShowSizeModal(true);
// };
// const handleConfirmAddToCart = () => {
//   if (!selectedSize) {
//     setSizeError(true);
//     return;
//   }

//   dispatch(
//     AddtoCart({
//       productId: selectedProduct._id,
//       size: selectedSize,
//     })
//   );

//   toast.success("Product added to cart");
//   setShowSizeModal(false);
// };


//   const handleWishlistClick = (e, productId) => {
//   e.stopPropagation();

//   if (!isLoggedIn) {
//     navigate("/login");
//     return;
//   }

//   dispatch(toggleWishlist(productId));
  
// };



//   if (loading) {
//     return <p className="text-center mt-10 h-screen">Loading wishlist...</p>;
//   }if(Wishlist.length===0){
//       return (
//     <div className="min-h-[70vh] lg:h-screen flex items-center justify-center bg-gray-50 px-4">
      
//       <div className="bg-white rounded-2xl shadow-md p-8 sm:p-12 text-center max-w-md w-full">
        
//         {/* Icon */}
//         <div className="flex justify-center mb-6">
//           <div className="bg-gray-100 p-5 rounded-full">
//             <Heart size={48} className="text-black" />
//           </div>
//         </div>

//         {/* Heading */}
//         <h2 className="text-2xl font-semibold text-gray-800 mb-2">
//           Your Wishlist is Empty
//         </h2>

//         {/* Subtext */}
//         <p className="text-gray-500 mb-6">
//           Save items you love by tapping the heart icon.  
//           You can review them anytime here.
//         </p>

//         {/* CTA Button */}
//         <button
//           onClick={() => navigate("/shop")}
//           className="w-full bg-black hover:bg-gray-500 text-white font-medium py-3 rounded-lg transition"
//         >
//           Browse Products
//         </button>

//         {/* Optional secondary link */}
//         <button
//           onClick={() => navigate("/")}
//           className="mt-3 text-sm text-gray-500 hover:text-gray-700"
//         >
//           Continue Shopping
//         </button>

//       </div>
//     </div>
//   );}

//   return (
//      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
    
//     {/* Header */}
//     <div className="mb-8">
//       <h1 className="text-2xl font-semibold text-gray-900">
//         My Wishlist
//       </h1>
//       <p className="text-gray-500 text-sm">
//         {Wishlist.length} items saved
//       </p>
//     </div>

//     {/* Grid */}
//     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6">
//       {Wishlist.map((product) => (
        
//         <div
//           key={product._id}
//           onClick={() => navigate(`/product/${product._id}`)}
//           className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 cursor-pointer relative"
//         >
          
//           {/* Remove Wishlist Button */}
//           <button
//             onClick={(e) => e.stopPropagation()}
//             className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur p-2 rounded-full shadow hover:scale-110 transition"
//           >
//                         <img
//                 onClick={(e) => handleWishlistClick(e, product._id)}
//                 className="w-5 h-5 cursor-pointer"
//                 src={
//                   isLoggedIn && wishlistIds.includes(product._id)
//                     ? "https://cdn-icons-png.flaticon.com/512/833/833472.png" // ❤️ red
//                     : whish // 🤍 normal
//                 }
//                 alt="wishlist"
//               />          </button>

//           {/* Image — FULL IMAGE SHOW */}
//           <div className="w-full bg-white flex items-center justify-center p-4">
//             <img
//               src={product.image?.[0]?.url}
//               alt={product.productName}
//               className="max-h-72 w-auto object-contain group-hover:scale-105 transition duration-300"
//             />
//           </div>

//           {/* Details */}
//           <div className="px-4 pb-4 space-y-2">
            
//             {/* Product Name */}
//             <h3 className="text-sm font-medium text-gray-800 line-clamp-2 ">
//               {product.productName}
//             </h3>

//             {/* Rating */}
//             {/* <div className="flex items-center gap-1 text-xs">
//               <span className="bg-green-600 text-white px-1.5 py-0.5 rounded">
//                 4.2
//               </span>
//               <span className="text-gray-500">(1.2k)</span>
//             </div> */}

//             {/* Price */}
//             <div className="flex items-center gap-2">
//               <span className="text-lg font-semibold text-gray-900">
//                 ₹{product.price}
//               </span>
//               <span className="text-sm text-gray-400 line-through">
//                 ₹{Math.round(product.price * 1.4)}
//               </span>
//               <span className="text-sm text-green-600 font-medium">
//                 30% off
//               </span>
//             </div>

//             {/* Add to Bag */}
//             <button
//               onClick={(e) => handleAddToBagClick(e, product)}
//               className="w-full mt-2 bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
//             >
//               Add to Bag
//             </button>

//           </div>
//         </div>

//       ))}
//     </div>

//     {showSizeModal && selectedProduct && (
//   <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
    
//     {/* Modal */}
//     <div className="bg-white w-full sm:w-[420px] rounded-t-2xl sm:rounded-2xl p-6 animate-slideUp">

//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold">
//           Select Size
//         </h2>
//         <button
//           onClick={() => setShowSizeModal(false)}
//           className="text-xl"
//         >
//           ✕
//         </button>
//       </div>

//       {/* Product Info */}
//       <div className="flex gap-4 mb-5">
//         <img
//           src={selectedProduct.image?.[0]?.url}
//           className="w-20 h-24 object-cover rounded"
//         />
//         <div>
//           <p className="text-sm font-medium line-clamp-2">
//             {selectedProduct.productName}
//           </p>
//           <p className="text-gray-700 font-semibold mt-1">
//             ₹{selectedProduct.price}
//           </p>
//         </div>
//       </div>

//       {/* Sizes */}
//       <p className="text-sm font-medium mb-3">Select Size</p>

//       <div className="flex flex-wrap gap-3 mb-4">
//         {selectedProduct.size?.map((size) => (
//           <button
//             key={size}
//             onClick={() => {
//               setSelectedSize(size);
//               setSizeError(false);
//             }}
//             className={`w-12 h-12 border rounded-full text-sm font-medium
//               ${
//                 selectedSize === size
//                   ? "border-black bg-black text-white"
//                   : "border-gray-300"
//               }`}
//           >
//             {size}
//           </button>
//         ))}
//       </div>

//       {sizeError && (
//         <p className="text-xs text-red-500 mb-3">
//           Please select a size
//         </p>
//       )}

//       {/* Add Button */}
//       <button
//         onClick={handleConfirmAddToCart}
//         className="w-full bg-black hover:bg-gray-500 text-white py-3 rounded-lg font-medium"
//       >
//         ADD TO BAG
//       </button>
//     </div>
//   </div>
// )}

//   </div>
//   );
// }

// export default Whishlist;
