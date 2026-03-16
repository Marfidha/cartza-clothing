import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../config/api";
import axios from "axios";

export const userprofiledata=createAsyncThunk("user/userprofileData",async(_,{ rejectWithValue })=>{
      const token=localStorage.getItem("token")
    if(!token) return 
    try{
         const res= await API.get("/api/user/auth/user",{headers:{Authorization:`Bearer ${token}`}})
                return res.data.data;
    }catch(error){
       return rejectWithValue(
        error.res?.data?.message || "Failed to fetch user"
      );
    }
})

const userSlice = createSlice({
name: "user",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers:{

  },
  extraReducers:(builder)=>{
    builder
    .addCase(userprofiledata.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
       .addCase(userprofiledata.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(userprofiledata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
})


export default  userSlice.reducer;