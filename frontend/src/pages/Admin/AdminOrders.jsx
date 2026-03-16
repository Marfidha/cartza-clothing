
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../config/api";

function AdminOrders() {
  const navigate = useNavigate();
    const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await API.get(
      "/api/admin/orders"
    );
    setOrders(res.data);
  };
  
  // Status badge colors
  const getStatusStyle = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "shipped":
      case "out_for_delivery":
        return "bg-blue-100 text-blue-700";
      case "processing":
      case "confirmed":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
      case "returned":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <>
      {/* TITLE — same as customers page */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-700">
        Dashboard
      </h1>

      {/* CARDS — same style */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
        <Card title="Total Orders" value={orders.length} />

        <Card
          title="Delivered"
          value={orders.filter(o => o.orderStatus === "Delivered").length}
        />

        <Card
          title="Pending"
          value={orders.filter(o => o.orderStatus === "processing").length}
        />

        <Card
          title="Cancelled"
          value={orders.filter(o => o.orderStatus === "cancelled").length}
        />
      </div>

      {/* TABLE — EXACT SAME STYLE */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Orders
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border border-gray-200 rounded-lg">

            <thead>
              <tr className="bg-gray-100 text-gray-600 text-sm md:text-base">
                <th className="py-3 px-4 border-b text-left">Order ID</th>
                <th className="py-3 px-4 border-b text-left">Customer</th>
                <th className="py-3 px-4 border-b text-left">Amount</th>
                <th className="py-3 px-4 border-b text-left">Payment</th>
                <th className="py-3 px-4 border-b text-left">Status</th>
                <th className="py-3 px-4 border-b text-left">Date</th>
              </tr>
            </thead>

            <tbody className="text-sm md:text-base">
              {orders.map(order => (
                <tr
                  key={order._id}
                  onClick={() => navigate(order._id)}
                  className="hover:bg-gray-50 transition border-b"
                >
                  <td className="py-3 px-4">
                    {order._id.slice(-6)}
                  </td>

                  <td className="py-3 px-4">
                    {order.user?.name || "Unknown"}
                  </td>

                  <td className="py-3 px-4 font-medium">
                    ₹{order.totalAmount}
                  </td>

                  <td className="py-3 px-4 capitalize">
                    {order.paymentMethod}
                  </td>

                  <td className="py-2 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus.replaceAll("_", " ")}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    {new Date(order.createdAt).toLocaleDateString()}
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
    <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mt-2">
      {value}
    </h2>
  </div>
);

export default AdminOrders