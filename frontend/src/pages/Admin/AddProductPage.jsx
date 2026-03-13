import React from 'react'
import { useState,useEffect } from 'react'
import { useParams } from "react-router-dom";
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../Redux/Slices/CategorySlice.js";
import { fetchSubCategories } from "../../Redux/Slices/SubCategories.js";

const AddProductPage = () => {

     const dispatch=useDispatch()
     const { id } = useParams();
     const [product, setProduct] = useState(null);
    
     const { items, loading, error } = useSelector((state) => state.categories);
     const {  subItems,  subLoading,  subError } = useSelector((state) => state.subcategories);

        useEffect(()=>{
          dispatch(fetchCategories())
          dispatch(fetchSubCategories())
        },[dispatch])

        useEffect(() => {
        if(id){
          fetchProduct();
          }
        },[id]);

       const fetchProduct = async () => {
             try {
              const res = await axios.get(`http://localhost:3001/api/product/${id}`);
              const data = res.data;
              setproductname(data.productName);
              setMainCategory(data.mainCategory?._id || "");
              setSubCategory(data.subCategory?._id || "");
              setDescription(data.description);
              setColor(data.color);
              setMaterial(data.material);
              setproductPrice(data.price);
              setStock(data.stock);
              setproductStatus(data.status);
              setSizes(data.size || []);

              setProduct(data);
              setExistingImages(data.image || []);
              } catch (err) {
                console.error(err);
              }
        };

          const [images,setimages]=useState([])
          const [productName,setproductname]=useState("")
          const [mainCategory, setMainCategory] = useState("");
          const [subCategory, setSubCategory] = useState("");
          const [sizes, setSizes] = useState([])
          const [description, setDescription] = useState("")
          const [color, setColor] = useState("");
          const [Material, setMaterial]=useState("")
          const [productPrice,setproductPrice]=useState("")
          const [productStock,setStock]=useState("")
          const [productStatus,setproductStatus]=useState( true)

          const handleSizeChange = (size) => {
            setSizes((prevSizes) => {
                if (prevSizes.includes(size)) {
                  return prevSizes.filter((s) => s !== size);
                } else {
                  return [...prevSizes, size];
                }
              });
            };

            const [existingImages, setExistingImages] = useState([]);

           const filteredSubs = subItems.filter( (sub) => sub.mainCategory?._id === mainCategory   );

        const AddProduct=async ()=>{
              try{
              const frormdata=new FormData()
              images.forEach((img) => {
                frormdata.append("images", img) 
              });
              frormdata.append("productname",productName)
              frormdata.append("mainCategory", mainCategory);
              frormdata.append("subCategory", subCategory);
              sizes.forEach((size) => {
                frormdata.append("size", size);
              });
              frormdata.append("description",description)
              frormdata.append("color",color)
              frormdata.append("material",Material )
              frormdata.append("price",Number(productPrice))
              frormdata.append("stock",Number(productStock))
              frormdata.append("status",productStatus?"true":"false")

              console.log([...frormdata.entries()]);

                  if(id){
                  const token = localStorage.getItem("token");
                  await axios.put( `http://localhost:3001/api/product/product/${id}`, frormdata, { headers: { Authorization: `Bearer ${token}`,},});
                  alert("Product updated successfully");
                  }else{
                  await axios.post("http://localhost:3001/api/product/addproduct" , frormdata )
                  alert("product added")
                  frormdata()
                  }
            }catch(error){
                  console.error("Add product error:", error.response?.data || error.message);
                  alert("Failed to add product");
            }
        } 


  return (
    <>
    <div className="p-8 max-w-6xl mx-auto">

  {/* HEADER */}
  <div className="flex justify-between items-center mb-8">
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Add Product</h1>
      <p className="text-gray-500 text-sm">Create a new product listing</p>
    </div>
  </div>


  {/* SECTION — BASIC INFO */}
  <div className="bg-white rounded-xl shadow p-6 mb-6">
    <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

    <div className="grid md:grid-cols-2 gap-4">

      <input
        placeholder="Product Name"
        value={productName || ""}
        className="border rounded-lg p-3"
        onChange={(e)=>setproductname(e.target.value)}
      />
<select
  value={mainCategory}
  onChange={(e) => {
    setMainCategory(e.target.value);
    setSubCategory(""); // reset sub
  }}
  className="border rounded-lg p-3"
>
  <option value="">Select Main Category</option>

  {items.map((cat) => (
    <option key={cat._id} value={cat._id}>
      {cat.name}
    </option>
  ))}
</select>


     <select
  value={subCategory}
  onChange={(e) => setSubCategory(e.target.value)}
  className="border rounded-lg p-3"
  disabled={!mainCategory}
>
  <option value="">Select Sub Category</option>

  {filteredSubs.map((sub) => (
    <option key={sub._id} value={sub._id}>
      {sub.name}
    </option>
  ))}
</select>


      <input
        placeholder="Color"
        value={color}
        className="border rounded-lg p-3"
        onChange={(e)=>setColor(e.target.value)}
      />
        <div>
        <label className="text-sm font-medium text-gray-600">Material</label>
        <input value={Material}
        type="text" placeholder="100% Polyester" className="mt-1 w-full border rounded p-2" onChange={(e) => setMaterial(e.target.value)}/>
      </div> 

    </div>

    <textarea
      placeholder="Description"
      value={description}
      className="border rounded-lg p-3 mt-4 w-full"
      onChange={(e)=>setDescription(e.target.value)}
    />
  </div>


  {/* SECTION — IMAGES */}
  <div className="bg-white rounded-xl shadow p-6 mb-6">
    <h2 className="text-lg font-semibold mb-4">Product Images</h2>

    <input
      type="file"
      multiple
      className="border rounded-lg p-3 w-full"
      onChange={(e)=>setimages(Array.from(e.target.files))}
    />
    {existingImages.length > 0 && (
  <div className="flex gap-3 mt-4 flex-wrap">
    {existingImages.map((img,i)=>(
      <img
        key={i}
        src={img.url}
        alt="product"
        className="w-20 h-20 object-cover rounded border"
      />
    ))}
  </div>
)}
    
  </div>


  {/* SECTION — PRICING */}
  <div className="bg-white rounded-xl shadow p-6 mb-6">
    <h2 className="text-lg font-semibold mb-4">Pricing</h2>

    <input
      type="number"
        value={productPrice}
      placeholder="Product Price"
      className="border rounded-lg p-3 w-full md:w-1/3"
      onChange={(e)=>setproductPrice(e.target.value)}
    />
  </div>


  {/* SECTION — VARIANTS */}
  <div className="bg-white rounded-xl shadow p-6 mb-6">
    <h2 className="text-lg font-semibold mb-4">Variants</h2>

    <div className="flex gap-4 flex-wrap">
      {["S","M","L","XL","XXL"].map(size=>(
        <label key={size} className="flex items-center gap-2 border px-4 py-2 rounded-lg cursor-pointer">
          <input
            type="checkbox"
            checked={sizes.includes(size)}
            onChange={()=>handleSizeChange(size)}
          />
          {size}
        </label>
      ))}
    </div>
  </div>


  {/* SECTION — INVENTORY */}
  <div className="bg-white rounded-xl shadow p-6 mb-6">
    <h2 className="text-lg font-semibold mb-4">Inventory</h2>

    <div className="grid md:grid-cols-2 gap-4">
     <input
       type="number"
       value={productStock}
       placeholder="Stock Quantity"
      className="border rounded-lg p-3"
      onChange={(e)=>setStock(e.target.value)}/>


      <select
        className="border rounded-lg p-3"
        onChange={(e)=>setproductStatus(e.target.value==="true")}
      >
        <option value={true}>Active</option>
        <option value={false}>Disabled</option>
      </select>
      
    </div>
  </div>

</div>
  <button onClick={()=> AddProduct()} className="w-full bg-[#7A6660] text-white py-2 rounded-lg hover:bg-[#5f4c46] transition"> 
     {id ? "Edit Product" : "Add Product"}
  </button>
    
   


    </>
  )
}

export default AddProductPage