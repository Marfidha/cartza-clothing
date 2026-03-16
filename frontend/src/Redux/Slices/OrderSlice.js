import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../config/api";
import axios from "axios";


export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData, thunkAPI) => {
    const token = localStorage.getItem("token");
    const response = await API.post(
      "/api/user/auth/place-order",
      orderData,
      {headers:{Authorization:`Bearer ${token}`}}
    );
    return response.data;
  }
);


export const fetchUserOrders = createAsyncThunk(
  "order/fetchUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get(`/api/user/auth/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data);
      
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching order");
    }
  }
);


export const fetchOrderDetailsbyid = createAsyncThunk(
  "order/fetchOrderDetailsbyid",
  async (orderId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get(
        `/api/user/auth/orders/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data;

    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Error fetching order details"
      );
    }
  }
);

export const cancelOrderById = createAsyncThunk(
  "order/cancelOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await API.put(`/api/user/auth/cancel/${orderId}`,{},{  headers: {    Authorization: `Bearer ${token}`,  }, } );

      return data.order;

    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);




const orderSlice = createSlice({
  name: "order",
  initialState: {
    loading: false,
    success: false,
    order: null,
    orders: [], 
    error: null,
  },
  reducers: {
    resetOrder: (state) => {
      state.success = false;
      state.order = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
      builder
     .addCase(fetchUserOrders.pending, (state) => {
      state.loading = true;
    })
    .addCase(fetchUserOrders.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    })
    .addCase(fetchUserOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder
    .addCase(fetchOrderDetailsbyid.pending, (state) => {
  state.loading = true;
})
.addCase(fetchOrderDetailsbyid.fulfilled, (state, action) => {
  state.loading = false;
  state.order = action.payload;
})
.addCase(fetchOrderDetailsbyid.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
});
builder.addCase(cancelOrderById.fulfilled, (state, action) => {
  state.order = action.payload; // update order instantly
})



          },
          
});

export const { resetOrder } = orderSlice.actions;
export default orderSlice.reducer;

