import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


// 🔹 Fetch Wallet
export const fetchWallet = createAsyncThunk("wallet/fetchWallet", async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) return rejectWithValue("User not authenticated");
        const res = await axios.get("http://localhost:3001/api/user/auth/wallet/fetch", { headers: {   Authorization: `Bearer ${token}` } });
        return res.data;
        } catch (error) {
        return rejectWithValue(error.message);
        }
  }
);


// 🔹 Add Money
export const addMoney = createAsyncThunk("wallet/addMoney",async (amount, { rejectWithValue }) => {
    try {
         const token = localStorage.getItem("token");
        if (!token) return rejectWithValue("User not authenticated");
      const res = await axios.post("http://localhost:3001/api/user/auth/wallet/add-money",{amount}, { headers: {  Authorization: `Bearer ${token}` },});
      if (!res.ok) return rejectWithValue(data.message);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchWalletTransactions = createAsyncThunk( "wallet/fetchTransactions", async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get( "http://localhost:3001/api/user/auth/wallet/transactions", {   headers: { Authorization: `Bearer ${token}` }, } );
      return res.data;
      console.log(res.data);
      
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



const walletSlice = createSlice({
  name: "wallet",
  initialState: {
    balance: 0,
    transactions: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Fetch Wallet
      .addCase(fetchWallet.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.balance;
      })
      .addCase(fetchWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Money
     .addCase(addMoney.pending, (state) => {
  state.loading = true;
})
.addCase(addMoney.fulfilled, (state, action) => {
  state.loading = false;
  state.balance = action.payload.balance;
})
.addCase(addMoney.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
});
builder
// Fetch Transactions
.addCase(fetchWalletTransactions.pending, (state) => {
  state.loading = true;
})
.addCase(fetchWalletTransactions.fulfilled, (state, action) => {
  state.loading = false;
  state.transactions = action.payload;
})
.addCase(fetchWalletTransactions.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})


  },
});

export default walletSlice.reducer;
