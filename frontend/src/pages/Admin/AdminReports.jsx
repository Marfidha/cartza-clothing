import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../../../config/api";

function AdminReports() {
  const navigate=useNavigate()
const [feedback, setFeedback] = useState([]);
const [selectedFeedback, setSelectedFeedback] = useState(null);
const [showModal, setShowModal] = useState(false);
  // ✅ SAFE INITIAL STATE
  const [report, setReport] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    avgOrderValue: 0,
    topProducts: [],
    statusCounts: []
  });

  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    fetchReport();
    fetchFeedback();  
  }, []);

  const fetchReport = async () => {
    try {
      const res = await API.get(
        "/api/admin/report"
      );

      // ✅ Merge with defaults (extra safe)
      setReport(prev => ({ ...prev, ...res.data }));

    } catch (err) {
      console.error("Report fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedback = async () => {
  try {
    const res = await API.get(
      "/api/admin/feedback"
    );
setFeedback(res.data.data);  } catch (err) {
    console.error("Feedback fetch error:", err);
  }
};

const openDetails = (feedbackItem) => {
  setSelectedFeedback(feedbackItem);
  setShowModal(true);
};
const markResolved = async () => {
  try {
    await API.patch(
      `/api/admin/feedback/${selectedFeedback._id}/resolve`
    );

    fetchFeedback();   // refresh list
    setShowModal(false);

  } catch (err) {
    console.error("Resolve error:", err);
  }
};

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold text-gray-700">
        Reports Dashboard
      </h1>

      {/* ===== KPI CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <Stat title="Total Revenue" value={`₹${report.totalRevenue}`} />
        <Stat title="Total Orders" value={report.totalOrders} />
        <Stat title="Customers" value={report.totalCustomers} />
        <Stat
          title="Avg Order Value"
          value={`₹${Math.round(report.avgOrderValue)}`}
        />

      </div>     

   {/* ===== CUSTOMER FEEDBACK ===== */}
<div className="bg-white p-6 rounded-xl shadow">
  <h2 className="font-semibold mb-4">
    Customer Feedback
  </h2>

  {feedback.length > 0 ? (
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-gray-100 text-gray-600">
          <th className="text-left p-3">User</th>
          <th className="text-left p-3">Product</th>
          <th className="text-left p-3">Details</th>
          <th className="text-left p-3">Status</th>
          <th className="text-left p-3">Actions</th>
        </tr>
      </thead>

      <tbody>
        {feedback.map((f) => (
          <tr key={f._id} className="border-b hover:bg-gray-50">

            {/* USER */}
            <td className="p-3">
              <div className="font-medium">
                {f.user?.name || "User"}
              </div>
              <div className="text-gray-400 text-xs">
                {f.user?.email}
              </div>
            </td>

            {/* PRODUCT */}
            <td className="p-3">
              <div className="font-semibold uppercase text-sm">
                {f.product?.productName}
              </div>
              <div className="text-gray-400 text-xs capitalize">
                {f.type}
              </div>
            </td>

            {/* DETAILS */}
            <td className="p-3">
              <div className="text-yellow-500">
                {"★".repeat(f.rating || 0)}
                {"☆".repeat(5 - (f.rating || 0))}
              </div>
              <div className="text-gray-500 text-xs">
                {f.message}
              </div>
            </td>

            {/* STATUS */}
            <td className="p-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  f.status === "pending"
                    ? "bg-orange-100 text-orange-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {f.status}
              </span>
            </td>

            {/* ACTIONS */}
            <td className="p-3 flex gap-2">
              <button  onClick={() => openDetails(f)} className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200">
                👁
              </button>

            </td>

          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p className="text-gray-500">No feedback available</p>
  )}
</div>

      {/* ===== TOP PRODUCTS ===== */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-4">
          Top Selling Products
        </h2>

        {report.topProducts.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-2">Product ID</th>
                <th className="text-left p-2">Units Sold</th>
              </tr>
            </thead>

            <tbody>
              {report.topProducts.map((p) => (
                <tr key={p._id} className="border-b">
                  <td className="p-2">{p._id}</td>
                  <td className="p-2">{p.totalSold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No product sales data</p>
        )}
      </div>

      {/* ===== ACTION BUTTONS ===== */}
      <div className="flex gap-4">
        <button
          onClick={() =>  navigate("/dashboard/reports/sales-report")}
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
        >
          Sales Report
        </button>

      </div>
      {showModal && selectedFeedback && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

    <div className="bg-white rounded-xl p-6 w-[420px] shadow-xl">

      <h2 className="text-lg font-semibold mb-4">
        Feedback Details
      </h2>

      <div className="space-y-2 text-sm">

        <p>
          <b>User:</b> {selectedFeedback.user?.name}
        </p>

        <p>
          <b>Product:</b>{" "}
          {selectedFeedback.product?.productName}
        </p>

        <p>
          <b>Type:</b> {selectedFeedback.type}
        </p>

        <p>
          <b>Rating:</b> {selectedFeedback.rating}
        </p>

        <p>
          <b>Status:</b> {selectedFeedback.status}
        </p>

        <div>
          <b>Message:</b>
          <textarea
            readOnly
            value={selectedFeedback.message}
            className="w-full mt-1 border rounded p-2 text-sm"
          />
        </div>

      </div>

      {/* ACTION BUTTONS */}
      <div className="flex justify-end gap-3 mt-5">

        {selectedFeedback.status === "pending" && (
          <button
            onClick={markResolved}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Mark Resolved
          </button>
        )}

        <button
          onClick={() => setShowModal(false)}
          className="border px-4 py-2 rounded hover:bg-gray-100"
        >
          Close
        </button>

      </div>

    </div>
  </div>
)}

    </div>
  );
}

const Stat = ({ title, value }) => (
  <div className="bg-white p-5 rounded-xl shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-bold mt-2">{value}</p>
  </div>
);

export default AdminReports;