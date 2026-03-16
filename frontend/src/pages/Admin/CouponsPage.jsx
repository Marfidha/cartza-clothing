import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import axios from "axios";
import { useEffect } from "react";
import useAlert from "../../alerts/hooks/useAlert";
import API from "../../../config/api";

function CouponsPage() {

  const navigate = useNavigate();
  const { showToast, showModal } = useAlert();

  const [editingCouponId, setEditingCouponId] = useState(null);
  const [addcoupon,setaddcoupon]=useState(false)
  const [coupons,setcoupons]=useState([])
  const [editmodal,seteditmodal]=useState(false)
  const [couponData, setCouponData] = useState({
  code: "",
  discountType: "percentage",
  discountValue: "",
  minOrderAmount: "",
  maxDiscount: "",
  usageLimit: "",
  oneTimePerUser: false,
  startDate: "",
  expiryDate: "",
  status: "active",
});


const handlechange=(e)=>{
  const  {name,value,type,checked}=e.target;
  setCouponData((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value,
  }));
}

  const handleaddcoupon=async()=>{
    try{
        await API.post("/api/admin/addcoupon",{couponData})
        setaddcoupon(false)
        // setCouponData("");
        showToast("Coupon added successfully", "success");
         await coupondata();
  } catch (error) {
    showToast("Failed to add coupon", "error");
  }
  }

  useEffect(()=>{
    coupondata()
  },[])


  const coupondata=async()=>{
    try{
  const res=  await API.get("/api/admin/fetchcoupon")
  console.log(res.data);
  setcoupons(res.data)
    }catch(error){
      console.log(error);
      
    }

  }
  const handleEdit = (item) => {
  setCouponData({
    code: item.code,
    discountType: item.type === "PERCENT" ? "percentage" : "flat",
    discountValue: item.value,
    minOrderAmount: item.minOrderValue,
    maxDiscount: item.maxDiscount,
    usageLimit: item.usageLimit,
    oneTimePerUser: item.oneTimePerUser,
    startDate: item.startDate?.slice(0, 10),
    expiryDate: item.expiryDate?.slice(0, 10),
    status: item.status,
  });

  setEditingCouponId(item._id);
  seteditmodal(true);
};
const handleUpdateCoupon = async () => {
  try {
    const payload = {
      code: couponData.code,
      type:
        couponData.discountType === "percentage"
          ? "PERCENT"
          : "FLAT",
      value: Number(couponData.discountValue),
      minOrderValue: Number(couponData.minOrderAmount),
      maxDiscount: Number(couponData.maxDiscount),
      usageLimit: Number(couponData.usageLimit),
      oneTimePerUser: couponData.oneTimePerUser,
      startDate: couponData.startDate,
      expiryDate: couponData.expiryDate,
      status: couponData.status,
    };

    await API.put(
      `/api/admin/update/${editingCouponId}`,
      payload
    );

    seteditmodal(false);
    coupondata(); // refresh table
     showToast("Coupon updated successfully", "success");
  } catch (err) {
    console.log(err);
  }
};


const handledelete = (item) => {
  showModal({
    title: "Delete Coupon",
    message: `Are you sure you want to delete "${item.code}"?`,
    type: "danger",
    onConfirm: async () => {
      try {
        await API.delete(
          `/api/admin/delete/${item._id}`
        );

        setcoupons((prev) =>
          prev.filter((c) => c._id !== item._id)
        );

        showToast("Coupon deleted", "success");
      } catch (err) {
        showToast("Delete failed", "error");
      }
    },
  });
};

const totalCoupons = coupons.length;

const activeCoupons = coupons.filter(
  (c) => c.status === "active"
).length;

const expiredCoupons = coupons.filter((c) => {
  if (!c.expiryDate) return false;
  return new Date(c.expiryDate) < new Date();
}).length;

