import React from 'react'
import axios from 'axios';
import { useState, useEffect } from 'react';
import GoogleLogin from './GoogleLogin';
import { useNavigate } from 'react-router-dom';


function UserRegistration({onClose,openLogin}) {

  
 const navigate=useNavigate()

  const [Error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  const [userEmail,setuserEmail]=useState("")
  const [userPassword,setuserPassword]=useState("")
  const [userName,setuserName] =useState("")
  const [userPhoneno ,setuserPhoneno]=useState("")


  const [loginModal,setloginModal]=useState(false)

  useEffect(() => {
  document.body.style.overflow = "hidden";
  return()=>{
    document.body.style.overflow = "auto";
  }
  },[])


  const handlesendotp= async ()=>{
     if(!userEmail){
      setError("Please enter email")
      return
     }
     try{
      setLoading(true)
      setError("")
      await axios.post("http://localhost:3001/api/user/auth/send-otp",{email:userEmail,})
      setOtpSent(true)

     }catch(error){
       setError(error.response?.data?.message || "Failed to send OTP");
     }
    finally{
      setLoading(false)
     }
  }



  const  handleVerifyOtp=async (req,res)=>{
      if (!otp) {
    setError("Enter OTP");
    return;
  }

  try {
    setLoading(true);
    setError("")
    await axios.post("http://localhost:3001/api/user/auth/verify-otp", {
      email: userEmail,
      otp:otp.trim()
    });

    setEmailVerified(true);
    setOtpSent(false);
  } catch (err) {
    setError("Invalid OTP");
  } finally {
    setLoading(false);
  }
  }




  const hsndleuserRegistration= async ()=>{
     if (!emailVerified) {
    toast.error("Please verify your email first");
    return;
  }

    try{
    const userdata={
      "email":userEmail,
      "password":userPassword,
      "name":userName,
      "phoneno":userPhoneno
    }
    await axios.post("http://localhost:3001/api/user/auth/register",userdata)
    alert("Registration successful! Please login.");
    setuserEmail("")
    setuserPassword("")
    navigate("/login")
  
}catch(error){}
  }


  return (


<>
    
      <div onClick={onClose} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
         <div onClick={(e)=> e.stopPropagation()} className="relative w-[470px]  bg-[#F4F4F4] rounded-2xl p-6 shadow-2xl">
             <h1 className="text-center text-3xl font-semibold tracking-widest mb-5">Sign Up</h1>

             <div className="relative mb-5 px-3">
               <input onChange={(e)=>setuserEmail(e.target.value) } value={userEmail} type="email"placeholder="Enter your Email"className="w-full bg-[#E2E2E2] text-gray-700 placeholder-gray-500 rounded-md px-5 py-3 outline-none"/>
               <span onClick={(e)=>{handlesendotp()}}  className="absolute right-5 top-1/2 -translate-y-1/2 text-indigo-400 text-sm cursor-pointer"> {emailVerified ? "Verified ✅" : "Verify"}</span>
             </div>

             <div className="mb-5 px-3">
              <input onChange={(e)=> setuserPassword(e.target.value)} value={userPassword} type="password" placeholder="Enter your Password" className="w-full bg-[#E2E2E2] text-gray-700 placeholder-gray-500 rounded-md px-5 py-3 outline-none" />
             </div>

             <div className="mb-5 px-3">
              <input onChange={(e)=> setuserName(e.target.value)} value={userName} type="text"  placeholder="Enter Name"  className="w-full bg-[#E2E2E2] text-gray-700 placeholder-gray-500 rounded-md px-5 py-3 outline-none" />
             </div>

             <div className="mb-8 px-3">
               <input onChange={(e)=>setuserPhoneno(e.target.value)} value={userPhoneno} type="tel" placeholder="Enter Mobile Number" className="w-full bg-[#E2E2E2] text-gray-700 placeholder-gray-500 rounded-md px-5 py-3 outline-none"/>
             </div>

             <button disabled={!emailVerified}  onClick={()=>hsndleuserRegistration()} className="mx-auto block bg-[#CFCBC6] text-black px-10 py-3 rounded-md mb-3">  Register</button>

             <div className="flex items-center gap-4 mb-3">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-gray-400 text-sm">or</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

             {/* <button   
              className="w-full bg-[#EEEEEE] py-3 rounded-lg flex items-center justify-center gap-3 mb-3"> */}
                <GoogleLogin/>
             {/* <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="google" className="w-5 h-5"/>
             <span  className="text-gray-700">Log in with Google</span> */}
             {/* </button> */}
             <p className="text-center text-sm tracking-widest text-gray-600">  Already have an account?
             <span onClick={(e)=>{e.stopPropagation();
    openLogin()} } className="text-blue-500 cursor-pointer ml-1">Sign in</span></p>
             </div>
           </div>
         

  {otpSent && !emailVerified && (
  <div className="fixed inset-0 bg-black/70 z-60 flex items-center justify-center">
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-[380px] bg-white rounded-xl p-6 shadow-2xl"
    >
      <h2 className="text-xl font-semibold text-center mb-4">
        Verify OTP
      </h2>

      <input
        type="text"
        placeholder="Enter 6 digit OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="w-full bg-[#E2E2E2] rounded-md px-4 py-3 outline-none mb-4"
      />

      {Error && (
        <p className="text-red-500 text-sm mb-3 text-center">
          {Error}
        </p>
      )}

      <button
        onClick={handleVerifyOtp}
        disabled={loading}
        className="w-full bg-indigo-500 text-white py-3 rounded-md"
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>

      <button
        onClick={() => setOtpSent(false)}
        className="w-full mt-3 text-sm text-gray-500"
      >
        Cancel
      </button>
    </div>
  </div>
)}





</>
  )
}

export default UserRegistration