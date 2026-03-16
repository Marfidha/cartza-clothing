import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../config/api";

function AdminOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    const res = await API.get(
      `/api/admin/orders/${id}`
    );
    setOrder(res.data);
  };

  if (!order) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-6">

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 border rounded-md"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-semibold text-gray-700">
        Order #{order._id.slice(-6)}
      </h1>

      {/* ORDER SUMMARY */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-3">Order Summary</h2>

        <p><strong>Status:</strong> {order.orderStatus}</p>
        <p><strong>Payment:</strong> {order.paymentMethod}</p>
        <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
        <p>
          <strong>Date:</strong>{" "}
          {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>

      {/* CUSTOMER */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-3">Customer</h2>

        <p><strong>Name:</strong> {order.user?.name}</p>
        <p><strong>Email:</strong> {order.user?.email}</p>
      </div>

      {/* SHIPPING ADDRESS */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-3">
          Shipping Address
        </h2>

        <p>{order.shippingAddress.name}</p>
        <p>{order.shippingAddress.phone}</p>
        <p>{order.shippingAddress.addressLine}</p>
        <p>
          {order.shippingAddress.city},{" "}
          {order.shippingAddress.state}
        </p>
        <p>{order.shippingAddress.pincode}</p>
      </div>

      {/* ITEMS */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-3">Items</h2>

        {order.items.map((item) => (
          <div
            key={item._id}
            className="flex justify-between border-b py-3"
          >
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">
                Size: {item.size} | Qty: {item.quantity}
              </p>
            </div>

            <p className="font-semibold">
              ₹{item.price * item.quantity}
            </p>
          </div>
        ))}
      </div>

      {/* PRICE BREAKDOWN */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-3">Payment</h2>

        <div className="space-y-1">
          <p>Subtotal: ₹{order.subtotal}</p>
          <p>Tax: ₹{order.tax}</p>
          <p>Shipping: ₹{order.shipping}</p>

          {order.coupon && (
            <p>Discount: -₹{order.coupon.discount}</p>
          )}

          <hr />

          <p className="font-bold text-lg">
            Total: ₹{order.totalAmount}
          </p>
        </div>
      </div>

    </div>
  );
}

export default AdminOrderDetails;