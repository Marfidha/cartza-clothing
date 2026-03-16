import {createSlice,createAsyncThunk} from '@reduxjs/toolkit'
import API from '../../../config/api';
import axios from 'axios'


export const fetchWishlist=createAsyncThunk("Wishlist/fetchWishlist", async (_,thunkAPI)=>{

    const token = localStorage.getItem("token");
       if (!token) {
      return []; // ✅ always return array
    }
    
     const res= await API.get("/api/user/auth/wishlistproduct", { headers: { Authorization: `Bearer ${token}` }, })
        return res.data
})

export const toggleWishlist=createAsyncThunk("Wishlist/toggleWishlist", async (productId,thunkAPI)=>{
    const token=localStorage.getItem("token")
    if (!token) throw new Error("No token")

    const state=thunkAPI.getState()
    const exists = state.wishlist.ids.includes(productId);

    if(!exists){
         await API.post(`/api/user/auth/wishlist/${productId}`,{},{headers:{Authorization:`Bearer ${token}`}})
        console.log("Product added to wishlist");
        return { productId, action: "add" };
    }else{
         await API.delete( `/api/user/auth/wishlist/${productId}`, { headers: { Authorization: `Bearer ${token}`}});
          return { productId, action: "remove" };
    }

})
const WishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    products: [],
    ids: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
  state.products = action.payload || [];
  state.ids = action.payload?.map(p => p._id) || [];
  state.loading = false;
})
      .addCase(toggleWishlist.fulfilled, (state, action) => {
  // 🛑 If thunk returned nothing, do nothing
  if (!action.payload) return;

  const { productId, action: type } = action.payload;


  if (type === "add") {
    // ✅ prevent duplicates
    if (!state.ids.includes(productId)) {
      state.ids.push(productId);
    }
  } else if (type === "remove") {
    state.ids = state.ids.filter(id => id !== productId);
    state.products = state.products.filter(p => p._id !== productId);
  }
})
.addCase(toggleWishlist.rejected, (state, action) => {
  console.warn("Wishlist error:", action.payload);
});
  },
});

export default WishlistSlice.reducer;