const totalUsage = coupons.reduce(
  (sum, c) => sum + (c.usageLimit || 0),
  0
);
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 border rounded-md text-sm hover:bg-gray-100"
        >
          ←
        </button>

        <h1 className="text-2xl font-semibold text-gray-700">
          Coupons
        </h1>

        <button onClick={()=>setaddcoupon(true)} className="px-4 py-2 bg-[#4E3528] text-white rounded-md text-sm hover:opacity-90">
          + Add Coupon
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat title="Total Coupons" value={totalCoupons} />
        <Stat title="Active Coupons" value={activeCoupons} />
        <Stat title="Expired Coupons" value={expiredCoupons} />
        <Stat title="Total Usage" value={totalUsage} />
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Coupon List
        </h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-600">
              <th className="py-3 px-4 text-left">Code</th>
              <th className="py-3 px-4 text-left">Discount</th>
              <th className="py-3 px-4 text-left">Expiry Date</th>
              <th className="py-3 px-4 text-left">Usage</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {coupons.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">{item.code}</td>
                <td className="py-3 px-4">{item.value}{item.type === "PERCENT" ? "%" : "₹"}</td>
                <td className="py-3 px-4">{item.expiryDate}</td>
                <td className="py-3 px-4">{item.usageLimit}</td>
                <td className="py-3 px-4">
                  <span className="px-3 py-1 rounded-full bg-gray-200 text-xs">
                    {item.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button onClick={()=>handleEdit(item)}
                  className="text-blue-600 text-xs hover:underline mr-3">
                    Edit
                  </button>
                  <button onClick={()=>handledelete(item)}
                   className="text-red-600 text-xs hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    {addcoupon&&(
            <div  className="fixed  inset-0 bg-black/40 flex items-center justify-center z-50">
      <div onClick={(e)=>e.stopPropagation()} className="bg-white w-full max-w-4xl rounded-2xl shadow-xl p-10 relative">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4  pb-3">
          <h2 className="text-xl font-semibold text-gray-700">
            Add Coupon
          </h2>
          <button onClick={()=>setaddcoupon(false)}>
            <X className="w-5 h-5 text-gray-500 hover:text-black" />
          </button>
        </div>

        {/* Form */}
        <form className="space-y-4">

          {/* Coupon Code */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Coupon Code
            </label>
            <input
              type="text"
               name="code"
              onChange={handlechange}
              value={couponData.code}
              placeholder="NEWUSER50"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Discount Type + Value */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Discount Type
              </label>
              <select onChange={handlechange}
              name="discountType"
              value={couponData.discountType}
               className="w-full border rounded-lg px-3 py-2">
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount (₹)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Discount Value
              </label>
              <input
              onChange={handlechange}
              name="discountValue"
              value={couponData.discountValue}
                type="number"
                placeholder="50"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* Min & Max */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Minimum Order Amount
              </label>
              <input
              value={couponData.minOrderAmount}
              onChange={handlechange}
                name="minOrderAmount"

                type="number"
                placeholder="999"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Maximum Discount
              </label>
              <input
              value={couponData.maxDiscount}
              onChange={handlechange}
               name="maxDiscount"
                type="number"
                placeholder="300"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* Usage */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Usage Limit
              </label>
              <input
              value={couponData.usageLimit}
              onChange={handlechange}
              name="usageLimit"
                type="number"
                placeholder="100"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div className="flex items-center gap-2 mt-6">
              <input type="checkbox"
              onChange={handlechange}
              value={couponData.oneTimePerUser} />
              <span className="text-sm text-gray-600">
                One time per user
              </span>
            </div>
          </div>

         
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Start Date
              </label>
              <input
              name="startDate"
              onChange={handlechange}
              value={couponData.startDate}
                type="date"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Expiry Date
              </label>
              <input
              
  name="expiryDate"
              onChange={handlechange}
              type="date"
              value={couponData.expiryDate}
                
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Status
            </label>
            <select onChange={handlechange} name="status" value={couponData.status} className="w-full border rounded-lg px-3 py-2">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 ">
            <button
              type="button"
              onClick={()=>setaddcoupon(false)}
              className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={()=>handleaddcoupon()}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Save Coupon
            </button>
          </div>

        </form>
      </div>
    </div>
    )}
    {editmodal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl p-10 relative">

      {/* Header */}
      <div className="flex justify-between items-center mb-4 pb-3">
        <h2 className="text-xl font-semibold text-gray-700">
          Edit Coupon
        </h2>

        <button onClick={() => seteditmodal(false)}>
          <X className="w-5 h-5 text-gray-500 hover:text-black" />
        </button>
      </div>

      {/* Form */}
      <form className="space-y-4">

        {/* Coupon Code */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Coupon Code
          </label>
          <input
            type="text"
            name="code"
            value={couponData.code}
            onChange={handlechange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Discount Type + Value */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Discount Type
            </label>
            <select
              name="discountType"
              value={couponData.discountType}
              onChange={handlechange}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="flat">Flat Amount (₹)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Discount Value
            </label>
            <input
              type="number"
              name="discountValue"
              value={couponData.discountValue}
              onChange={handlechange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        {/* Min & Max */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Minimum Order Amount
            </label>
            <input
              type="number"
              name="minOrderAmount"
              value={couponData.minOrderAmount}
              onChange={handlechange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Maximum Discount
            </label>
            <input
              type="number"
              name="maxDiscount"
              value={couponData.maxDiscount}
              onChange={handlechange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        {/* Usage */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Usage Limit
            </label>
            <input
              type="number"
              name="usageLimit"
              value={couponData.usageLimit}
              onChange={handlechange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div className="flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              name="oneTimePerUser"
              checked={couponData.oneTimePerUser}
              onChange={handlechange}
            />
            <span className="text-sm text-gray-600">
              One time per user
            </span>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={couponData.startDate}
              onChange={handlechange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Expiry Date
            </label>
            <input
              type="date"
              name="expiryDate"
              value={couponData.expiryDate}
              onChange={handlechange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Status
          </label>
          <select
            name="status"
            value={couponData.status}
            onChange={handlechange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => seteditmodal(false)}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleUpdateCoupon}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Update Coupon
          </button>
        </div>
      </form>
    </div>
  </div>
)}
      
    </div>

  );
}

const Stat = ({ title, value }) => (
  <div className="bg-white rounded-lg shadow p-5">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-semibold mt-2 text-gray-800">
      {value}
    </p>
  </div>
);

export default CouponsPage;
