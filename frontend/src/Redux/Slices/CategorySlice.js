import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../config/api";
import axios from "axios";

export const fetchCategories = createAsyncThunk("categories/fetch",async () => {
    const res = await API.get("/api/admin/maincategories"
    );
    return res.data;
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch";
      });
  },
});

export default categorySlice.reducer;
