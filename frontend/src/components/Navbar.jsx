import React, { useState, useEffect } from 'react';
import { Search, User, ShoppingBag, Menu, X, Heart, ArrowRight } from 'lucide-react';
import { useParams } from "react-router-dom";
import {  Link ,useNavigate} from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../Redux/Slices/CategorySlice.js";
import { useLocation } from "react-router-dom";

const Navbar = () => {
    const navigate=useNavigate()
    const dispatch = useDispatch();
    const location = useLocation();

    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [selectedMain, setSelectedMain] = useState("");
    const { items, loading, error } = useSelector((state) => state.categories);
    const isCategoryPage = location.pathname.startsWith("/products/");
    
    useEffect(()=>{
      dispatch(fetchCategories())
    },[dispatch])

  const handleProfileClick = () => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login");  
    } else {
      navigate("/profile")
    }
  }
  useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > 50);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
  scrolled || !isCategoryPage
    ? "bg-white/80 backdrop-blur-md py-4 shadow-sm"
    : "bg-transparent py-6"
}`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-12">
            <a href="/">
              <h1 className={`text-2xl font-black tracking-tighter transition-colors duration-500 ${
                scrolled || !isCategoryPage ? 'text-[#1E293B]' : 'text-white'
              }`}>
                CARTZA.
              </h1>
            </a>
            
            <div className={`hidden lg:flex gap-8 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-500 ${
              scrolled || !isCategoryPage  ? 'text-[#64748B]' : 'text-white/70'
            }`}>
                <Link to="/" className="hover:text-[#8B5CF6] transition-colors">HOME</Link>
              {items?.map((cat) => (
                 <Link to={`/products/${cat.slug}`} key={cat._id}
                  className="hover:text-[#8B5CF6] transition-colors">
                  {cat.name.toUpperCase()}
                </Link>
              ))}
              

            </div>
          </div>
          
          <div className={`flex items-center gap-6 transition-colors duration-500 ${
           scrolled || !isCategoryPage ? 'text-[#1E293B]' : 'text-white'
          }`}>
            {isCategoryPage && (
            <Search size={20}
              onClick={() => setSearchOpen(!searchOpen)}
             className="cursor-pointer hover:text-[#8B5CF6] transition-colors" />
            )}
    
            <Link to="/whishlist"> <Heart size={20} className="cursor-pointer hover:text-[#8B5CF6] transition-colors" /></Link> 
            <User  size={20}  onClick={()=>handleProfileClick()} className="cursor-pointer hover:text-[#8B5CF6] transition-colors"  />
            <div className="relative cursor-pointer group">
              <Link to="/cart"> <ShoppingBag size={20} className="group-hover:text-[#8B5CF6] transition-colors" /></Link>
              {/* <span className="absolute -top-2 -right-2 bg-[#8B5CF6] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-lg">
                2
              </span> */}
            </div>

            <button className="lg:hidden" onClick={() => setIsMenuOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* --- MOBILE OVERLAY --- */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-60 bg-white p-6 flex flex-col animate-in slide-in-from-top duration-300">
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-2xl font-black tracking-tighter text-[#1E293B]">CARTZA.</h1>
            <button onClick={() => setIsMenuOpen(false)}>
              <X size={24} className="text-[#1E293B]" />
            </button>
          </div>
          <div className="flex flex-col gap-6 text-lg font-bold uppercase tracking-widest text-[#1E293B]">
            <a href="/" onClick={() => setIsMenuOpen(false)}>Home</a>
            {items?.map((cat) => (
              <a 
                key={cat._id} 
                href={`#${cat.slug}`} 
                onClick={() => setIsMenuOpen(false)}
              >
                {cat.name}
              </a>
            ))}
            <hr className="border-[#F1F5F9]" />
            <button 
                onClick={() => { handleProfileClick(); setIsMenuOpen(false); }}
                className="text-left uppercase"
            >
                Profile
            </button>
            <a href="#wishlist" onClick={() => setIsMenuOpen(false)}>Wishlist</a>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;


// import React, { useState ,useEffect, } from 'react'
// import logo from '../assets/logo.png'
// import search from '../assets/hed_search.png'
// import whish from "../assets/whish2.png"
// import cart from "../assets/hed_cart.png"
// import profile from "../assets/hed_profile.png"
// import { useParams } from "react-router-dom";
// import {  Link ,useNavigate} from 'react-router-dom'
// import { useDispatch, useSelector } from "react-redux";
// import { fetchCategories } from "../Redux/Slices/CategorySlice.js";
// // import { fetchSubCategories } from "../../Redux/Slices/SubCategories.js";


// function Navbar() {
//   const navigate=useNavigate()
//     const dispatch = useDispatch();

//     const [selectedMain, setSelectedMain] = useState("");
//     // const [NewSub,setNewSub] = useState("")
//     const { items, loading, error } = useSelector((state) => state.categories);
//     // const {  subItems,  subLoading,  subError } = useSelector((state) => state.subcategories);
//     useEffect(()=>{
//       dispatch(fetchCategories())
//       // dispatch(fetchSubCategories())
//     },[dispatch])

//   const handleProfileClick = () => {
//     const token = localStorage.getItem("token")
//     if (!token) {
//       navigate("/login");  
//     } else {
//       navigate("/profile")
//     }
//   }
 
//   return (
//     <>
    
//       <div className='w-full h-[55px] bg-[#948A80]  flex md:px-12 
      
//       ' >
//                 <div className='w-[10%]  flex justify-start items-center md:justify-center'>
//                      <img src={logo} alt="logo" className='w-[110px] h-[45px] md:w-[140px] ' />
//                 </div >
//                 <div className=' w-[35%] h-full flex flex-row justify-center items-center gap-9'>
//                       <Link to="/" className='text-white inter-font  transition transform hover:scale-110' >HOME </Link>
//                     {items?.map((cat) => (  
//                      <Link to={`/products/${cat.slug}`} key={cat._id}
//                         className="text-white inter-font transition transform hover:scale-110">
//                         {cat.name.toUpperCase()}
//                       </Link>
//                     ))}

//                 </div>
//                 <div className='w-[40%] h-full flex justify-center items-center flex-row '>
//                      <div className='flex items-center rounded-full px-2 py-1 border border-white bg-[#948A80]'>
//                         <input
//                           type="text"
//                           placeholder="Search"
//                           className="outline-none bg-[#948A80] text-white placeholder-white px-2 py-1 w-[200px] inter-font text-sm"
//                         />
//                         <button className="p-1 rounded-full hover:bg-[#a0968d] transition">
//                            <img src={search} alt="" className='h-4 w-4' />
                           
//                         </button>
//                      </div>
//                 </div>
//                 <div className='w-[15%] h-full flex flex-row gap-6 items-center justify-center'>
//                   <Link to="/whishlist"> <img src={whish} alt="" className='h-[25px] w-[25px] transition transform hover:scale-110' /></Link>
//                   <Link to="/cart"><img src={cart} alt=""  className='h-[25px] w-[25px] transition transform hover:scale-110 '/></Link>
//                      <img 
//                      onClick={()=>handleProfileClick()}
//                        src={profile} alt=""  className='h-[25px] w-[25px] transition transform hover:scale-110' />     
//                 </div>
//             </div>
            
//         <div>     
//         </div>
//     </>
//   )
// }

// export default Navbar