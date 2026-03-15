import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FiSearch, FiChevronDown } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { Outlet } from "react-router-dom";


function AdminProducts() {

    const navigate=useNavigate()
 
    const [searchterm ,setsearchterm]=useState()
    const [selectedcategory,setselectedcategory]=useState()
    const [selectedstatus,setselectedstatus]=useState()
  
    const [selectedCategoryfilter,setselectedCategoryfilter]=useState("")
    const [statusfilter ,setstatusfilter]=useState("All")

    const [product,setproduct]=useState([])
     const [deletedproduct ,setdeletedproduct]=useState([]) 


  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:3001/api/product");
    console.log("FETCHED:", res.data);
    setproduct(res.data);
  };

const totalProducts = product.filter(p => !p.isDeleted).length;

const activeProducts = product.filter(
  p => p.status === true && !p.isDeleted
).length;

const lowStock = product.filter(
  p => p.stock > 0 && p.stock < 10 && !p.isDeleted
).length;

const outOfStock = product.filter(
  p => p.stock === 0 && !p.isDeleted
).length;


  useEffect(()=>{
  fetchProducts()
  },[])


  // search
const filteredProducts = product.filter((item) => {
  const keyword = searchterm?.toLowerCase() || "";

  /* 1️⃣ Search filter */
  const matchSearch =
    !keyword ||
    item.productName?.toLowerCase().includes(keyword) ||
    item.sku?.toLowerCase().includes(keyword) ||
    item.category?.toLowerCase().includes(keyword);

  /* 2️⃣ Category filter */
  const matchCategory =
  !selectedCategoryfilter ||
  selectedCategoryfilter === "All" ||
  item.mainCategory?.name?.toLowerCase() ===
  selectedCategoryfilter.toLowerCase();

  /* 3️⃣ Status filter */
  const matchStatus = (() => {
    if (statusfilter === "Active")
      return item.status === true && !item.isDeleted;

    if (statusfilter === "Disabled")
      return item.status === false && !item.isDeleted;

    if (statusfilter === "Deleted")
      return item.isDeleted === true;

    // All (default) → exclude deleted
    return !item.isDeleted;
  })();

  return matchSearch && matchCategory && matchStatus;
});


  
const fetchdeletedproduct =async ()=>{
  const token = localStorage.getItem("token")
  const res=await axios.get("http://localhost:3001/api/product/deleted",{headers:{Authorization:`Bearer ${token}`}})
  console.log("deleted data",res.data);
  setdeletedproduct(res.data)
}

