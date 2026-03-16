import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { AddtoCart ,resetCartStatus} from "../../Redux/Slices/CartSlice";
import { fetchWishlist,toggleWishlist } from '../../Redux/Slices/WhishlistSlice';
import { useNavigate } from "react-router-dom";
import useAlert from "../../alerts/hooks/useAlert";
import { Heart, ShoppingBag, Star, ChevronRight,  MessageSquarePlus, X } from "lucide-react";
import API from "../../../config/api";

const WishlistIcon = ({ filled }) => (
  <Heart className={`w-5 h-5 transition-colors duration-300 ${filled ? 'fill-red-500 stroke-red-500' : 'stroke-slate-600'}`} />
);

function OneProduct() {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showToast, showSnackbar, showModal } = useAlert();

  const { id } = useParams();
  const [product, setProduct] = useState(null);

  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeError, setSizeError] = useState(false);

  const [activeImage, setActiveImage] = useState(0);

  const [showReviewModal, setShowReviewModal] = useState(false)
  const [rating, setRating] = useState(0)
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [reviews, setReviews] = useState([])
  const [loadingReviews, setLoadingReviews] = useState(true)
  const [reviewError, setReviewError] = useState("");

  const wishlistIds = useSelector(state => state.wishlist.ids);
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const { status, error } = useSelector((state) => state.cart);

  const handleBuyNow = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    showToast("Please login first", "error");
    navigate("/login");
    return;
  }
  if (!selectedSize) {
    setSizeError(true);
    return;
  }
  //  Send product data to checkout
  navigate("/checkout", {
  state: {
    type: "direct",
    product: {
      _id: product._id,   // ⭐ FIXED
      name: product.productName,
      price: product.price,
      image: product.image?.[0]?.url,
      size: selectedSize,
      quantity: 1
    }
    }
  })
  };

