import axios from 'axios';
import React, { useEffect, useState } from 'react'
import {  useNavigate } from 'react-router-dom';
import API from '../../../config/api';

function AdminCustomers() {
  const navigate = useNavigate()

  const [customers,setcustomers]=useState([])
  useEffect(()=>{
    users()
  },[])
  const users=async ()=>{
    try{
   const res=await API.get("/api/admin/customers")
    console.log(res.data);
    setcustomers(res.data)
    }catch(error){

    }

  }
  const activeCustomers = customers.filter(
  (u) => u.isEmailVerified
).length;

const inactiveCustomers = customers.length - activeCustomers;

const totalSpend = customers.reduce(
  (sum, u) => sum + (u.totalSpent || 0),
  0
);

const avgSpend =
  customers.length > 0
    ? Math.round(totalSpend / customers.length)
    : 0;
  return (


    

     <>
    {/* <div></div> */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-700">
        Dashboard
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
        <Card title="Total Customers" value={customers.length} />
        <Card title="Active Customers" value={activeCustomers} />
        <Card title="Inactive Customers" value={inactiveCustomers}/>
        <Card title="Average Spend per Customer" value={`₹${avgSpend}`} />
      </div>

       <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Customers</h2>


  {/* Make table scrollable in small screens */}
  <div className="overflow-x-auto">
    <table className="w-full min-w-[600px] border border-gray-200 rounded-lg">
      <thead>
        <tr className="bg-gray-100 text-gray-600 text-sm md:text-base">
          <th className="py-3 px-4 border-b text-left">User ID</th>
          <th className="py-3 px-4 border-b text-left">Name</th>
          <th className="py-3 px-4 border-b text-left">Email</th>
          <th className="py-3 px-4 border-b text-left">Account Status</th>
          <th className="py-3 px-4 border-b text-left">Total Orders</th>
          {/* <th className="py-3 px-4 border-b text-center">Action</th> */}
        </tr>
      </thead>

      <tbody className="text-sm md:text-base">
       {customers.map((user, index) => (
                <tr
                  onClick={() => navigate(user._id)}
                  key={user._id}
                  className="hover:bg-gray-50 transition border-b"
                >
                  <td className="py-3 px-4">{user._id.slice(-6)}</td>

                  <td className="py-3 px-4">{user.name}</td>

                  <td className="py-3 px-4">{user.email}</td>

                  <td className="py-3 px-4 font-medium">
                    {user.isEmailVerified ? "Active" : "Inactive"}
                  </td>

                  <td className="py-2 px-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {user.orderCount} Orders
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </>
  );
}

const Card = ({ title, value }) => (
  <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center text-center w-full transition transform hover:scale-105 hover:shadow-lg">
    <p className="text-gray-500 text-sm sm:text-md">{title}</p>
    <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mt-2">{value}</h2>
  </div>
);

   
 
export default AdminCustomers