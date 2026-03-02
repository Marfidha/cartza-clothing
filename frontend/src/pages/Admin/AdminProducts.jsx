import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FiSearch, FiChevronDown } from "react-icons/fi";
import { MdEdit, MdDelete } from "react-icons/md";
import { FiX } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { Outlet } from "react-router-dom";


function AdminProducts() {

    const navigate=useNavigate()
 
    const [searchterm ,setsearchterm]=useState()
    const [selectedcategory,setselectedcategory]=useState()
    const [selectedstatus,setselectedstatus]=useState()
  //  catogaryfilter
  const [selectedCategoryfilter,setselectedCategoryfilter]=useState("")

  // statusfilter
  const [statusfilter ,setstatusfilter]=useState("All")
  // const [showdeleted ,setshowdeleted]=useState(false)
    // for show one product
  const [showOneProduct,setshowOneProduct]=useState(false)
  const [selectOneProduct,setselectOneProduct]=useState()
    //  for edit and delete
  
  const [editmodal ,seteditmodal]=useState(false)


 


  const [selectedproduct ,setselectedproduct]=useState()



  const [oneImagemodal,setoneImagemodal]=useState()
  const [selectedimageindex,setselectedimageindex]=useState()
  const [newImage,setnewImage]=useState()



  

  const [product,setproduct]=useState([])
  const [deletedproduct ,setdeletedproduct]=useState([])








  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:3001/api/product");
    console.log("FETCHED:", res.data);
    setproduct(res.data);
  };


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
    item.category?.toLowerCase() === selectedCategoryfilter.toLowerCase();

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


  const  handledelete=async(id)=>{

    try{
    const token=localStorage.getItem("token")
    const res= await axios.put(`http://localhost:3001/api/product/${id}/delete`,{},{headers:{Authorization:`Bearer ${token}`}})
    alert(res.data.message); 
    fetchProducts()
    }catch(err){
    console.error(err.response?.data); 
  }

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



  const handleedit = async (product)=>{
    setselectedproduct(product)
     seteditmodal(true)
  }

    const handleUpdateImage= async()=>{

      console.log(selectOneProduct._id)
      
      const formdata=new FormData()
      formdata.append("image",newImage)
      formdata.append("index",selectedimageindex)
      console.log({
  productId: selectOneProduct?._id,
  index: selectedimageindex,
  file: newImage,
});
 const token= localStorage.getItem("token")
      await axios.post(`http://localhost:3001/api/product/${ selectOneProduct._id }/new-img/`,formdata
        ,{headers:{Authorization:`Bearer ${token}`,}},
      
        
      )
    setnewImage(null)
    setselectedimageindex(null)
    setoneImagemodal(null)
    }

   



  return (
    <>
    <div className='w-full h-[10%] flex flex-row'>
      <div className='w-[80%] '>
        <h1 className="  text-xl sm:text-2xl md:text-3xl font-semibold text-gray-700"> Product Management</h1>
      </div>
       {/* <div className='w-[40%] flex flex-row gap-3.5 '> */}
      <button onClick={()=>navigate("add")} className='h-[60%] bg-[#7A6660] text-white px-5 py-2 rounded-lg shadow-md hover:bg-[#6b5a54] transition'>+ Add Product</button>
      {/* <button onClick={()=>{setshowdeleted(true); fetchdeletedproduct()}} className=' h-[60%] bg-[#7A6660] text-white px-5 py-2 rounded-lg shadow-md hover:bg-[#6b5a54] transition'>Deteted products</button> */}
       {/* </div> */}
    </div>


      <div className='w-full h-[28%]'>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
        <Card title="Total Products" countt="6" smallp="All inventory items"/>
        <Card title="Active Products" countt="5" smallp="Currently selling"/>
        <Card title="Low Stock" countt="2" smallp="Less than 10 items"/>
        <Card title="Out of Stock" countt="1" smallp="Need restocking"/>
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
                        setselectOneProduct(product); setshowOneProduct(true)
                     }}
                     }>
                      <td className="w-14 h-16 object-cover rounded"><img  
                      // src={`http://localhost:3001/uploads/${product.image[0]}`}
                      src={product.image?.[0]?.url}
                       alt={product.productName} className="w-14 h-16 object-cover rounded"
                      />
                      </td>
                      <td  className="p-3 text-black">{product.productName}</td>
                      <td  className="p-3 text-black" >{product.sku}</td>
                      <td  className="p-3 text-black">{product.mainCategory?.name}</td>
                      <td  className="p-3 text-black">{product.price}</td>
                      <td  className="p-3 ">
                         <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm"> {product.stock}</span>
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

                      {/* <td className="p-3 flex justify-center items-center gap-3"> */}
                        {/* <button onClick={()=>handleedit(product)}><MdEdit className="text-xl cursor-pointer text-gray-600 hover:text-black" /></button>
                        <button onClick={()=>handledelete(product._id)}> <MdDelete className="text-xl cursor-pointer text-red-500 hover:text-red-700" /></button> */}
                      {/* </td> */}
                    </tr>
                  )

              })
            }
          </tbody>
        </table>
      </div>




