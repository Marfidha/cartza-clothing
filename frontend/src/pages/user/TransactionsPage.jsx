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

      const res = await axios.get(
        "http://localhost:3001/api/user/auth/usertransactions",
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

          {/* <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm active:scale-95 w-fit">
            <Download size={16} />
            Export Data
          </button> */}
        </header>

        {/* Summary Cards Grid (UNCHANGED UI) */}
        {/* <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[
            { label: "Total Spent", value: "₹42,850.00", icon: <ArrowUpRight size={20} />, color: "text-slate-900" },
            { label: "Pending Refunds", value: "₹1,200.00", icon: <RefreshCcw size={20} />, color: "text-blue-500" },
            { label: "Wallet Balance", value: "₹8,420.50", icon: <Wallet size={20} />, color: "text-emerald-500" },
          ].map((card, idx) => (
            <div key={idx} className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-slate-100 transition-colors">
                  {card.icon}
                </div>
                <MoreHorizontal size={20} className="text-slate-300 cursor-pointer" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em] mb-1">
                {card.label}
              </p>
              <h3 className={`text-2xl sm:text-3xl font-bold tracking-tight ${card.color}`}>
                {card.value}
              </h3>
            </div>
          ))}
        </section> */}

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

            {/* Date Selector */}
            {/* <button 
            className="flex items-center gap-3 px-5 py-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-sm font-semibold text-slate-700 transition-all w-full lg:w-fit justify-center">
              <Calendar size={18} className="text-slate-400"
              
               />
              Last 30 Days
            </button> */}
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

                    // const image =
                    //   "https://cdn-icons-png.flaticon.com/512/891/891462.png";

                    return (
                      <tr key={id} className="group hover:bg-slate-50/50 transition-colors cursor-pointer">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            {/* <img src={image} alt="" className="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-sm" /> */}
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

// import { ArrowLeftRight } from "lucide-react";
// import { useEffect, useState } from "react";
// import axios from "axios";

// const TransactionsPage = () => {

//   const [transactions, setTransactions] = useState([]);

//   useEffect(() => {
//     fetchTransactions();
//   }, []);

//   const fetchTransactions = async () => {
//     try {
//       const token = localStorage.getItem("token");
// console.log(token);

//       const res = await axios.get(  "http://localhost:3001/api/user/auth/usertransactions",  {    headers: {      Authorization: `Bearer ${token}`,  }, });
//         console.log(res);
        
//       setTransactions(res.data);

//     } catch (error) {
//       console.error("Failed to fetch transactions", error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#f3f3f3] p-6">

//       {/* HEADER */}
//       <div className="bg-white rounded-xl shadow p-6 mb-6 flex items-center gap-3">
//         <ArrowLeftRight />
//         <h1 className="text-xl font-semibold">
//           Transaction History
//         </h1>
//       </div>

//       {/* LIST */}
//       <div className="bg-white rounded-xl shadow p-6 space-y-4">

//         {transactions.length === 0 ? (

//           <div className="text-center py-16">
//             <ArrowLeftRight
//               size={48}
//               className="mx-auto text-gray-400 mb-4"
//             />
//             <p className="text-gray-600">
//               No transactions yet
//             </p>
//           </div>

//         ) : (

//           transactions.map((txn) => {

//             // Convert backend → UI format

//             const typeText =
//               txn.category === "order_payment"
//                 ? "Order Payment"
//                 : txn.category === "wallet_topup"
//                 ? "Wallet Top-up"
//                 : txn.category === "refund"
//                 ? "Refund"
//                 : txn.category;

//             const statusText =
//               txn.status === "success"
//                 ? "Success"
//                 : txn.status === "pending"
//                 ? "Processing"
//                 : "Failed";

//             const methodText =
//               txn.paymentMethod === "upi"
//                 ? "UPI"
//                 : txn.paymentMethod === "wallet"
//                 ? "Wallet"
//                 : txn.paymentMethod === "card"
//                 ? "Card"
//                 : txn.paymentMethod;

//             const dateText = new Date(
//               txn.createdAt
//             ).toLocaleDateString("en-IN", {
//               day: "2-digit",
//               month: "short",
//               year: "numeric",
//             });

//             return (
//               <div
//                 key={txn._id}
//                 className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50"
//               >

//                 {/* LEFT */}
//                 <div>
//                   <p className="font-medium">{typeText}</p>

//                   <p className="text-xs text-gray-500">
//                     ID: {txn.referenceId || txn._id}
//                   </p>

//                   <p className="text-xs text-gray-500">
//                     {dateText} • {methodText}
//                   </p>
//                 </div>

//                 {/* RIGHT */}
//                 <div className="text-right">
//                   <p className="font-semibold">
//                     {txn.type === "credit" ? "+" : "-"}₹{txn.amount}
//                   </p>

//                   <p
//                     className={`text-xs ${
//                       statusText === "Success"
//                         ? "text-green-600"
//                         : statusText === "Processing"
//                         ? "text-yellow-600"
//                         : "text-red-600"
//                     }`}
//                   >
//                     {statusText}
//                   </p>
//                 </div>

//               </div>
//             );
//           })

//         )}

//       </div>

//     </div>
//   );
// };

// export default TransactionsPage;