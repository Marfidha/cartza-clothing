import React, { useEffect } from "react";
import { ArrowLeft, Plus, History } from "lucide-react";
import { useState } from "react";
import { useDispatch ,useSelector} from "react-redux";
import { addMoney, fetchWallet,fetchWalletTransactions } from "../../Redux/Slices/WalletSlice";
import useAlert from "../../alerts/hooks/useAlert";



const WalletPage = () => {
  
  const dispatch = useDispatch();
   const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [showAll, setShowAll] = useState(false);

  const { showToast } = useAlert();

useEffect(()=>{
  dispatch(fetchWallet())
  dispatch(fetchWalletTransactions())
},[dispatch])
const balance = useSelector((state) => state.wallet?.balance ?? 0);

const transactions = useSelector( (state) => state.wallet?.transactions ?? []);
console.log(transactions);



  const handleRecharge = () => {
    if (!amount || amount <= 0) {
      showToast("Enter a valid amount", "error");
      return;
    }
    dispatch(addMoney(Number(amount)))
    showToast(`₹${amount} added to wallet`, "success");

    // console.log("Recharge amount:", amount);

    // Later:
    // call backend
    // open Razorpay
    // update wallet balance

    setShowModal(false);
  };
  const visibleTransactions = showAll
  ? transactions
  : transactions.slice(0, 4); // show first 4


  return (
    <div className="min-h-screen bg-[#f6f4f1] px-3 sm:px-4 md:px-8 lg:px-10 py-6 sm:py-8  sm:mt-9">
      <div className="max-w-5xl mx-auto w-full mt-9">
        
        {/* Header */}
        {/* <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-6">
          My Wallet
        </h1> */}

        {/* Balance Card */}
        <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-10 text-white bg-linear-to-r from-slate-900 to-white-60 shadow-lg">
          <p className="text-xs sm:text-sm opacity-80">
            Wallet Balance
          </p>

          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mt-2">
            ₹{balance}
          </h2>

          <button
            onClick={() => setShowModal(true)}
            className="mt-5 sm:mt-6 bg-white text-black px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-medium hover:scale-105 transition"
          >
            + Add Money
          </button>
        </div>

        {/* Transactions */}
        <div className="pt-6 sm:pt-8">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow p-4 sm:p-6">
            
            {/* Section Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base sm:text-lg font-semibold">
                Transaction History
              </h3>

              {transactions.length > 4 && (
                <span
                  onClick={() => setShowAll((prev) => !prev)}
                  className="text-sm text-gray-500 cursor-pointer"
                >
                  {showAll ? "Show Less" : "View All"}
                </span>
              )}
            </div>

            {/* List */}
            <div className="space-y-4">
              {transactions.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No transactions yet
                </p>
              ) : (
                visibleTransactions.map((tx, index) => (
                  <div
                    key={tx._id}
                    className={`flex justify-between items-start sm:items-center ${
                      index !== visibleTransactions.length - 1
                        ? "border-b pb-3"
                        : ""
                    }`}
                  >
                    <div>
                      <p className="font-medium text-sm sm:text-base">
                        {tx.reason || "Wallet Top-up"}
                      </p>

                      <p className="text-xs sm:text-sm text-gray-500">
                        {new Date(tx.createdAt).toLocaleDateString(
                          "en-IN",
                          { month: "short", day: "numeric" }
                        )}
                        ,{" "}
                        {tx.type === "credit"
                          ? "Credited"
                          : "Debited"}
                      </p>
                    </div>

                    <span
                      className={`font-semibold text-sm sm:text-base ${
                        tx.type === "credit"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {tx.type === "credit" ? "+" : "-"}₹{tx.amount}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Money Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-3">
          <div className="bg-white rounded-2xl p-5 sm:p-8 w-[92%] max-w-md shadow-lg">
            
            <h3 className="text-lg sm:text-xl font-semibold mb-4">
              Add Money to Wallet
            </h3>

            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border rounded-lg px-4 py-2.5 mb-6 focus:outline-none focus:ring-2 focus:ring-black/20"
            />

            <div className="flex gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleRecharge}
                className="flex-1 bg-black text-white py-2 rounded-lg"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default WalletPage;
