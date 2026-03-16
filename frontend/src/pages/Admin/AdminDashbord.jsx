import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../../../config/api";


function AdminDashboard() {

   const navigate = useNavigate();

   const [stats, setStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    totalCustomers: 0,
    pendingOrders: 0,
  });
const [recentOrders, setRecentOrders] = useState([]);
const fetchDashboard = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await API.get(
      "/api/admin/dashboard",
      {
        headers: { "x-auth-token": token },
      }
    );

    setStats({
      totalOrders: res.data.totalOrders,
      totalSales: res.data.totalSales,
      totalCustomers: res.data.totalCustomers,
      pendingOrders: res.data.pendingOrders,
    });

    setRecentOrders(res.data.recentOrders);
  } catch (err) {
    console.error(err);
  }
};

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      try {
        const response = await API.get(
          "/api/admin/auth/check",
          {
            headers: {
              "x-auth-token": token,
            }
          }
        );

        if (!response.data.success) {
          navigate("/");
        }
      } catch (error) {
        navigate("/");
      }
    };

    checkToken();
    fetchDashboard();
  }, []);



  return (
    <>
    {/* <div></div> */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-700">
        Dashboard
      </h1>
           
      
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
      <Card title="Total Orders" value={stats.totalOrders} />
      <Card title="Total Sales" value={`₹${stats.totalSales}`} />
      <Card title="Total Customers" value={stats.totalCustomers} />
      <Card title="Pending Orders" value={stats.pendingOrders} />
            </div>

       <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Recent Orders</h2>


  {/* Make table scrollable in small screens */}
  <div className="overflow-x-auto">
    <table className="w-full min-w-[600px] border border-gray-200 rounded-lg">
      <thead>
        <tr className="bg-gray-100 text-gray-600 text-sm md:text-base">
          <th className="py-3 px-4 border-b text-left">Order ID</th>
          <th className="py-3 px-4 border-b text-left">Customer</th>
          <th className="py-3 px-4 border-b text-left">Date</th>
          <th className="py-3 px-4 border-b text-left">Amount</th>
          <th className="py-3 px-4 border-b text-left">Status</th>
          <th className="py-3 px-4 border-b text-center">Action</th>
        </tr>
      </thead>

      <tbody className="text-sm md:text-base">
       {recentOrders.map((order) => (
  <tr key={order._id} className="hover:bg-gray-50 transition border-b">
    <td className="py-3 px-4">{order._id.slice(-6)}</td>

    <td className="py-3 px-4">
      {order.user?.name || "Unknown"}
    </td>

    <td className="py-3 px-4">
      {new Date(order.createdAt).toLocaleDateString()}
    </td>

    <td className="py-3 px-4 font-medium">
      ₹{order.totalAmount}
    </td>

    <td className="py-2 px-4">
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          order.orderStatus === "delivered"
            ? "bg-green-100 text-green-700"
            : order.orderStatus === "processing"
            ? "bg-yellow-100 text-yellow-700"
            : order.orderStatus === "cancelled"
            ? "bg-red-100 text-red-700"
            : "bg-blue-100 text-blue-700"
        }`}
      >
        {order.orderStatus}
      </span>
    </td>

    <td className="py-3 px-4 text-center">
      <button
        onClick={() => navigate("/dashboard/orders")}
        className="bg-blue-500 text-white px-4 py-1 rounded-md text-xs hover:bg-blue-600 transition"
      >
        View
      </button>
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

export default AdminDashboard;
