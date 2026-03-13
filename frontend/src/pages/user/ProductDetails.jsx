import React, { useEffect, useState } from 'react';
import axios from "axios"
import { useNavigate ,useParams ,useLocation} from 'react-router-dom';
import whish from '../../assets/icons8-like-50.png'
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist,toggleWishlist } from '../../Redux/Slices/WhishlistSlice.js';
import { fetchCategories } from "../../Redux/Slices/CategorySlice.js";
import UserRegistration from './UserRegistration';


const ChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
);

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
);

function ProductDetails() {

  const { category } = useParams()
  const navigate= useNavigate()
  const dispatch = useDispatch();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");

  const [sortBy, setSortBy] = useState("Featured")
  const [priceRange, setPriceRange] = useState([0, 10000]); // min, max
  const [showFilter, setShowFilter] = useState(false);

   const [product ,setproduct]=useState([])
   const [showLogin, setShowLogin] = useState(false);
   const { items, loading, error } = useSelector((state) => state.categories);
      
       
  const currentCategory = items.find((cat) => cat.slug === category);
  const wishlistIds = useSelector(state => state.wishlist.ids);
  const isLoggedIn = Boolean(localStorage.getItem("token"));


    const processedProducts = [...product]
    .filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])
    .sort((a, b) => {
    if (sortBy === "Price: Low-High") return a.price - b.price;
    if (sortBy === "Price: High-Low") return b.price - a.price;
    if (sortBy === "Newest") return new Date(b.createdAt) - new Date(a.createdAt);
    return 0; // Featured
    });


      useEffect(()=>{
         dispatch(fetchCategories())
       },[dispatch])


          useEffect(() => {
            if (isLoggedIn) {
              dispatch(fetchWishlist());
            }
          }, [isLoggedIn, dispatch]);
 

