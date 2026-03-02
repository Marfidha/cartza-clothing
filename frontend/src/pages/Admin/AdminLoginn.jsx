import React, { useState } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom'

function AdminLoginn() {
      const navigate=useNavigate()
    const [email ,setemail]=useState("")
    const [password ,setpassword]=useState("")
  
 
const handlesubmit =async()=>{

    const response= await axios.post("http://localhost:3001/api/admin/auth/login",{email,password} )
    if (response.data.success) {
    localStorage.setItem("token", response.data.token);
    navigate("/dashboard");
  } else {
    alert(response.data.message);
  }


//     .then((response) => {
//     if (response.data.message === "done") {
//       navigate("/Dashboard");
//     }
//   })
//   .catch((err) => {
//     console.log(err);
//   });
     setemail("")
    setpassword("")
    
    
}

  return (
    <>

      <div className="w-full h-screen flex">


      {/* RIGHT SIDE – LOGIN */}
      <div className="w-full md:full h-full flex justify-center items-center bg-[#F9F7F6]">
        <div className="w-[85%] sm:w-[70%] lg:w-[30%] bg-white rounded-2xl shadow-xl p-10">

          <h2 className="text-3xl font-semibold text-gray-800 mb-2">
            Admin Login
          </h2>
          <p className="text-gray-500 mb-8">
            Enter your credentials to access the dashboard
          </p>

          {/* Email */}
          <input
            value={email}
            onChange={(e) => setemail(e.target.value)}
            type="email"
            placeholder="Admin Email"
            className="w-full mb-5 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4E3528]"
          />

          {/* Password */}
          <input
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full mb-6 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4E3528]"
          />

          {/* Button */}
          <button
            onClick={handlesubmit}
            className="w-full py-3 bg-[#4E3528] text-white rounded-lg font-medium hover:bg-[#3b281e] transition duration-300"
          >
            Login to Admin
          </button>

          {/* Footer text */}
          <p className="text-center text-sm text-gray-400 mt-6">
            © 2026 Cartza Admin
          </p>
        </div>
      </div>

    </div>
  

    {/* <div  className='w-full h-screen flex justify-end items-center bg-black'>
    <div className='w-[50%] h-[90%] flex justify-center items-center  bg-white  '>
        <div className='w-[60%] h-[50%]   border-2 rounded-2xl'>
            <div className='w-full h-[50%] flex flex-col justify-center items-center gap-6 pt-5 '>
                <input value={email} onChange={(e)=>setemail(e.target.value)} type="text" placeholder='enter user name' className='w-[75%] h-[30%] border border-black  placeholder-black rounded-sm'/>
                <input value={password} onChange={(e)=>setpassword(e.target.value)} type="text" placeholder='enter password'  className='w-[75%] h-[30%] border border-black placeholder-black rounded-sm' />
            </div>
            <div className='w-full h-[50%] flex flex-col justify-center items-center gap-3.5'>
                <button onClick={handlesubmit} className='border w-[60%] h-[30%] bg-black text-white rounded-md  '>Login</button>
            </div>
        </div>
    </div>
    </div> */}
    </>
  )
}

export default AdminLoginn