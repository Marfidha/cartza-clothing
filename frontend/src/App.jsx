import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Toaster } from "react-hot-toast";
import './App.css'
// import AdminLayout from './Layouts/AdminLayout.jsx'
import AdminLoginn from './pages/Admin/AdminLoginn'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import AdminDashbord from './pages/Admin/AdminDashbord'
import AdminOrders from './pages/Admin/AdminOrders'
import AdminProducts from './pages/Admin/AdminProducts'
import AdminCustomers from './pages/Admin/AdminCustomers'
import AdminCategory from './pages/Admin/AdminCategory'
import AdminReports from './pages/Admin/AdminReports'
import Navbar from './components/Navbar.jsx'
import Landingpage from './pages/user/Landingpage.jsx'
import UserLayout from './Layouts/UserLayout.jsx'
import DashboardLayout from './pages/Admin/DashboardLayout.jsx'
import OneProduct from './pages/user/OneProduct.jsx'
import Whishlist from './pages/user/Whishlist.jsx'
import ProductDetails from './pages/user/ProductDetails.jsx'
import CartPage from './pages/user/CartPage.jsx'
import ProfilePage from './pages/user/ProfilePage.jsx';
import CouponsPage from './pages/Admin/CouponsPage.jsx';
import Checkout from './pages/user/Checkout.jsx';
import WalletPage from './pages/user/WalletPage.jsx';
import AddProductPage from './pages/Admin/AddProductPage.jsx';
import OrderSuccesPage from './pages/user/OrderSuccesPage.jsx';
import UserLogin from './pages/user/userLogin.jsx';
import UserRegistration from './pages/user/UserRegistration.jsx';
import OrdersPage from './pages/user/OrdersPage.jsx';
import OrderDetails from './pages/user/OrderDetails.jsx';
import TransactionsPage from './pages/user/TransactionsPage.jsx';
import AdminSalesReport from './pages/Admin/AdminSalesReport.jsx';
import ForgotPasswordPage from './pages/user/ForgotPasswordPage.jsx';
import OrderProcessing from './pages/user/OrderProcessing.jsx';
import OneCustomerDetails from './pages/Admin/OneCustomerDetails.jsx';
import AdminOrderDetails from './pages/Admin/AdminOrderDetails.jsx';


function App() {

  return (
    <>
<Toaster position="top-right" />

    <BrowserRouter>
    <Routes>
      <Route path='/' element={<UserLayout/>}>
        <Route index element={<Landingpage/>}/>
        <Route path='/products/:category' element={<ProductDetails/>}/>
        <Route path="/product/:id" element={<OneProduct/>}/>
        <Route path="/whishlist" element={<Whishlist/>}/>
        <Route path="/login" element={<UserLogin/>}/>
        <Route path="/register" element={<UserRegistration/>}/>
        <Route path="/cart" element={<CartPage/>}/>
        <Route path='/checkout' element={<Checkout/>}/>
        <Route path="/processing" element={<OrderProcessing/>}/>
        <Route path='/order-success' element={<OrderSuccesPage/>}/>
        <Route path='/profile' element={<ProfilePage/>}/>
        <Route path='/wallet' element={<WalletPage/>}/>
       <Route path='/userorders' element={<OrdersPage/>}/>
       <Route path='/orders/:orderId' element={<OrderDetails/>}/>
       <Route path="/transactions" element={<TransactionsPage/>} />
       <Route path="/forgot-password" element={ <ForgotPasswordPage/>} />
      </Route>
      <Route path='/adminlogin' element={<AdminLoginn/>}/>
      <Route path="/dashboard" element={<DashboardLayout/>}>
      <Route index element={<AdminDashbord/>} />
        <Route path="orders">
  <Route index element={<AdminOrders />} />
  <Route path=":id" element={<AdminOrderDetails/>} />
</Route>
        <Route path="products">
           <Route index element={<AdminProducts />} />
           <Route path="add" element={<AddProductPage />} />
        </Route>
        {/* <Route path="products" element={<AdminProducts />} />
        <Route path="products/add" element={<AddProductPage/>} /> */}
        <Route path="customers">
          <Route index element={<AdminCustomers />} />
          <Route path=":id" element={<OneCustomerDetails />} />
        </Route>
        <Route path="category" element={<AdminCategory />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="coupons" element={<CouponsPage/>}/>
        <Route path="reports">
           <Route index element={<AdminReports />} />
           <Route path="sales-report" element={<AdminSalesReport />} />
        </Route>
      </Route>
    </Routes>
    </BrowserRouter>
    </>
  ) 
}

export default App
