import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


// 🔹 Fetch ALL subcategories
export const fetchSubCategories = createAsyncThunk(
  "subcategories/fetch",
  async () => {
    const res = await axios.get(
      "http://localhost:3001/api/admin/subcategories"
    );
    return res.data;
  }
);


const subCategorySlice = createSlice({
  name: "subcategories",

  initialState: {
    subItems: [],
    subLoading: false,
    subError: null,
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchSubCategories.pending, (state) => {
        state.subLoading = true;
      })

      .addCase(fetchSubCategories.fulfilled, (state, action) => {
        state.subLoading = false;
        state.subItems = action.payload;
      })

      .addCase(fetchSubCategories.rejected, (state, action) => {
        state.subLoading = false;
        state.subError = action.error.message;
      });
  },
});

export default subCategorySlice.reducer;
