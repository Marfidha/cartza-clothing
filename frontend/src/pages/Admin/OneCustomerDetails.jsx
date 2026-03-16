import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../config/api";

function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    fetchCustomer();
  }, []);

  const fetchCustomer = async () => {
    try {
      const res = await API.get(
        `/api/admin/customers/${id}`
      );
      setCustomer(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!customer) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 border rounded-md"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-semibold text-gray-700 mb-6">
        Customer Details
      </h1>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <p><strong>Name:</strong> {customer.name}</p>
        <p><strong>Email:</strong> {customer.email}</p>
        <p>
          <strong>Status:</strong>{" "}
          {customer.isEmailVerified ? "Active" : "Inactive"}
        </p>
        <p><strong>User ID:</strong> {customer._id}</p>
      </div>

      {/* Addresses */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">Addresses</h2>

        {customer.addresses?.length ? (
          customer.addresses.map((addr, i) => (
            <div key={i} className="border p-3 rounded mb-2">
              <p>{addr.street}</p>
              <p>{addr.city}, {addr.state}</p>
              <p>{addr.pincode}</p>
            </div>
          ))
        ) : (
          <p>No addresses</p>
        )}
      </div>

      {/* Orders */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-3">Orders</h2>

        {customer.orders?.length ? (
          customer.orders.map((order) => (
            <div
              key={order._id}
              className="border p-3 rounded mb-2 flex justify-between"
            >
              <span>Order #{order._id.slice(-6)}</span>
              <span>₹{order.totalAmount}</span>
            </div>
          ))
        ) : (
          <p>No orders</p>
        )}
      </div>
    </div>
  );
}

export default CustomerDetails;