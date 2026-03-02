import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import GoogleLogin from "../../components/auth/GoogleLogin.jsx";
import { Mail, Lock, ArrowRight, Stars, Moon, CheckCircle, AlertCircle, X } from "lucide-react";

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === "success";

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[400px] animate-in fade-in slide-in-from-top-4 duration-300">
      <div className={`flex items-center gap-3 p-4 rounded-2xl shadow-2xl backdrop-blur-md border ${
        isSuccess 
          ? "bg-white/90 border-emerald-100 text-emerald-900" 
          : "bg-white/90 border-rose-100 text-rose-900"
      }`}>
        <div className={`p-2 rounded-xl ${isSuccess ? "bg-emerald-50 text-emerald-500" : "bg-rose-50 text-rose-500"}`}>
          {isSuccess ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold">{isSuccess ? "Success" : "Error"}</p>
          <p className="text-xs font-medium opacity-70">{message}</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
          <X size={16} className="text-slate-400" />
        </button>
      </div>
    </div>
  );
};

const UserLogin = () => {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null); // { message, type }
  const navigate = useNavigate();

  const handleuserlogin = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:3001/api/user/auth/userlogin", { 
        email: Email, 
        password: Password, 
      });
      const { token } = res.data;
      localStorage.setItem("token", token);
      
      setNotification({ message: "Welcome back! Redirecting to dashboard...", type: "success" });
      
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      setNotification({ 
        message: error.response?.data?.message || "Invalid credentials. Please try again.", 
        type: "error" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-[#FDFBF9] font-sans relative overflow-hidden">
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-[10%] left-[5%] animate-bounce opacity-40 z-0"style={{ animationDuration: "5s" }}>
        <Stars className="text-[#FFECC7] w-12 h-12" />
      </div>
      <div className="absolute bottom-[10%] right-[5%] animate-pulse opacity-40 z-0">
        <Moon className="text-[#E0E7FF] w-20 h-20 fill-current" />
      </div>

      {/* Modern Toast Notification */}
      {notification && (
        <Toast 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}

      {/* Left Branding/Hero Section */}
      <div className="hidden md:flex flex-1 items-center justify-end p-4 md:p-6 lg:p-8 lg:pr-4 z-10">
        <div className="max-w-xs lg:max-w-sm w-full">
          <div className="inline-block p-2 bg-white rounded-2xl shadow-sm mb-3 lg:mb-4">
            <Stars className="text-[#8B5CF6] w-6 h-6" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1E293B] leading-tight mb-3 lg:mb-4">
            Elevate your <br />
            <span className="text-[#8B5CF6]">Style Journey.</span>
          </h2>
          <p className="text-sm lg:text-base text-slate-500 font-medium leading-relaxed">
            Discover curated fashion,timeless pieces,and styles designed just for you.
          </p>
        </div>
      </div>

      {/* Login Section */}
      <div className="flex-1 h-full flex items-center justify-center md:justify-start p-4 z-10 bg-white/30 backdrop-blur-sm md:bg-transparent overflow-y-auto">
        <div className="w-full max-w-[380px] lg:max-w-[400px] bg-white md:bg-transparent rounded-3xl md:rounded-none shadow-xl md:shadow-none p-5 sm:p-8 md:p-0 transition-all duration-500 flex flex-col justify-center">
          
          <header className="mb-4 lg:mb-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1E293B] mb-1 tracking-tight">
              User <span className="text-[#8B5CF6]">Login.</span>
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm font-medium">Please enter your details to continue.</p>
          </header>

          <div className="space-y-4 lg:space-y-5">
            {/* Input Group */}
            <div className="space-y-3 lg:space-y-4">
              <div className="relative group">
                <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest ml-1 mb-1 block">
                  Your Email
                </label>
                <div className="flex items-center bg-[#F8FAFC] border-2 border-transparent focus-within:border-[#C4B5FD]/50 focus-within:bg-white rounded-xl transition-all duration-300 ring-0 focus-within:ring-2 ring-violet-50">
                  <div className="pl-4 text-[#94A3B8]">
                    <Mail size={16} />
                  </div>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={Email}
                    type="email"
                    placeholder="name@example.com"
                    className="w-full bg-transparent p-3 outline-none text-[#1E293B] text-sm font-medium placeholder:text-[#CBD5E1]"
                  />
                </div>
              </div>

              <div className="relative group">
                <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest ml-1 mb-1 block">
                  Password
                </label>
                <div className="flex items-center bg-[#F8FAFC] border-2 border-transparent focus-within:border-[#C4B5FD]/50 focus-within:bg-white rounded-xl transition-all duration-300 ring-0 focus-within:ring-2 ring-violet-50">
                  <div className="pl-4 text-[#94A3B8]">
                    <Lock size={16} />
                  </div>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={Password}
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-transparent p-3 outline-none text-[#1E293B] text-sm font-medium placeholder:text-[#CBD5E1]"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end -mt-1 lg:-mt-2">
              <button 
                onClick={() => navigate("/forgot-password")} 
                className="text-[10px] lg:text-[11px] font-bold text-[#8B5CF6] hover:text-[#7C3AED] transition-all"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              onClick={handleuserlogin}
              disabled={isLoading}
              className="w-full h-11 lg:h-13 bg-[#1E293B] hover:bg-[#0F172A] text-white rounded-2xl font-bold flex items-center justify-between px-6 transition-all duration-300 group shadow-lg shadow-slate-200 active:scale-[0.98] disabled:opacity-50"
            >
              <span className="text-sm lg:text-base">
                {isLoading ? "Authenticating..." : "Sign In"}
              </span>
              <div className="bg-white/10 p-1.5 rounded-lg group-hover:translate-x-1 transition-transform">
                <ArrowRight size={16} />
              </div>
            </button>

            {/* Aesthetic Divider */}
            <div className="relative flex items-center justify-center py-0.5 lg:py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <span className="relative bg-white md:bg-[#FDFBF9] px-3 text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">
                Or
              </span>
            </div>

            <GoogleLogin />
          </div>

          <footer className="mt-4 lg:mt-6 pt-3 lg:pt-5 border-t border-slate-50 md:border-transparent text-center">
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Don't have an account?{" "}
              <button 
                onClick={() => navigate("/register")} 
                className="text-[#8B5CF6] hover:text-[#7C3AED] underline underline-offset-4 decoration-2 font-bold transition-all"
              >
                Sign Up
              </button>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;