import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate ,useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import useAlert from "../../alerts/hooks/useAlert";
import API from "../../../config/api";

// Inline SVG Icons to resolve dependency issues
const IconChevronLeft = () => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>
);
const IconCamera = () => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="3.2"></circle><path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"></path></svg>
);

const OneProductDetails = () => {
    const navigate=useNavigate()
  const { id } = useParams();
  const { showToast, showSnackbar, showModal } = useAlert();

  const [product, setProduct] = useState(null);
  const [editmodal, seteditmodal] = useState(false);
  const [selectedproduct, setselectedproduct] = useState(null);

  const [oneImagemodal, setoneImagemodal] = useState(null);
  const [selectedimageindex, setselectedimageindex] = useState(null);
  const [newImage, setnewImage] = useState(null);

  // Fetch product
  const fetchProduct = async () => {
    try {
      const res = await API.get(`/api/product/${id}`);
      setProduct(res.data);
    } catch (err) {console.error(err);}
   };

  useEffect(() => {
    fetchProduct();
  }, [id]);



  const confirmDelete = (id) => {

  showModal({
    title: "Delete Product",
    message: "Are you sure you want to delete this product? This action cannot be undone.",
    type: "danger",

    onConfirm: () => {
      handledelete(id);
    }
  });

};
  // Delete product
  const handledelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.put( `/api/product/${id}/delete`,{}, { headers: { Authorization: `Bearer ${token}` } });
      showToast(res.data.message || "Product deleted", "success");
      console.log(res.data.message);
      navigate("/dashboard/products");
      fetchProduct();
      } catch (err) {
        console.error(err.response?.data);
        showToast(
          err.response?.data?.message || "Failed to delete product",
          "error"
        );
      }
  };

  // Edit modal open
  const handleedit = (product) => {
   navigate(`/dashboard/products/edit/${product._id}`);
    seteditmodal(true);
  };

  // Update image
  const handleUpdateImage = async () => {
    try {
      const formdata = new FormData();
      formdata.append("image", newImage);
      formdata.append("index", selectedimageindex);

      const token = localStorage.getItem("token");

      await API.post(
        `/api/product/${product._id}/new-img/`,
        formdata,
        { headers: { Authorization: `Bearer ${token}` } }
      );
        showToast("Image updated successfully", "success");
      setnewImage(null);
      setselectedimageindex(null);
      setoneImagemodal(null);
      fetchProduct();
    } catch (err) {
      console.error(err);
      showToast("Image update failed", "error");
    }
  };




  const handleDragEnd = async (result) => {
  if (!result.destination) return;

  const items = Array.from(product.image);

  const [moved] = items.splice(result.source.index, 1);
  items.splice(result.destination.index, 0, moved);

  setProduct({ ...product, image: items });

  try {
    const token = localStorage.getItem("token");

    await API.put(
      `/api/product/${product._id}/reorder-images`,
      { images: items },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (err) {
    console.error(err);
  }
};

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-gray-400 font-light tracking-widest uppercase text-xs">
          Loading product...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 antialiased text-slate-900 ">
      
      {/* Navigation */}
      <button  onClick={() => navigate(-1)} className="flex items-center text-gray-400 hover:text-black transition-colors mb-8 text-sm group">
        <IconChevronLeft />
        
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Left Column: Visual Assets */}
        <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="images" direction="horizontal">
        {(provided) => (
        <div className="lg:col-span-7"
        {...provided.droppableProps}
        ref={provided.innerRef}
        >
          <div className="grid grid-cols-2 gap-4">
            
            {product.image?.map((img, i) => (
               <Draggable key={img._id} draggableId={img._id} index={i}>
            {(provided) => (
              <div 
               ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                key={i} 
                className={`group relative aspect-square overflow-hidden bg-gray-50 rounded-sm cursor-pointer border border-gray-100 ${i === 0 ? 'col-span-2' : ''}`}
                onClick={() => {
                  setselectedimageindex(i);
                  setoneImagemodal(img);
                }}
              >
                <img
                  src={img.url}
                  alt={product.productName}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-white/80 p-3 rounded-full shadow-sm text-slate-700">
                        <IconCamera />
                    </div>
                </div>
              </div>
            )}
               </Draggable>
             ))}
           {provided.placeholder}
              
           
          </div>
        </div>
         )}
     </Droppable>
  </DragDropContext>

        {/* Right Column: Product Content */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="sticky top-12">
            <header className="mb-10 border-b border-gray-100 pb-10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
                  {product.category || "Collection"}
                </span>
                <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${product.status ? "text-emerald-700 bg-emerald-50" : "text-gray-500 bg-gray-100"}`}>
                  {product.status ? "Active" : "Archived"}
                </span>
              </div>
              <h1 className="text-4xl font-light tracking-tight text-slate-950 mb-6 uppercase leading-tight">
                {product.productName}
              </h1>
              <p className="text-2xl font-light text-slate-500 tracking-tighter">
                ₹{Number(product.price).toLocaleString()}
              </p>
            </header>

            <section className="space-y-10">
              {/* Technical Specifications */}
              <div className="grid grid-cols-2 gap-y-8 gap-x-6 border-b border-gray-100 pb-10">
                <Spec label="Stock Keeping Unit" value={product.sku} />
                <Spec label="Availability" value={`${product.stock} units`} />
                <Spec label="Colorway" value={product.color} />
                <Spec label="Materiality" value={product.material} />
                <div className="col-span-2">
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3 font-bold">Standard Sizing</p>
                    <div className="flex flex-wrap gap-2">
                        {product.size?.map(s => (
                            <span key={s} className="min-w-40px text-center px-2 py-2 border border-gray-200 text-[10px] font-bold rounded-sm uppercase">
                                {s}
                            </span>
                        ))}
                    </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-4 font-bold">Details</p>
                <p className="text-sm leading-relaxed text-gray-500 font-light max-w-md italic">
                  {product.description || "No description provided for this entry."}
                </p>
              </div>

              {/* Control Panel */}
              <div className="pt-4 flex flex-col gap-4">
                <button
                  onClick={() => handleedit(product)}
                  className="w-full py-5 bg-slate-950 text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-slate-800 transition-all rounded-sm shadow-sm"
                >
                  Edit Information
                </button>
                <button
                  onClick={() => confirmDelete(product._id)}
                  className="w-full py-4 text-red-400 text-[10px] uppercase tracking-[0.2em] font-bold hover:text-red-600 transition-all"
                >
                  Delete Product
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Media Overlay Modal */}
      {oneImagemodal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-white/98 backdrop-blur-md">
          <div className="w-full max-w-2xl">
            <div className="bg-gray-50 p-2 border border-gray-100 shadow-2xl">
                <img
                    src={oneImagemodal.url}
                    className="w-full h-auto max-h-[55vh] object-contain mx-auto"
                    alt="Expanded view"
                />
            </div>
            
            <div className="mt-12 max-w-sm mx-auto space-y-8">
              <div className="flex flex-col gap-3">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 text-center">Replace Visual Asset</label>
                <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      className="block w-full text-[10px] text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-[10px] file:uppercase file:tracking-widest file:font-bold file:bg-slate-950 file:text-white hover:file:bg-slate-800 cursor-pointer"
                      onChange={(e) => setnewImage(e.target.files[0])}
                    />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                    onClick={handleUpdateImage}
                    disabled={!newImage}
                    className={`flex-2 py-4 text-[10px] uppercase tracking-widest font-bold transition-all rounded-sm ${newImage ? 'bg-black text-white shadow-lg' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
                >
                    Update Asset
                </button>
                <button
                    onClick={() => {
                        setoneImagemodal(null);
                        setnewImage(null);
                    }}
                    className="flex-1 py-4 border-b border-gray-300 text-[10px] uppercase tracking-widest font-bold hover:border-black transition-all"
                >
                    Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Spec = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-bold">{label}</span>
    <span className="text-sm font-light text-slate-900 tracking-tight">{value || "Unspecified"}</span>
  </div>
);

export default OneProductDetails;
