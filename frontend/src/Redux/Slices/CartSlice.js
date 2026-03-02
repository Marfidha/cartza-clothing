import {createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const AddtoCart= createAsyncThunk("Cart/AddtoCart" ,async({productId,size},thunkAPI)=>{
    try{
    const token =localStorage.getItem("token")
    if(!token){
         return thunkAPI.rejectWithValue("User not logged in");
    }
    const res= await axios.post(`http://localhost:3001/api/user/auth/addtoCart/${productId}`,{size},{ headers:{ Authorization:`Bearer ${token}`}})
    return res.data;
    }catch(error){
        return thunkAPI.rejectWithValue(error.response.data.message);
        
    }

})

export const getcartitems=createAsyncThunk("cart/getcartitems" ,async(_,thunkAPI)=>{
  try{
    const token=localStorage.getItem("token")
    if(!token){
      return  [];
    }
     const res= await axios.get("http://localhost:3001/api/user/auth/cart",{headers:{Authorization:`Bearer ${token}`}})
      console.log(res.data);
     return res.data
    
     

  }catch(error){
 return thunkAPI.rejectWithValue(error.response?.data || "Failed");
  }
})

export const updateQty = createAsyncThunk("cart/updateQty", async ({ productId, action,size }) => {
    const token = localStorage.getItem("token");

    const res = await axios.patch("http://localhost:3001/api/user/auth/updateqty", { productId, action ,size}, { headers: { Authorization: `Bearer ${token}` } } );

    return res.data; 
  }
);


export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (itemId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.delete(
        `http://localhost:3001/api/user/auth/deletecartproduct/${itemId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Delete failed"
      );
    }
  }
);



const cartSlice = createSlice({
   name: "cart",
  initialState: {
    items: [],
    totalQuantity: 0,
    loading: false,
    status: "idle",  
  error: null 
  },
  reducers: {
      resetCartStatus: (state) => {
    state.status = "idle";
    state.error = null;
  }
  },
  extraReducers: (builder) => {
    builder
      .addCase(AddtoCart.pending, (state) => {
        state.loading = true;
         state.status = "loading";
          state.error = null;
      })
      .addCase(AddtoCart.fulfilled, (state, action) => {
  state.loading = false;
    state.status = "succeeded"
  state.items = action.payload.items;
  

  state.totalQuantity = state.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
})
      .addCase(AddtoCart.rejected, (state,action) => {
        state.loading = false;
        state.status = "failed";      
  state.error = action.payload;
      });
  
     builder .addCase(getcartitems.pending, (state) => {
        state.loading = true;
        state.error=null
      })
      .addCase(getcartitems.fulfilled, (state, action) => {
      
        state.items = action.payload;

        state.totalQuantity = state.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        );

        state.loading = false;
      })
      .addCase(getcartitems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
     builder.addCase(updateQty.fulfilled, (state, action) => {
  state.items = action.payload;
  state.totalQuantity = state.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
});
builder.addCase(removeFromCart.fulfilled, (state, action) => {
  state.items = action.payload;

  state.totalQuantity = state.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
});



  }
  
});
export const { resetCartStatus } = cartSlice.actions;
export default cartSlice.reducer
