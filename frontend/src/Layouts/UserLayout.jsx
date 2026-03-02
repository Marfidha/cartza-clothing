import React from 'react'
import { Outlet } from "react-router-dom";
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function UserLayout() {
  return (
    <>
    <div className="min-h-screen ">
    <Navbar/>
    <main>
    <Outlet/>
    </main>
    <Footer/>
    </div>
    </>
  )
}

export default UserLayout