useEffect(() => {
  API
    .get(`/api/user/auth/feedback/${id}`)
    .then(res => setReviews(res.data.data))
    .catch(err => console.error(err))
    .finally(() => setLoadingReviews(false))
    }, [id])
    const handleSubmitReview = async () => {
    const token = localStorage.getItem("token")

  if (!token) {
    showToast("Please login first", "error")
    navigate("/login")
    return
  }
  if (!rating) {
    setReviewError("Please select a rating");
    return
  }
  if (!message.trim()) {
  setReviewError("Please write a review");
  return;
}
setReviewError("");
  try {
    setSubmitting(true)

    await API.post(
      "/api/user/auth/add",
      {
        productId: id,
        rating,
        message,
        type: "review"
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    showToast("Review submitted 🎉")
    setReviews(prev => [
      {
        _id: Date.now(),
        rating,
        message
      },
      ...prev
    ]);
    setShowReviewModal(false)
    setRating(0)
    setMessage("")

  } catch (err) {
  const msg =
    err.response?.data?.message || "Failed to submit review";
    setReviewError(msg)
  } finally {
    setSubmitting(false)
  }
}


    useEffect(() => {
      if (isLoggedIn) {
        dispatch(fetchWishlist());
      }
    }, [isLoggedIn, dispatch]);


  useEffect(() => {
    API
      .get(`/api/product/product/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);


useEffect(() => {
  if (status === "succeeded") {
    showToast("Item added to cart");
    dispatch(resetCartStatus());
  }
  if (status === "failed") {
    showToast(error || "Failed to add product");
    dispatch(resetCartStatus());
  }
}, [status]);

     const handleWishlistClick = (e, productId) => {
      e.stopPropagation();
      if (!isLoggedIn) {
       setShowLogin(true); 
      return;
      }
      dispatch(toggleWishlist(productId));
     };

  
  
    const handleAddToCart = (e,productid) => {
       e.stopPropagation();
         if (!selectedSize) {
        setSizeError(true);
         return;
        
  }

  setSizeError(false);
      const token = localStorage.getItem("token");
  
      if (!token) {
        navigate("/login");
        return [];
      }
      
      dispatch(AddtoCart({ productId: productid, size: selectedSize }));
    };
   if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] text-slate-900 font-sans selection:bg-slate-200">
      {/* Top spacing for real-world navbar height */}
      <div className="h-16 lg:h-20 w-full" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-6 lg:py-12">
        
        {/* Main Grid: Detail-Left / Image-Right on Mobile and Tablet */}
        <div className="grid grid-cols-12 gap-4 lg:gap-16">
          
          {/* PRODUCT INFO - Order 1 always (on mobile details stay left, on desktop details go right) */}
          <div className="col-span-7 sm:col-span-7 lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-24 h-fit">
            <div className="space-y-4 lg:space-y-8">
              <div>
                <nav className="hidden lg:flex items-center space-x-2 text-[10px] uppercase tracking-widest text-slate-400 mb-4">
                  <span>Home</span>
                  <ChevronRight className="w-3 h-3" />
                  <span>{product.category || "Collection"}</span>
                </nav>
                
                <h1 className="text-sm sm:text-base md:text-xl lg:text-4xl font-light tracking-tight text-slate-800 leading-tight mb-1 lg:mb-2">
                  {product.productName}
                </h1>
                
                <div className="flex flex-col lg:flex-row lg:items-baseline gap-1 lg:gap-4">
                  <p className="text-sm sm:text-base md:text-lg lg:text-2xl font-normal text-slate-600">
                    ₹{product.price?.toLocaleString()}
                  </p>
                  <span className="text-[7px] sm:text-[9px] lg:text-[10px] uppercase tracking-widest text-emerald-600 font-bold">
                    In Stock
                  </span>
                </div>
              </div>

              {/* Size Selection */}
              <div className="space-y-2 lg:space-y-4">
                <label className="text-[8px] sm:text-[10px] lg:text-xs font-bold tracking-widest text-slate-400 uppercase">
                  Select Size
                </label>
                <div className="flex flex-wrap gap-1 lg:gap-2">
                  {product.size?.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSize(selectedSize === size ? null : size);
                        setSizeError(false);
                      }}
                      className={`min-w-7 sm:min-w-10 lg:min-w-14 h-7 sm:h-10 lg:h-12 flex items-center justify-center rounded-sm text-[9px] sm:text-xs lg:text-sm transition-all duration-300 border ${
                        selectedSize === size
                          ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-200"
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {sizeError && (
                  <p className="text-[8px] sm:text-[10px] text-red-500 font-medium">Select size</p>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-2 lg:space-y-4 pt-1 lg:pt-4">
                <div className="flex flex-col gap-2 lg:flex-row">
                  <button
                    onClick={(e) => handleAddToCart(e, product._id)}
                    className="w-full h-9 sm:h-12 lg:h-14 bg-slate-900 text-white text-[8px] sm:text-[10px] lg:text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />
                    Add to Bag
                  </button>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={handleBuyNow}
                      className="flex-1 lg:hidden h-9 sm:h-12 border border-slate-900 text-slate-900 text-[8px] sm:text-[10px] font-bold tracking-widest uppercase rounded-sm"
                    >
                      Buy Now
                    </button>
                    <button
                      onClick={(e) => handleWishlistClick(e, product._id)}
                      className="w-9 h-9 sm:w-12 sm:h-12 lg:w-14 lg:h-14 border border-slate-200 rounded-sm flex items-center justify-center hover:bg-white hover:border-slate-400 transition-all"
                    >
                      <WishlistIcon filled={wishlistIds.includes(product._id)} />
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={handleBuyNow}
                  className="hidden lg:block w-full h-14 bg-transparent border border-slate-900 text-slate-900 text-xs font-bold tracking-[0.2em] uppercase rounded-sm hover:bg-slate-900 hover:text-white transition-all"
                >
                  Quick Checkout
                </button>
              </div>

              {/* Description - Desktop Only position */}
              <div className="hidden lg:block pt-10 border-t border-slate-200 space-y-8">
                <div className="space-y-3">
                  <h3 className="text-xs font-bold tracking-widest text-slate-800 uppercase">Description</h3>
                  <p className="text-sm leading-relaxed text-slate-500 font-light">{product.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* IMAGE GALLERY - Order 2 on Mobile (Stays right), Order 1 on Desktop (Goes left) */}
          <div className="col-span-5 sm:col-span-5 lg:col-span-7 order-2 lg:order-1">
            {/* Mobile/Tab View: Single focused image with thumbnail strip below */}
            <div className="lg:hidden flex flex-col gap-2">
              <div className="aspect-3/4 overflow-hidden bg-white rounded-sm shadow-sm">
                <img
                  src={product.image?.[activeImage]?.url}
                  alt={product.productName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
                {product.image?.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`w-8 h-10 sm:w-12 sm:h-16shrink-0 overflow-hidden rounded-sm border-2 transition-all ${
                      activeImage === index ? "border-slate-900" : "border-transparent"
                    }`}
                  >
                    <img src={img.url} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop View: Multi-grid */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {product.image?.map((img, index) => (
                <div key={index} className="group relative aspect-4/5 overflow-hidden bg-white rounded-sm shadow-sm hover:shadow-md transition-all">
                  <img
                    src={img.url}
                    alt={`${product.productName} - ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* BOTTOM SECTION: Modern minimalist flow */}
        <div className="mt-8 lg:mt-20 border-t border-slate-200 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            <div className="lg:col-span-7 space-y-8">
              
              {/* Product Info (Mobile/Tablet Flow) */}
              <div className="lg:hidden space-y-6">
                <div className="space-y-3">
                  <h3 className="text-[10px] font-bold tracking-widest text-slate-800 uppercase">Product Story</h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-500 font-light">{product.description}</p>
                </div>
                
                {/* Specifications repositioned below details on mobile */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div className="space-y-1">
                    <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-slate-400">Material</span>
                    <p className="text-[10px] sm:text-xs text-slate-700 font-medium">{product.material || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-slate-400">Brand</span>
                    <p className="text-[10px] sm:text-xs text-slate-700 font-medium">{product.brand || "Exclusive"}</p>
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="space-y-6 lg:space-y-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-[10px] lg:text-xs font-bold tracking-widest text-slate-800 uppercase mb-1">Reviews</h2>
                    <div className="flex items-center gap-2">
                        <div className="flex text-yellow-500">
                         {[...Array(5)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 lg:w-3 lg:h-3 fill-current" />)}
                        </div>
                        <span className="text-[10px] lg:text-[11px] text-slate-400">({reviews.length})</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="text-[9px] lg:text-[10px] flex items-center gap-2 uppercase tracking-widest text-slate-600 hover:text-black transition-colors"
                  >
                    <MessageSquarePlus className="w-3.5  lg:w-4 h-4" />
                    Write Review
                  </button>
                </div>

                <div className="space-y-4 lg:space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {loadingReviews ? (
                    <p className="text-[10px] text-slate-400 italic">Curating thoughts...</p>
                  ) : reviews.length === 0 ? (
                    <p className="text-[10px] text-slate-400 font-light">Be the first to share your experience.</p>
                  ) : (
                    reviews.map((r) => (
                      <div key={r._id} className="border-b border-slate-100 pb-4 lg:pb-6 last:border-0">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-2.5 h-2.5 lg:w-3 lg:h-3 ${i < r.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"}`} />
                            ))}
                          </div>
                          <span className="text-[8px] lg:text-[10px] text-slate-300 uppercase tracking-tighter">Verified</span>
                        </div>
                        <p className="text-xs lg:text-sm text-slate-600 font-light leading-relaxed">{r.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Specifications Column - Desktop Only position */}
            <div className="hidden lg:block lg:col-span-5 lg:pl-16">
               <div className="bg-white p-4 lg:p-8 rounded-sm shadow-sm space-y-6 sticky top-24">
                  <h3 className="text-xs font-bold tracking-widest text-slate-800 uppercase">Specifications</h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-1">
                      <span className="text-[8px] lg:text-[10px] uppercase tracking-widest text-slate-400">Material Composition</span>
                      <p className="text-[10px] lg:text-xs text-slate-700 font-medium">{product.material || "N/A"}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[8px] lg:text-[10px] uppercase tracking-widest text-slate-400">Manufactured By</span>
                      <p className="text-[10px] lg:text-xs text-slate-700 font-medium">{product.brand || "Exclusive"}</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* REVIEW MODAL */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 lg:p-8 w-full max-w-md rounded-sm shadow-2xl animate-in fade-in zoom-in duration-300 relative">
            <button onClick={() => setShowReviewModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg lg:text-xl font-light text-slate-800 mb-6 tracking-tight">Write a Review</h2>
            <div className="mb-6">
              <label className="text-[10px] uppercase tracking-widest text-slate-400 block mb-3">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRating(star)} className="transition-transform active:scale-90">
                    <Star className={`w-6 h-6 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-slate-100"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label className="text-[10px] uppercase tracking-widest text-slate-400 block mb-3">Message</label>
              <textarea
                placeholder="Share your thoughts..."
                value={message}
                onChange={(e) => {setMessage(e.target.value); setReviewError("");}}
                className="w-full border border-slate-100 bg-slate-50 p-3 text-xs lg:text-sm focus:outline-none focus:bg-white transition-all rounded-sm min-h-[100px]"
              />
            </div>
            {reviewError && <p className="text-[10px] text-red-500 mb-4">{reviewError}</p>}
            <button
              onClick={handleSubmitReview}
              disabled={submitting}
              className="w-full h-12 bg-slate-900 text-white text-[10px] lg:text-xs uppercase tracking-widest rounded-sm hover:bg-slate-800 disabled:bg-slate-300 transition-all flex items-center justify-center gap-2"
            >
              {submitting ? "Submitting..." : "Send Review"}
            </button>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}


export default OneProduct;