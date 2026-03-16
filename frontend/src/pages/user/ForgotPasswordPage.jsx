import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, KeyRound, ArrowRight, Stars, Moon, Sun, CheckCircle2, ChevronLeft } from "lucide-react";
import API from "../../../config/api";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  // 🔁 Countdown timer for resend
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const clearMessages = () => {
    setMessage("");
    setError("");
  };

  // STEP 1 — SEND OTP
  const sendOtp = async () => {
    if (!email) return setError("Please enter your email");
    setIsLoading(true);
    clearMessages();
    try {
      await API.post(
        "/api/user/auth/forgot-password/send-otp",
        { email }
      );
      setMessage("OTP sent to your email address");
      setStep(2);
      setTimer(30);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔁 RESEND OTP
  const resendOtp = async () => {
    if (timer > 0) return;
    await sendOtp();
  };

  // STEP 2 — VERIFY OTP
  const verifyOtp = async () => {
    if (!otp) return setError("Please enter the OTP");
    setIsLoading(true);
    clearMessages();
    try {
      await API.post(
        "/api/user/auth/forgot-password/verify-otp",
        { email, otp }
      );
      setMessage("OTP verified successfully");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please check and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 3 — RESET PASSWORD
  const resetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    clearMessages();
    try {
      await API.post(
        "/api/user/auth/forgot-password/reset",
        { email, newPassword }
      );
      setStep(4);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Error resetting password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FDFBF9] font-sans p-4 relative overflow-hidden">
      
      {/* Decorative background elements matching login */}
      <div className="absolute top-[10%] left-[15%] animate-bounce" style={{ animationDuration: "5s" }}>
        <Stars className="text-[#FFECC7] w-12 h-12" />
      </div>
      <div className="absolute bottom-[15%] right-[10%] animate-pulse">
        <Moon className="text-[#E0E7FF] w-16 h-16 fill-current" />
      </div>
      <div className="absolute top-[20%] right-[20%]">
        <Sun className="text-[#FFEDD5] w-8 h-8" />
      </div>

      <div className="w-full max-w-[480px] relative">
        <div className="bg-white rounded-[3.5rem] shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] p-10 border border-white/50">
          
          <header className="mb-10 flex flex-col items-start">
            <button 
              onClick={() => step > 1 && step < 4 ? setStep(step - 1) : navigate("/login")}
              className="mb-6 flex items-center text-slate-400 hover:text-[#8B5CF6] transition-colors text-sm font-bold uppercase tracking-widest"
            >
              <ChevronLeft size={16} className="mr-1" />
              Back
            </button>
            <h1 className="text-4xl font-bold text-[#1E293B]">
              {step === 4 ? "Success" : "Reset"} <span className="text-[#8B5CF6]">Password.</span>
            </h1>
            <p className="text-slate-400 mt-2 text-sm font-medium">
              {step === 1 && "Enter your email to receive a verification code."}
              {step === 2 && "We've sent a 6-digit code to your email."}
              {step === 3 && "Create a new strong password for your account."}
              {step === 4 && "Your password has been updated successfully."}
            </p>
          </header>

          <div className="space-y-6">
            {/* STEP 1: Email Input */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="relative group">
                  <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-widest ml-1 mb-2 block">Your Email</label>
                  <div className="flex items-center bg-[#F8FAFC] border-2 border-transparent focus-within:border-[#C4B5FD] focus-within:bg-white rounded-2xl transition-all duration-300">
                    <div className="pl-5 text-[#94A3B8]">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      className="w-full bg-transparent p-4 outline-none text-[#1E293B] font-medium placeholder:text-[#CBD5E1]"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  onClick={sendOtp}
                  disabled={isLoading}
                  className="w-full h-16 bg-[#1E293B] hover:bg-[#0F172A] text-white rounded-3xl font-bold flex items-center justify-between px-8 transition-all duration-300 group shadow-lg shadow-slate-200 active:scale-95 disabled:opacity-50"
                >
                  <span className="text-lg">{isLoading ? "Sending..." : "Send OTP"}</span>
                  <div className="bg-white/10 p-2 rounded-xl group-hover:translate-x-1 transition-transform">
                    <ArrowRight size={20} />
                  </div>
                </button>
              </div>
            )}

            {/* STEP 2: OTP Verification */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="relative group">
                  <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-widest ml-1 mb-2 block">Verification Code</label>
                  <div className="flex items-center bg-[#F8FAFC] border-2 border-transparent focus-within:border-[#C4B5FD] focus-within:bg-white rounded-2xl transition-all duration-300">
                    <div className="pl-5 text-[#94A3B8]">
                      <KeyRound size={18} />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter 6-digit code"
                      className="w-full bg-transparent p-4 outline-none text-[#1E293B] font-medium tracking-[0.5em] placeholder:tracking-normal placeholder:text-[#CBD5E1]"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  onClick={verifyOtp}
                  disabled={isLoading}
                  className="w-full h-16 bg-[#1E293B] hover:bg-[#0F172A] text-white rounded-3xl font-bold flex items-center justify-between px-8 transition-all duration-300 group shadow-lg shadow-slate-200 active:scale-95 disabled:opacity-50"
                >
                  <span className="text-lg">{isLoading ? "Verifying..." : "Verify OTP"}</span>
                  <div className="bg-white/10 p-2 rounded-xl group-hover:translate-x-1 transition-transform">
                    <ArrowRight size={20} />
                  </div>
                </button>
                <div className="text-center">
                  <button
                    onClick={resendOtp}
                    disabled={timer > 0 || isLoading}
                    className={`text-sm font-bold transition-all ${timer > 0 ? 'text-slate-300' : 'text-[#8B5CF6] hover:text-[#7C3AED]'}`}
                  >
                    {timer > 0 ? `Resend code in ${timer}s` : "Didn't receive code? Resend"}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: New Password */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="relative group">
                  <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-widest ml-1 mb-2 block">New Password</label>
                  <div className="flex items-center bg-[#F8FAFC] border-2 border-transparent focus-within:border-[#C4B5FD] focus-within:bg-white rounded-2xl transition-all duration-300">
                    <div className="pl-5 text-[#94A3B8]">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-transparent p-4 outline-none text-[#1E293B] font-medium placeholder:text-[#CBD5E1]"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="relative group">
                  <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-widest ml-1 mb-2 block">Confirm Password</label>
                  <div className="flex items-center bg-[#F8FAFC] border-2 border-transparent focus-within:border-[#C4B5FD] focus-within:bg-white rounded-2xl transition-all duration-300">
                    <div className="pl-5 text-[#94A3B8]">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-transparent p-4 outline-none text-[#1E293B] font-medium placeholder:text-[#CBD5E1]"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  onClick={resetPassword}
                  disabled={isLoading}
                  className="w-full h-16 bg-[#1E293B] hover:bg-[#0F172A] text-white rounded-3xl font-bold flex items-center justify-between px-8 transition-all duration-300 group shadow-lg shadow-slate-200 active:scale-95 disabled:opacity-50"
                >
                  <span className="text-lg">{isLoading ? "Updating..." : "Set New Password"}</span>
                  <div className="bg-white/10 p-2 rounded-xl group-hover:translate-x-1 transition-transform">
                    <ArrowRight size={20} />
                  </div>
                </button>
              </div>
            )}

            {/* STEP 4: Success Message */}
            {step === 4 && (
              <div className="text-center py-4">
                <div className="bg-emerald-50 text-emerald-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Password Updated!</h3>
                <p className="text-slate-400 text-sm mb-8">Your account security is now restored. We're redirecting you to the login page.</p>
                <div className="flex justify-center">
                  <div className="w-8 h-8 border-4 border-[#8B5CF6]/20 border-t-[#8B5CF6] rounded-full animate-spin"></div>
                </div>
              </div>
            )}

            {/* Alerts & Messages */}
            {(error || message) && step < 4 && (
              <div className={`mt-6 p-4 rounded-2xl text-sm font-medium transition-all duration-300 ${error ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${error ? 'bg-red-400' : 'bg-emerald-400'}`}></div>
                  {error || message}
                </div>
              </div>
            )}
          </div>

          {step < 4 && (
            <footer className="mt-10 pt-6 border-t border-slate-50 text-center">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                Remember your password?{" "}
                <button onClick={() => navigate("/login")} className="text-[#8B5CF6] hover:text-[#7C3AED] transition-colors">
                  Back to Sign In
                </button>
              </p>
            </footer>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
