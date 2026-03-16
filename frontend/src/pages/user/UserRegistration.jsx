import GoogleLogin from "../../components/auth/GoogleLogin.jsx";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Mail, 
  Lock, 
  User, 
  Phone, 
  ArrowRight, 
  Stars, 
  Moon, 
  CheckCircle, 
  AlertCircle, 
  X, 
  ShieldCheck,
  Loader2
} from "lucide-react";
import API from "../../../config/api.js";

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === "success";

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[400px] animate-in fade-in slide-in-from-top-4 duration-300">
      <div className={`flex items-center gap-3 p-4 rounded-2xl shadow-2xl backdrop-blur-md border ${
        isSuccess ? "bg-white/90 border-emerald-100 text-emerald-900" : "bg-white/90 border-rose-100 text-rose-900"
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

function UserRegistration() {
  const navigate = useNavigate();
  const [Error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [notification, setNotification] = useState(null);

  const [userEmail, setuserEmail] = useState("");
  const [userPassword, setuserPassword] = useState("");
  const [userName, setuserName] = useState("");
  const [userPhoneno, setuserPhoneno] = useState("");

  const showNotification = (message, type) => setNotification({ message, type });

  const handlesendotp = async () => {
    if (!userEmail) return showNotification("Please enter email to receive OTP", "error");
    try {
      setLoading(true);
      await API.post("/api/user/auth/send-otp", { email: userEmail });
      setOtpSent(true);
      showNotification("OTP has been sent to your email", "success");
    } catch (error) {
      showNotification(error.response?.data?.message || "Failed to send OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return setError("Enter OTP");
    try {
      setLoading(true);
      setError("");
      await API.post("/api/user/auth/verify-otp", {
        email: userEmail,
        otp: otp.trim(),
      });
      setEmailVerified(true);
      setOtpSent(false);
      showNotification("Email verified successfully!", "success");
    } catch (err) {
      setError("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const hsndleuserRegistration = async () => {
    if (!emailVerified) return showNotification("Please verify your email first", "error");
    try {
      setLoading(true);
      await API.post("/api/user/auth/register", {
        email: userEmail,
        password: userPassword,
        name: userName,
        phoneno: userPhoneno,
      });
      showNotification("Registration successful!", "success");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      showNotification("Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Added pt-[80px] to provide space for your fixed navbar
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#FDFBF9] font-sans relative pt-80px md:pt-0">

      {notification && <Toast message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}

      {/* Left Branding - Centered vertically and responsive */}
      <div className="hidden md:flex flex-1 items-center justify-end px-8 z-10">
        <div className="max-w-sm w-full">
          <div className="inline-block p-2 bg-white rounded-2xl shadow-sm mb-6">
            <Stars className="text-[#8B5CF6] w-6 h-6" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#1E293B] leading-tight mb-4">
            Elevate your <br />
            <span className="text-[#8B5CF6]">Style Journey.</span>
          </h2>
          <p className="text-slate-500 font-medium leading-relaxed">
            Join our community to discover curated fashion and timeless pieces designed specifically for you.
          </p>
        </div>
      </div>

      {/* Right Form Container */}
      <div className="flex-1 flex flex-col justify-center items-center md:items-start px-4 sm:px-12 py-8 md:py-12 z-10 overflow-visible min-h-[calc(100vh-80px)] md:min-h-screen">
        <div className="w-full max-w-[400px] bg-white md:bg-transparent p-6 sm:p-8 md:p-0 rounded-3xl shadow-xl md:shadow-none">
          <header className="mb-8 mt-9">
            <h1 className="text-3xl lg:text-4xl font-bold text-[#1E293B] tracking-tight">
              User <span className="text-[#8B5CF6]">Registration.</span>
            </h1>
            <p className="text-slate-400 text-sm mt-2 font-medium">Step into a new world of fashion.</p>
          </header>

          <div className="space-y-4">
            <div className="relative group">
              <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest ml-1 mb-1 block">Email Address</label>
              <div className="flex items-center bg-[#F8FAFC] border-2 border-transparent focus-within:border-[#C4B5FD]/50 focus-within:bg-white rounded-xl transition-all duration-300">
                <div className="pl-4 text-[#94A3B8]"><Mail size={16} /></div>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setuserEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-transparent p-3 outline-none text-sm font-medium"
                />
                <button
                  onClick={handlesendotp}
                  disabled={emailVerified || loading}
                  className={`mr-2 px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${emailVerified ? "bg-emerald-50 text-emerald-600" : "bg-[#8B5CF6] text-white hover:bg-[#7C3AED]"}`}
                >
                  {emailVerified ? "Verified" : loading ? "..." : "Verify"}
                </button>
              </div>
            </div>

            <div className="relative group">
              <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest ml-1 mb-1 block">Full Name</label>
              <div className="flex items-center bg-[#F8FAFC] border-2 border-transparent focus-within:border-[#C4B5FD]/50 focus-within:bg-white rounded-xl transition-all duration-300">
                <div className="pl-4 text-[#94A3B8]"><User size={16} /></div>
                <input type="text" value={userName} onChange={(e) => setuserName(e.target.value)} placeholder="John Doe" className="w-full bg-transparent p-3 outline-none text-sm font-medium" />
              </div>
            </div>

            <div className="relative group">
              <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest ml-1 mb-1 block">Phone Number</label>
              <div className="flex items-center bg-[#F8FAFC] border-2 border-transparent focus-within:border-[#C4B5FD]/50 focus-within:bg-white rounded-xl transition-all duration-300">
                <div className="pl-4 text-[#94A3B8]"><Phone size={16} /></div>
                <input type="tel" value={userPhoneno} onChange={(e) => setuserPhoneno(e.target.value)} placeholder="+1 234 567 890" className="w-full bg-transparent p-3 outline-none text-sm font-medium" />
              </div>
            </div>

            <div className="relative group">
              <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest ml-1 mb-1 block">Password</label>
              <div className="flex items-center bg-[#F8FAFC] border-2 border-transparent focus-within:border-[#C4B5FD]/50 focus-within:bg-white rounded-xl transition-all duration-300">
                <div className="pl-4 text-[#94A3B8]"><Lock size={16} /></div>
                <input type="password" value={userPassword} onChange={(e) => setuserPassword(e.target.value)} placeholder="••••••••" className="w-full bg-transparent p-3 outline-none text-sm font-medium" />
              </div>
            </div>

            <button
              onClick={hsndleuserRegistration}
              disabled={!emailVerified || loading}
              className="w-full h-12 bg-[#1E293B] hover:bg-[#0F172A] text-white rounded-2xl font-bold flex items-center justify-between px-6 transition-all duration-300 shadow-lg disabled:opacity-50"
            >
              <span className="text-sm">{loading ? "Registering..." : "Complete Registration"}</span>
              <ArrowRight size={18} />
            </button>

            <div className="relative flex items-center justify-center py-2">
              <div className="w-full border-t border-slate-100"></div>
              <span className="absolute bg-white md:bg-[#FDFBF9] px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">Or</span>
            </div>

            <GoogleLogin />
          </div>

          <footer className="mt-8 text-center">
            <p className="text-sm text-slate-400 font-medium">
              Already have an account?{" "}
              <button onClick={() => navigate("/login")} className="text-[#8B5CF6] hover:text-[#7C3AED] font-bold underline underline-offset-4 decoration-2">Sign In</button>
            </p>
          </footer>
        </div>
      </div>

      {/* OTP Modal */}
      {otpSent && !emailVerified && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[380px] bg-white rounded-3xl p-8 shadow-2xl">
            <div className="flex justify-center mb-6"><ShieldCheck size={48} className="text-violet-500" /></div>
            <h2 className="text-2xl font-bold text-slate-900 text-center mb-1">Verify OTP</h2>
            <p className="text-slate-400 text-sm text-center mb-6">Enter code sent to {userEmail}</p>
            <input
              type="text"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full bg-[#F8FAFC] border-2 border-slate-100 rounded-xl py-4 text-center text-2xl font-black tracking-widest outline-none mb-4"
              maxLength={6}
            />
            {Error && <p className="text-rose-500 text-xs font-bold text-center mb-4">{Error}</p>}
            <button onClick={handleVerifyOtp} disabled={loading} className="w-full bg-[#1E293B] text-white py-4 rounded-xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2">
              {loading && <Loader2 className="animate-spin" size={18} />} Verify Code
            </button>
            <button onClick={() => setOtpSent(false)} className="w-full mt-4 text-sm text-slate-400 font-bold">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserRegistration;