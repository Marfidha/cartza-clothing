import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  Filter,
  ChevronRight,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  Clock,
  RefreshCcw,
  CreditCard,
  Calendar,
  Download,
  MoreHorizontal,
} from "lucide-react";
import API from "../../../config/api";

const TransactionsPage = () => {

  const [sortBy, setSortBy] = useState("latest");
  const [dateRange, setDateRange] = useState("30");

  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [transactions, setTransactions] = useState([]);

  // 🔥 Fetch real transactions
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get(
        "/api/user/auth/usertransactions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTransactions(res.data);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    }
  };
  const filteredTransactions = transactions
  // 🔎 SEARCH
  .filter((txn) => {
    const id = txn.referenceId || txn._id;
    const category = txn.category || "";

    return (
      id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  })

  // 🏷️ STATUS FILTER
  .filter((txn) => {
    if (activeFilter === "All") return true;

    const statusMap = {
      success: "Successful",
      pending: "Pending",
      failed: "Failed",
    };

    return statusMap[txn.status] === activeFilter;
  })

  // 📅 DATE FILTER
  .filter((txn) => {
    if (dateRange === "all") return true;

    const days = parseInt(dateRange);
    const txnDate = new Date(txn.createdAt);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    return txnDate >= cutoff;
  })

  // 🔽 SORT
  .sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }

    if (sortBy === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }

    if (sortBy === "amount_high") {
      return b.amount - a.amount;
    }

    if (sortBy === "amount_low") {
      return a.amount - b.amount;
    }

    return 0;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case "Successful":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "Pending":
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "Refunded":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "Failed":
        return "bg-rose-50 text-rose-600 border-rose-100";
      default:
        return "bg-slate-50 text-slate-500 border-slate-100";
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-slate-100 mt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-10  sm:py-16">

        {/* Header Area */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-slate-900">
              Transactions
            </h1>
            <p className="text-slate-500 font-medium">
              Monitor your payments and order history.
            </p>
          </div>
        </header>

     

        {/* Filters & Controls (UNCHANGED UI) */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-8">
          <div className="p-4 sm:p-6 border-b border-slate-50 flex flex-col lg:flex-row gap-6 items-center justify-between">

            {/* Search */}
            <div className="relative w-full lg:max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search by Order ID, product..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 rounded-2xl text-sm font-medium outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Status Pills */}
            <div className="flex items-center gap-1 p-1 bg-slate-50 rounded-2xl overflow-x-auto w-full lg:w-fit">
              {["All", "Successful", "Pending", "Failed"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeFilter === filter
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

      
          </div>

          {/* Transactions List */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                  <th className="px-8 py-5">Order & Product</th>
                  <th className="px-6 py-5 hidden md:table-cell">Date & Time</th>
                  <th className="px-6 py-5 hidden lg:table-cell">Payment</th>
                  <th className="px-6 py-5 text-right">Amount</th>
                  <th className="px-8 py-5 text-right">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-16 text-slate-400">
                      No transactions yet
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((txn) => {

                    // 🔁 Backend → UI mapping
                    const productText =
                      txn.category === "order_payment"
                        ? "Order Payment"
                        : txn.category === "wallet_topup"
                        ? "Wallet Top-up"
                        : txn.category === "refund"
                        ? "Refund"
                        : txn.category;

                    const statusText =
                      txn.status === "success"
                        ? "Successful"
                        : txn.status === "pending"
                        ? "Pending"
                        : "Failed";

                    const methodText =
                      txn.paymentMethod === "upi"
                        ? "UPI"
                        : txn.paymentMethod === "wallet"
                        ? "Wallet"
                        : txn.paymentMethod === "card"
                        ? "Card"
                        : txn.paymentMethod;

                    const dateObj = new Date(txn.createdAt);

                    const date = dateObj.toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    });

                    const time = dateObj.toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    const amount =
                      txn.type === "credit"
                        ? `+₹${txn.amount}`
                        : `-₹${txn.amount}`;

                    const id = txn.referenceId || txn._id;

                  

                    return (
                      <tr key={id} className="group hover:bg-slate-50/50 transition-colors cursor-pointer">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="text-[10px] font-mono font-medium text-slate-400 mb-0.5">{id}</p>
                              <h4 className="text-sm font-bold text-slate-800">{productText}</h4>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-6 hidden md:table-cell">
                          <p className="text-sm font-semibold text-slate-700">{date}</p>
                          <p className="text-xs text-slate-400 font-medium">{time}</p>
                        </td>

                        <td className="px-6 py-6 hidden lg:table-cell">
                          <div className="flex items-center gap-2 text-slate-600">
                            <CreditCard size={14} className="text-slate-300" />
                            <span className="text-xs font-semibold">{methodText}</span>
                          </div>
                        </td>

                        <td className="px-6 py-6 text-right">
                          <span className="text-sm font-bold text-slate-900 tracking-tight">
                            {amount}
                          </span>
                        </td>

                        <td className="px-8 py-6 text-right">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(statusText)}`}>
                            {statusText}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TransactionsPage;
