import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminSalesReport() {
  const [report, setReport] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    dailySales: []
  });

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, []);

 const fetchReport = async () => {
  try {
    const params = {};

    if (from && to) {
      params.from = from;
      params.to = to;
    }

    const res = await axios.get(
      "http://localhost:3001/api/admin/sales-report",
      { params }
    );

    setReport(res.data);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">Sales Report</h1>

      {/* ===== KPI CARDS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <Stat title="Total Revenue" value={`₹${report.totalRevenue}`} />

        <Stat title="Total Orders" value={report.totalOrders} />

        <Stat
          title="Avg Order Value"
          value={`₹${Math.round(report.avgOrderValue)}`}
        />

      </div>

      {/* ===== DATE FILTER ===== */}
      <div className="flex gap-3 items-end">

        <div>
          <label className="text-sm text-gray-600">From</label>
          <input
            type="date"
            className="border p-2 rounded block"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">To</label>
          <input
            type="date"
            className="border p-2 rounded block"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>

        <button
          onClick={fetchReport}
          className="bg-black text-white px-5 py-2 rounded"
        >
          Apply Filter
        </button>

      </div>

      {/* ===== DETAILED SALES ===== */}
      <div className="bg-white p-6 rounded-xl shadow">

        <h2 className="font-semibold mb-4">
          Detailed Sales
        </h2>

        <table className="w-full text-sm">

          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Orders</th>
              <th className="text-left p-3">Total Sales</th>
            </tr>
          </thead>

          <tbody>
            {report.dailySales.map((d, i) => (
              <tr key={i} className="border-b">

                <td className="p-3">
                  {new Date(d.date).toLocaleDateString()}
                </td>

                <td className="p-3">{d.orders}</td>

                <td className="p-3 text-green-600 font-semibold">
                  ₹{d.totalSales}
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </div>
  );
}

const Stat = ({ title, value }) => (
  <div className="bg-white p-5 rounded-xl shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-bold mt-2">{value}</p>
  </div>
);

export default AdminSalesReport;