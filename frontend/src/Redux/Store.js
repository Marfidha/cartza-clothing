import { configureStore } from "@reduxjs/toolkit"
import wishlistReducer  from './Slices/WhishlistSlice.js'
import cartReducer from "./Slices/CartSlice.js"
import addressReducer from "./Slices/AddressSlice.js"
import userReducer from "./Slices/UserSlice.js"
import walletReducer from "./Slices/WalletSlice.js"
import categoryReducer from "./Slices/CategorySlice.js"
import subCategoryReducer from "./Slices/SubCategories.js"
import orderReducer from "./Slices/OrderSlice.js"

export const store= configureStore({
      reducer: {
       wishlist: wishlistReducer,
       cart: cartReducer,
       address:addressReducer,
       user:userReducer,
       wallet:walletReducer,
       categories:categoryReducer,
       subcategories:subCategoryReducer,
       order:orderReducer,
      },
})