const restoredproduct= async (id)=>{
    try{
      const token= localStorage.getItem("token")
      const res= await axios.put(`http://localhost:3001/api/product/${id}/restore`,{},{headers:{Authorization:`Bearer ${token}`}} )
      alert(res.data.message);
      fetchdeletedproduct()
      fetchProducts()
    }catch(err){
      console.error(err.response?.data || err.message);
    }
  }





  return (
    <>
    <div className='w-full h-[10%] flex flex-row'>
      <div className='w-[80%] '>
        <h1 className="  text-xl sm:text-2xl md:text-3xl font-semibold text-gray-700"> Product Management</h1>
      </div>
      <button onClick={()=>navigate("add")} className='h-[60%] bg-[#7A6660] text-white px-5 py-2 rounded-lg shadow-md hover:bg-[#6b5a54] transition'>+ Add Product</button>
    </div>


      <div className='w-full h-[28%]'>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          <Card title="Total Products" countt={totalProducts} smallp="All inventory items"/>
          <Card title="Active Products" countt={activeProducts} smallp="Currently selling"/>
          <Card title="Low Stock" countt={lowStock} smallp="Less than 10 items"/>
          <Card title="Out of Stock" countt={outOfStock} smallp="Need restocking"/>
      </div>
      </div>


    
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <div className="relative bg-white rounded-md shadow p-3 flex items-center">
          <FiSearch className="text-gray-400 text-xl mr-3" />
          <input type="text"
             value={searchterm}
             onChange={(e)=>setsearchterm(e.target.value)} 
             placeholder="Search product by name or SKU"
             className="w-full outline-none"
           />
        </div>

        
          <select value={selectedCategoryfilter } onChange={(e)=>setselectedCategoryfilter (e.target.value)}
           className="text-gray-500 relative bg-white rounded-md shadow p-3 flex items-center justify-between cursor-pointer ">
            {/* <FiChevronDown className="text-gray-500  " /> */}
            <option value="All">All categories</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kids">Kids</option>
          </select>
          
        

        <div className="relative bg-white rounded-md shadow p-3 flex items-center justify-between cursor-pointer">
          <select className="text-gray-500 flex justify-between"
          value={statusfilter} onChange={(e)=>setstatusfilter(e.target.value)}>
              {/* <FiChevronDown className="text-gray-500 " /> */}
              <option value="All">All </option>
            <option value="Active">Active</option>
            <option value="Disabled">Disabled</option>
            <option value="Deleted">Deleted</option>
          </select>
          
        </div>
      </div>

    
      <div className="overflow-x-auto bg-white shadow rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          products
        </h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600">
              <th className="py-3 px-4 text-left">Image</th>
              <th className="py-3 px-4 text-left">Product</th>
              <th className="py-3 px-4 text-left">SKU</th>
              <th className="py-3 px-4 text-left">Category</th>
              <th className="py-3 px-4 text-left">Price</th>
              <th className="py-3 px-4 text-left">Stock</th>
              <th className="py-3 px-4 text-left">Status</th>
              {statusfilter === "Deleted"&&(
               <th className="p-3">Actions</th> 
              )}
            </tr>
          </thead>

          <tbody>

            {
              filteredProducts.map((product,index)=>{
                  return(
                    <tr className={`border-b h-20`}
                     key={index} onClick={()=> {if(statusfilter !== "Deleted" ){
                       navigate(product._id)
                     }}
                     }>
                      <td className="w-14 h-16 object-cover rounded"><img  
                      src={product.image?.[0]?.url}
                       alt={product.productName} className="w-14 h-16 object-cover rounded"
                      />
                      </td>
                      <td  className="p-3 text-black">{product.productName}</td>
                      <td  className="p-3 text-black" >{product.sku}</td>
                      <td  className="p-3 text-black">{product.mainCategory?.name}</td>
                      <td  className="p-3 text-black">{product.price}</td>
                      <td  className="p-3 ">
                          {product.stock === 0 && (
                          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                            Out of Stock
                          </span>
                        )}

                        {product.stock > 0 && product.stock < 10 && (
                          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                            Low Stock ({product.stock})
                          </span>
                        )}

                        {product.stock >= 10 && (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                            In Stock ({product.stock})
                          </span>
                        )}
                      </td>
                      <td  className="p-3">
                        <span 
                        className={`px-3 py-1 rounded-full text-sm font-medium  ${product.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{product.status? "Active" :"Disabled"} 
                        </span>
                      </td>
                      {statusfilter === "Deleted" &&(
                       <td className="p-3 flex items-center justify-center gap-3">
                        <button onClick={(e)=> {e.stopPropagation() ,restoredproduct(product._id)}} className='px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700'>Restore</button>
                      </td>
                      )}
                    </tr>
                  )

              })
            }
          </tbody>
        </table>
      </div>

<Outlet/>
    </>

  )
}

const Card = ({ title, countt, smallp }) => (
  <div className=" bg-white  rounded-2xl  shadow-[0px_4px_12px_rgba(0,0,0,0.1)]  p-6  w-full transition  hover:shadow-[0px_6px_15px_rgba(0,0,0,0.15)] ">
   
    <h1 className="text-gray-600 text-[17px] font-serif mb-3">{title} </h1>
    <p className="text-3xl font-semibold text-gray-900 mb-1">{countt}</p>
    <p className="text-sm text-gray-500"> {smallp}</p>

  </div>
);


export default AdminProducts