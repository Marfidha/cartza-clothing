import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../Redux/Slices/CategorySlice.js";
import { fetchSubCategories } from "../../Redux/Slices/SubCategories.js";
import useAlert from "../../alerts/hooks/useAlert";


function AdminCategory() {
  const dispatch = useDispatch();
  
  const [showMainModal, setShowMainModal] = useState(false);
  const [selectedMain, setSelectedMain] = useState("");
  const [NewSub,setNewSub] = useState("")
  const { showToast, showSnackbar, showModal } = useAlert();

  const [editModal, setEditModal] = useState(false);
const [editCategory, setEditCategory] = useState(null);

  const { items, loading, error } = useSelector((state) => state.categories);
  const {  subItems,  subLoading,  subError } = useSelector((state) => state.subcategories);
  useEffect(()=>{
    dispatch(fetchCategories())
    dispatch(fetchSubCategories())
  },[dispatch])


const [formData, setFormData] = useState({
  name: "",
  banner: null,
  isActive: true,
  // showOnHomepage: false,
});
const uploadImageToCloudinary = async (file) => {
  const data = new FormData();

  data.append("file", file);
  data.append("upload_preset", "ecommerce_unsigned");

  const res = await axios.post(
    "https://api.cloudinary.com/v1_1/dmbo12g1x/image/upload",
    data
  );

  return res.data.secure_url;
};


  const handleAddCategory = async () => {
  try {
    
    let bannerUrl = "";

    // Upload image to Cloudinary
    if (formData.banner) {
      bannerUrl = await uploadImageToCloudinary(formData.banner);
    }
    const res = await axios.post("http://localhost:3001/api/admin/addmaincategory",
     {name: formData.name,
    banner: bannerUrl,
    isActive: formData.isActive,} );
   showToast("Category added successfully", "success");
    setShowMainModal(false);
    dispatch(fetchCategories());
    return res.data

  } catch (err) {
    showToast("Failed to add category", "error");
  }
};

const addSubCategory = async () => {
  if (!selectedMain || !NewSub) {
    alert("Please select a main category and enter a sub category name.");
    return;
  }
  try {
    const res = await axios.post("http://localhost:3001/api/admin/addsubcategory",{
      name:NewSub,
      mainCategoryId:selectedMain
  })
  showToast("Sub category added successfully");
  } catch (err) { 
    console.error("Failed to add subcategory:", err);
  }
}


const updateCategory = async () => {
  try {
    let bannerUrl = editCategory.banner;

    // If new image selected
    if (typeof editCategory.banner === "object") {
      bannerUrl = await uploadImageToCloudinary(
        editCategory.banner
      );
    }

    await axios.put(
      `http://localhost:3001/api/admin/updatecategory/${editCategory._id}`,
      {
        name: editCategory.name,
        banner: bannerUrl,
        isActive: editCategory.isActive,
      }
    );

    setEditModal(false);
    showToast("Category updated successfully");
    dispatch(fetchCategories());
  } catch (err) {
    console.error("Update failed:", err);
  }
};


const toggleCategory = async (id) => {
  try {
    await axios.patch(
      `http://localhost:3001/api/admin/togglecategory/${id}`
    );

    showSnackbar(
      "Category status updated",
      "Undo",
      async () => {
        // optional undo action
        await axios.patch(
          `http://localhost:3001/api/admin/togglecategory/${id}`
        );
        dispatch(fetchCategories());
      }
    );

    dispatch(fetchCategories());
  } catch (err) {
    showToast("Update failed", "error");
  }
};

const deleteCategory = (id) => {
  showModal({
    title: "Delete Category",
    message:
      "Are you sure you want to delete this category? This action cannot be undone.",
    type: "danger",

    onConfirm: async () => {
      try {
        await axios.delete(
          `http://localhost:3001/api/admin/deletecategory/${id}`
        );

        showToast("Category deleted successfully", "success");

        dispatch(fetchCategories());
      } catch (err) {
        showToast("Delete failed", "error");
        console.error(err);
      }
    },
  });
};
  return (
    <>
     <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">
        Category Management
      </h1>

      {/* ================= MAIN CATEGORY ================= */}
      <div className="bg-white p-5 rounded-lg shadow mb-8">
        <h2 className="text-lg font-semibold mb-4">
          Main Categories
        </h2>
        <div className="flex gap-3 mb-4">
          <button onClick={() => setShowMainModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded">
          Add Main Category </button>
        </div>

        {/* MAIN CATEGORY CARDS */}
        <div className="grid md:grid-cols-3 gap-4">
         {items.map((cat) => (
          <div
            key={cat._id}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            {/* Banner placeholder */}
            <div className="h-32 bg-gray-200">
     {cat.banner && (
    <img
      src={cat.banner}
      alt={cat.name}
      className="w-full h-full object-cover"
    />
  )}
</div>


            <div className="p-4">
              

              <h2 className="text-lg font-semibold">
                {cat.name}
              </h2>

              <span
                className={`inline-block mt-2 px-2 py-1 text-sm rounded ${
                  cat.isActive === true
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {cat.isActive ? "Active" : "Inactive"}
              </span>

              <div className="mt-3 flex gap-3">
                <button 
                onClick={() => {
                  setEditCategory(cat);
                  setEditModal(true);
                }}
                className="text-blue-600">
                  Edit
                </button>

                <button 
                onClick={() => toggleCategory(cat._id)}
                 className="text-red-600">
                  {cat.isActive ? "Disable" : "Enable"}
                </button>

                <button  onClick={() => deleteCategory(cat._id)}>Delete</button>
              </div>

            </div>
          </div>
        ))}
        </div>
      </div>

      {/* ================= SUB CATEGORY ================= */}
      <div className="bg-white p-5 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">
          Sub Categories (Types)
        </h2>

        <div className="flex flex-wrap gap-3 mb-4">

          {/* Select Main Category */}
          <select
            value={selectedMain}
            onChange={(e) =>
              setSelectedMain(e.target.value)
            }
            className="border p-2 rounded"
          >
            <option value="">Select Main Category</option>
            {items.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Sub Category Name */}
          <input
            value={NewSub}
            onChange={(e) => setNewSub(e.target.value)}
            placeholder="Sub Category Name"
            className="border p-2 rounded"
          />

          <button
            onClick={() => addSubCategory()}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>

        </div>

        {/* SUB CATEGORY TABLE */}
        <table className="w-full text-left border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Sub Category</th>
              <th className="p-2">Main Category</th>
            </tr>
          </thead>

          <tbody>
            {subItems.map((sub) => {
              const main = items.find(
                (m) => m._id === sub.mainCategory?._id
              );

              return (
                <tr key={sub._id} className="border-t">
                  <td className="p-2">{sub.name}</td>
                  <td className="p-2">
                    {main?.name}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

      </div>

      {showMainModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    
    <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">

      <h2 className="text-xl font-bold mb-4">
        Add Main Category
      </h2>

      {/* NAME */}
      <input
        type="text"
        placeholder="Category Name"
        value={formData.name}
        onChange={(e) =>
          setFormData({ ...formData, name: e.target.value })
        }
        className="border p-2 rounded w-full mb-3"
      />
     


      {/* BANNER UPLOAD */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setFormData({
            ...formData,
            banner: e.target.files[0],
          })
        }
        className="mb-3"
      />

      {/* CHECKBOXES */}
      <div className="space-y-2 mb-4">

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) =>
              setFormData({
                ...formData,
                isActive: e.target.checked,
              })
            }
          />
          Active
        </label>

{/*        

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.showOnHomepage}
            onChange={(e) =>
              setFormData({
                ...formData,
                showOnHomepage: e.target.checked,
              })
            }
          />
          Show on Homepage
        </label> */}

      </div>

      {/* BUTTONS */}
      <div className="flex justify-end gap-3">

        <button
          onClick={() => setShowMainModal(false)}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            handleAddCategory(); // send to backend later
            setShowMainModal(false);
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          Save
        </button>

      </div>

    </div>
  </div>
)}

{editModal && editCategory && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">

      <h2 className="text-xl font-bold mb-4">
        Edit Category
      </h2>

      {/* NAME */}
      <input
        type="text"
        value={editCategory.name}
        onChange={(e) =>
          setEditCategory({
            ...editCategory,
            name: e.target.value,
          })
        }
        className="border p-2 rounded w-full mb-3"
      />

      {/* BANNER */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setEditCategory({
            ...editCategory,
            banner: e.target.files[0],
          })
        }
        className="mb-3"
      />

      {/* ACTIVE */}
      <label className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={editCategory.isActive}
          onChange={(e) =>
            setEditCategory({
              ...editCategory,
              isActive: e.target.checked,
            })
          }
        />
        Active
      </label>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setEditModal(false)}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Cancel
        </button>

        <button
          onClick={() => updateCategory()}
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          Update
        </button>
      </div>
    </div>
  </div>
)}

    </div>

    </>
  )
}

export default AdminCategory