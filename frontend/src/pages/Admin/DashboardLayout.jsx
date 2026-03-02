import React, { useState } from "react";
import logo from "../../assets/logo.png";
import { NavLink, Outlet } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import coupon from '../../assets/copon-icon.png'
import { useNavigate } from "react-router-dom";
import useAlert from "../../alerts/hooks/useAlert";

import {
FiLogOut,
  FiShoppingBag,
  FiPackage,
  FiUsers,
  FiTag,
  FiBarChart2,
  FiSettings,
  FiMenu
} from "react-icons/fi";

function DashboardLayout() {

  const navigate = useNavigate();
  const { showModal,showToast } = useAlert();

const handleLogout = () => {
showModal({
    title: "Confirm Logout",
    message: "Are you sure you want to logout?",
    type: "warning",

    onConfirm: () => {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");
      showToast("Logged out successfully");
      navigate("/adminlogin");
    },
  });
};
  const [isOpen, setIsOpen] = useState(false);


  const menuItems = [
    { icon: <RxDashboard size={22} />, text: "Dashboard", path: "/dashboard" },
    { icon: <FiShoppingBag size={22} />, text: "Orders", path: "/dashboard/orders" },
    { icon: <FiPackage size={22} />, text: "Products", path: "/dashboard/products" },
    { icon: <FiUsers size={22} />, text: "Customers", path: "/dashboard/customers" },
    { icon: <FiTag size={22} />, text: "Category", path: "/dashboard/category" },
    { icon: <FiBarChart2 size={22} />, text: "Reports", path: "/dashboard/reports" },
    { icon: <img src={coupon} alt="Coupon" className="w-[22px] h-[22px]" />, text: "Coupons",  path: "/dashboard/coupons", },
    { icon: <FiLogOut size={22} />, text: "Logout", action: handleLogout },
   
  ];

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row ">

      {/* Mobile Navbar */}
      <div className="md:hidden flex justify-between items-center bg-[#4E3528] text-white p-3 fixed w-full">
        <img src={logo} alt="logo" className="w-20" />
        <FiMenu className="text-2xl cursor-pointer" onClick={() => setIsOpen(!isOpen)} />
      </div>

      {/* Sidebar */}
      <div
        className={`bg-[#4E3528] text-[#F1EDE9] w-30 fixed   md:static h-screen p-4  transition-transform duration-300 z-50 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
            <div className="hidden md:flex w-full h-[10%] items-center ">
            <img src={logo} alt="logo" className="w-40 h-9"  />
            </div>
        
        <nav className="space-y-6 mt-6 flex flex-col items-center justify-between ">
          
          {menuItems.map((item, i) =>
  item.path ? (
    <NavLink
      key={i}
      to={item.path}
      className={({ isActive }) =>
        `flex flex-col items-center p-2 rounded-lg w-full 
        ${isActive ? "bg-[#604131]" : "hover:bg-[#3D2A20]"}`
      }
      onClick={() => setIsOpen(false)}
    >
      <span>{item.icon}</span>
      <span className="text-[11px]">{item.text}</span>
    </NavLink>
  ) : (
    <button
      key={i}
      onClick={item.action}
      className="flex flex-col items-center p-2 rounded-lg w-full hover:bg-[#3D2A20]"
    >
      <span>{item.icon}</span>
      <span className="text-[11px]">{item.text}</span>
    </button>
  )
)}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full bg-gray-100 p-6 pt-4 md:p-8 md:pt-6 h-screen overflow-y-auto relative">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;
