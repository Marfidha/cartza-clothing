import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../config/api";
import axios  from "axios";



export const addAddress=createAsyncThunk("address/addressdata" ,async(addressdata,thunkAPI)=>{
  const token=localStorage.getItem("token")
  if(!token) return thunkAPI.rejectWithValue("No token found");
    try{
      const response= await API.post("/api/user/auth/address", addressdata,
         {headers:{Authorization:`Bearer ${token}`}})
        return response.data.data;
    }catch(error){
         return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add address"
      );
    }
})




export const getaddresses=createAsyncThunk("address/getaddresses" ,async(_,thunkAPI)=>{
    try{
        const token=localStorage.getItem("token")
        const response=await API.get("/api/user/auth/address",{headers:{Authorization:`Bearer ${token}`}})
        return response.data;
    }catch(error){
        return thunkAPI.rejectWithValue(error.response.data.message || "Failed to fetch addresses");
    }
})


export const updateAddress = createAsyncThunk( "address/updateAddress", async ({ id, data }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.put( `/api/user/auth/address/${id}`,  data,  {  headers: { Authorization: `Bearer ${token}` }, }  );
      return res.data.address;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Update failed"
      );
    }
  }
);



export const deleteAddress = createAsyncThunk("address/deleteAddress",async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.delete( `/api/user/auth/deleteaddress/${id}`, {headers: { Authorization: `Bearer ${token}`},});
      return res.data.id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Delete failed"
      );
    }
  }
);




const AddressSlice=createSlice({
    name:"address",
     initialState: {
    addresses: [],
    selectedAddressId: null,
    loading: false,
    error: null,
  },
  reducers:{
     setSelectedAddressId: (state, action) => {
      state.selectedAddressId = action.payload;
    },
     },
       extraReducers: (builder) => {
            builder.addCase(getaddresses.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
        builder.addCase(getaddresses.fulfilled, (state, action) => {
      state.loading = false;
      state.addresses = action.payload.data||[]
    });
        builder.addCase(getaddresses.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ===== ADD ADDRESS =====
     builder .addCase(addAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses.push(action.payload); // 👈 ADD NEW ADDRESS
      })
     .addCase(addAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

      builder.addCase(updateAddress.fulfilled, (state, action) => {
        const index = state.addresses.findIndex(
          (a) => a._id === action.payload._id
        );
        if (index !== -1) {
          state.addresses[index] = action.payload;
        }

      });

      builder.addCase(deleteAddress.fulfilled, (state, action) => {
  state.addresses = state.addresses.filter(
    (a) => a._id !== action.payload
  );
});



  }
  });

  export const { setSelectedAddressId } = AddressSlice.actions;
export default AddressSlice.reducer;