useEffect(() => {

  const fetchProducts = async () => {

    try {
      const query = new URLSearchParams(location.search).get("q");
      let url = `http://localhost:3001/api/product/productbycategory?slug=${category}`;
      if (query) {
        url += `&q=${query}`;
      }
      const res = await axios.get(url);
      setproduct(res.data);
    } catch (err) {
      console.error(err);
    }

  };

  fetchProducts();

}, [category, location.search]);

  const handleWishlistClick = (e, productId) => {
  e.stopPropagation();
  if (!isLoggedIn) {
    navigate("/login");
    return;
  }
  dispatch(toggleWishlist(productId));
  };
  

  return (
    <div className="min-h-screen bg-white">
      {/* Dynamic Banner from Admin */}
      <section className="relative w-full h-[45vh] md:h-[55vh] overflow-hidden bg-neutral-100">
        {currentCategory?.banner ? (
            <img
             src={currentCategory?.banner}
             alt={currentCategory?.name}
            className="w-full h-full object-cover transition-opacity duration-1000"
            />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-neutral-900 text-white">
             <h1 className="text-4xl font-light tracking-widest uppercase">{category}</h1>
          </div>
        )}
        <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center">
            <h1 className="text-white text-5xl md:text-7xl font-bold uppercase tracking-tighter drop-shadow-md mb-4">
                {currentCategory?.name || category}
            </h1>
            <div className="w-16 h-0.5 bg-white/80"></div>
        </div>
      </section>

      {/* Modern Sort & Filter Bar */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <button
              onClick={() => setShowFilter(true)}
              className="flex items-center space-x-2 text-[10px] font-bold text-neutral-800 hover:text-neutral-500 transition-colors uppercase tracking-[0.2em]">
              <FilterIcon />
              <span>Filter Pieces</span>
            </button>
            <span className="hidden md:inline text-neutral-200">|</span>
            <div className="hidden md:flex space-x-6">
                <span className="text-[10px] text-neutral-400 uppercase tracking-[0.2em] font-bold">Category: {currentCategory?.name}</span>
            </div>
          </div>

          <div className="relative group">
            <button className="flex items-center space-x-2 text-[10px] font-bold text-neutral-800 hover:text-neutral-500 transition-colors uppercase tracking-[0.2em]">
              <span>Sort: {sortBy}</span>
              <ChevronDown />
            </button>
            {/* Minimal Dropdown */}
            <div className="absolute right-0 mt-2 w-56 bg-white border border-neutral-100 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-3 z-50">
              {['Featured', 'Newest', 'Price: Low-High', 'Price: High-Low'].map((option) => (
                <button 
                  key={option} 
                  onClick={() => setSortBy(option)}
                  className="w-full text-left px-6 py-2.5 text-[10px] uppercase tracking-widest hover:bg-neutral-50 text-neutral-500 hover:text-black transition-colors"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {product.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-neutral-400 font-light tracking-widest">
            <p className="text-sm uppercase">Curating Collection...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {processedProducts.map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
                className="group cursor-pointer flex flex-col"
              >
                {/* Product Image Container */}
                <div className="relative aspect-3/4 overflow-hidden bg-neutral-50 mb-6">
                  <img
                    src={product.image?.[3]?.url}
                    alt={product.productName}
                    className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                  />
                  
                  {/* Wishlist Button */}
                 <div className="absolute top-5 right-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
  <button
    onClick={(e) => handleWishlistClick(e, product._id)}
    className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-white active:scale-90 transition-all"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={
        isLoggedIn && wishlistIds.includes(product._id)
          ? "#ef4444"
          : "none"
      }
      stroke={
        isLoggedIn && wishlistIds.includes(product._id)
          ? "#ef4444"
          : "currentColor"
      }
      strokeWidth="2"
      className="w-4 h-4"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  </button>
</div>

                  {/* Aesthetic Label */}
                  <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-black/90 text-white text-center py-4 text-[9px] uppercase tracking-[0.3em] font-bold">
                    View Details
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col space-y-2 px-1 text-center lg:text-left">
                  <h3 className="text-[11px] font-bold text-neutral-900 uppercase tracking-widest truncate">
                    {product.productName}
                  </h3>
                  <div className="flex items-center justify-center lg:justify-start space-x-3">
                    <span className="text-sm font-light text-neutral-900">₹{product.price.toLocaleString()}</span>
                    {product.oldPrice && (
                        <span className="text-[10px] text-neutral-400 line-through font-light">₹{product.oldPrice.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
{showFilter && (
  <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end items-end md:items-stretch">
    
    {/* CLICK OUTSIDE */}
    <div
      className="absolute inset-0"
      onClick={() => setShowFilter(false)}
    />

    {/* PANEL */}
    <div
      className="
        relative w-full md:w-[320px]
        h-[45vh] md:h-full
        bg-white shadow-2xl
        rounded-t-2xl md:rounded-none
        p-5 overflow-y-auto
      "
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xs font-bold uppercase tracking-[0.25em]">
          Filter
        </h2>

        <button
          onClick={() => setShowFilter(false)}
          className="text-neutral-500 hover:text-black text-lg"
        >
          ✕
        </button>
      </div>

      {/* PRICE FILTER */}
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-widest mb-3">
          Price Range
        </h3>

        <input
          type="range"
          min="0"
          max="10000"
          value={priceRange[1]}
          onChange={(e) =>
            setPriceRange([0, Number(e.target.value)])
          }
          className="w-full accent-black"
        />

        <div className="flex justify-between text-xs mt-2 text-neutral-600">
          <span>₹0</span>
          <span>₹{priceRange[1]}</span>
        </div>
      </div>

      {/* APPLY BUTTON */}
      <button
        onClick={() => setShowFilter(false)}
        className="
          w-full py-3 bg-black text-white
          text-xs font-bold uppercase tracking-[0.2em]
          hover:bg-neutral-800 transition
        "
      >
        Apply
      </button>
    </div>
  </div>
)}

      {/* Login Modal Simulation */}
      {showLogin && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white p-10 max-w-sm w-full rounded-sm shadow-2xl text-center">
            <h2 className="text-xl font-bold uppercase tracking-widest mb-4">Member Access</h2>
            <p className="text-neutral-500 text-xs font-light tracking-wide mb-8 leading-relaxed">
              Sign in to manage your collection and save your favorite pieces to your wishlist.
            </p>
            <button onClick={() => setShowLogin(false)} className="w-full py-4 bg-black text-white text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-neutral-800 transition-colors">
              Continue to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;





// import React, { useEffect, useState } from 'react'
// import axios from "axios"
// import { useNavigate ,useParams } from 'react-router-dom';
// import menbanner from "../../assets/men-main-image.jpg"

// import productimg1 from "../../assets/3f46a4031152b05e223a0e5edba27e4ccf677f41.jpg"
// import whish from '../../assets/icons8-like-50.png'
// import { useDispatch, useSelector } from "react-redux";
// import { fetchWishlist,toggleWishlist } from '../../Redux/Slices/WhishlistSlice';
// import { fetchCategories } from "../../Redux/Slices/CategorySlice.js";
// import UserRegistration from './UserRegistration';

// function ProductDetails() {

//   const { category } = useParams()
//   const navigate= useNavigate()
//   const dispatch = useDispatch();

//    const [product ,setproduct]=useState([])
//    const [showLogin, setShowLogin] = useState(false);
//       const { items, loading, error } = useSelector((state) => state.categories);
//        // const {  subItems,  subLoading,  subError } = useSelector((state) => state.subcategories);
//        useEffect(()=>{
//          dispatch(fetchCategories())
//          // dispatch(fetchSubCategories())
//        },[dispatch])
//        const currentCategory = items.find(
//   (cat) => cat.slug === category
// );



// const wishlistIds = useSelector(state => state.wishlist.ids);
// const isLoggedIn = Boolean(localStorage.getItem("token"));

// useEffect(() => {
//   if (isLoggedIn) {
//     dispatch(fetchWishlist());
//   }
// }, [isLoggedIn, dispatch]);
 

//   useEffect(()=>{
//     setproduct([])
//     const res=axios.get(`http://localhost:3001/api/product/productbycategory?slug=${category}`)
//     .then(res=> setproduct(res.data))
//     .catch((err) => console.error(err));
//   },[category])

//   const handleWishlistClick = (e, productId) => {
//   e.stopPropagation();

//   if (!isLoggedIn) {
//     navigate("/login");
//     return;
//   }

//   dispatch(toggleWishlist(productId));
// };

//   return (
//     <>

    
//    <main>
//     <section>
//         <div className='h-auto'>
//             <img
//   src={currentCategory?.banner}
//   alt={currentCategory?.name}
//   className="w-full"
// />

//         </div>
//     </section>
//     <section>
//       <div className='p-10'>
//         <div className="h-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 ">
//   {product.map((product) => (
//     <div
//       key={product._id}
//       onClick={()=>navigate(`/product/${product._id}`)}
//       className="bg-white   transition"
//     >
//       <img
//         src={product.image?.[3]?.url}
//         alt={product.productName}
//         className="w-full  object-cover rounded-t-lg"
//       />

//       <div className="p-4 flex justify-between" >
//         <div>
//         <h3 className="font-semibold text-gray-800"> {product.productName}</h3>
//          <p className="text-gray-600">₹{product.price}</p>
//          </div>
//          <div >
//           <img
//   onClick={(e) => handleWishlistClick(e, product._id)}
//   className="w-5 h-5 cursor-pointer"
//   src={
//     isLoggedIn && wishlistIds.includes(product._id)
//       ? "https://cdn-icons-png.flaticon.com/512/833/833472.png" // ❤️ red
//       : whish // 🤍 normal
//   }
//   alt="wishlist"
// />
//          </div>
//       </div>
//     </div>
    
//   ))}
// </div>
// </div>

//     </section>
//     {showLogin && <UserRegistration onClose={() => setShowLogin(false)} />}

//    </main>
//     </>
//   )
// }

// export default ProductDetails