{/* showoneproduct */}

{showOneProduct && selectOneProduct && (
  <div onClick={() => setshowOneProduct(false)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    
    <div  onClick={(e) => e.stopPropagation()} className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">

      {/* Close button */}
      <button
        onClick={() => setshowOneProduct(false)}
        className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-black"
      >
        ✕
      </button>

      {/* Product name & status */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          {selectOneProduct.productName}
        </h1>

        <span
          className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold
          ${selectOneProduct.status
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"}`}
        >
          {selectOneProduct.status ? "Active" : "Disabled"}
        </span>
      </div>

      {/* Product image */}
      <div className="mb-6 flex gap-3  ">
       { selectOneProduct.image.map( (img,i)=>(
        <img
        key={i}
          src={img.url}
          alt="product"
          onClick={()=>{setselectedimageindex(i), setoneImagemodal(img)}}
          className="w-full h-56 object-cover rounded-xl border cursor-pointer hover:opacity-80"
        />
       ))}
      </div>

      {/* Product details */}
      <div className="grid grid-cols-2 gap-4 text-sm">

        <div className="bg-gray-50 p-3 rounded-lg border">
          <p className="text-gray-500 text-xs">SKU</p>
          <p className="font-medium">{selectOneProduct.sku}</p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg border">
          <p className="text-gray-500 text-xs">Category</p>
          <p className="font-medium">{selectOneProduct.category}</p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg border">
          <p className="text-gray-500 text-xs">Price</p>
          <p className="font-medium">₹{selectOneProduct.price}</p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg border">
          <p className="text-gray-500 text-xs">Stock</p>
          <p className="font-medium">{selectOneProduct.stock}</p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg border">
          <p className="text-gray-500 text-xs">Color</p>
          <p className="font-medium">{selectOneProduct.color}</p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg border">
          <p className="text-gray-500 text-xs">Material</p>
          <p className="font-medium">{selectOneProduct.material}</p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg border col-span-2">
          <p className="text-gray-500 text-xs">Sizes</p>
          <p className="font-medium">{selectOneProduct.size.join(", ")}</p>
        </div>

      </div>

      {/* Description */}
      <div className="mt-6">
        <p className="font-semibold text-gray-700 mb-1">Description</p>
        <p className="text-gray-600 text-sm leading-relaxed">
          {selectOneProduct.description}
        </p>
      </div>

      {/* Action buttons */}
      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => handleedit(selectOneProduct)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
        >
          <MdEdit className="text-lg" />
          Edit
        </button>

        <button
          onClick={() => {
            handledelete(selectOneProduct._id);
            setshowOneProduct(false);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
        >
          <MdDelete className="text-lg" />
          Delete
        </button>
      </div>

    </div>
  </div>
)}





{oneImagemodal &&(
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-5 rounded-lg w-[400px]">
      <img
        src={oneImagemodal.url}
        className="w-full h-64 object-cover rounded"
      />

       <input
        type="file"
        accept="image/*"
        className="mt-3"
        onChange={(e) => setnewImage(e.target.files[0])}
      />

      <div className="flex justify-end gap-3 mt-4">
        <button onClick={() => setoneImagemodal(null)} className="px-4 py-2 border rounded">  Cancel </button>
        <button onClick={handleUpdateImage} className="px-4 py-2 bg-black text-white rounded">  Update </button> 
      </div> 
    </div>
  </div>
)}

















{/* 

{showdeleted &&(
  <div className='fixed inset-0  bg-opacity-10 flex justify-center items-center z-50'>
    
    <div className="bg-white w-[90%] max-w-[900px] p-6 rounded-lg shadow-lg relative max-h-[80vh] overflow-y-auto">
      <button onClick={() => setshowdeleted(false)}>
         <FiX className="text-2xl text-gray-500 hover:text-black cursor-pointer" />
      </button>
     
      <div className="overflow-x-auto bg-white shadow rounded-xl p-6 ">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b text-left">
              <th className="p-3">Image</th>
              <th className="p-3">Product</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>

            {
              deletedproduct.map((deletedproduct,index)=>{
                  return(
                    <tr className="border-b h-20" key={index}>
                      <td className="w-14 h-16 object-cover rounded"><img src={`http://localhost:3001/uploads/${deletedproduct.image}`} alt="" /></td>
                      <td  className="p-3 text-black">{deletedproduct.productName}</td>
                      <td  className="p-3 text-black" >{deletedproduct.sku}</td>
                      <td  className="p-3 text-black">{deletedproduct.category}</td>
                      <td  className="p-3 text-black">{deletedproduct.price}</td>
                      <td  className="p-3 ">
                         <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm"> {deletedproduct.stock}</span>
                      </td>
                      <td  className="p-3">
                        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">{deletedproduct.status} </span>
                      </td>
                      <td className="p-3 flex items-center justify-center gap-3">
                        <button onClick={()=>restoredproduct(deletedproduct._id)} className='px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700'>Restore</button>
                      </td>
                    </tr>
                  )

              })
            }
          </tbody>
        </table>
      </div>

    </div>

  </div>
)}
 */}



{editmodal && selectedproduct &&(
   <div className="fixed inset-0  bg-opacity-10 flex justify-center items-center z-50">
    <div className="bg-white w-[90%] max-w-[700px] p-6 rounded-lg shadow-lg relative  
                    max-h-[90vh] overflow-y-auto">

      <button
        onClick={() => seteditmodal(false)} className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl">✕</button>
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Edit Product</h2>

        <div className="flex flex-col gap-4">
  
        <div>
          <label className="text-sm font-medium text-gray-600">Product Image</label>
          <input type="file" accept="image/*" className="mt-1 w-full border rounded p-2" onChange={(e) => setImageFile(e.target.files[0])}/>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Product Name</label>
          <input  onChange={(e)=>selectedproduct({...selectedproduct,productName:e.target.value})} type="text" value={selectedproduct.productName}  className="mt-1 w-full border rounded p-2"  />
        </div>

       
        <div>
          <label className="text-sm font-medium text-gray-600">SKU</label>
          <input value={selectedproduct.productSku} onChange={(e)=>selectedproduct({...selectedproduct,productSku:e.target.value})} type="text" placeholder="DRS-001" className="mt-1 w-full border rounded p-2"/>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Category</label>
          <select value={selectedproduct.productCategory} onChange={(e)=>selectedproduct({...selectedproduct,productCategory:e.target.value})} className="mt-1 w-full border rounded p-2">
            <option>Women</option>
            <option>Men</option>
            <option>Kids</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Price</label>
          <input type="number" value={selectedproduct.productPrice} onChange={(e)=>selectedproduct({...selectedproduct,productPrice:e.target.value})} className="mt-1 w-full border rounded p-2"/>
        </div>


        
        <div>
        <label className="text-sm font-medium text-gray-600">Description </label>
        <textarea rows="3" className="mt-1 w-full border rounded p-2" onChange={(e) => selectedproduct({...selectedproduct,description:e.target.value})} />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-600">
          Color
        </label>
        <input type="text" placeholder="Black" className="mt-1 w-full border rounded p-2" onChange={(e) => selectedproduct({...selectedproduct,color:e.target.va})}/>
      </div>
      

          <div>
        <label className="text-sm font-medium text-gray-600">Sizes</label>
        <div className="flex gap-4 mt-1">
          {["S", "M", "L", "XL","XXl"].map((size) => (
            <label key={size} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={sizes.includes(size)}
                
                onChange={() => handleSizeChange(size)}
              />
              {size}
            </label>
          ))}
        </div>
      </div>





         <div>
        <label className="text-sm font-medium text-gray-600">Material</label>
        <input type="text" placeholder="100% Polyester" className="mt-1 w-full border rounded p-2" onChange={(e) => selectedproduct({...selectedproduct,Material:e.target.value})}/>
      </div>

        


        <div>
          <label className="text-sm font-medium text-gray-600">Stock Status</label>
          <select value={selectedproduct.productStock} onChange={(e)=>selectedproduct({...selectedproduct,productStock:e.target.value})} className="mt-1 w-full border rounded p-2">
            <option>In Stock</option>
            <option>Low</option>
            <option>Out of Stock</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Status</label>
          <select value={selectedproduct.productStatus} onChange={(e)=>selectedproduct({...selectedproduct,productStatus:e.target.value})} className="mt-1 w-full border rounded p-2">
            <option>Active</option>
            <option>Disabled</option>
          </select>
        </div>

        <button onClick={()=> AddProduct()} className="w-full bg-[#7A6660] text-white py-2 rounded-lg hover:bg-[#5f4c46] transition"> Save Product</button>
      </div>
    </div>
  </div>
)}

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