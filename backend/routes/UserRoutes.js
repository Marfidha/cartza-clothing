import userdata from "../models/User.js"
import express from "express"
import { sendOtp, verifyotp ,userregistration ,userLogin ,googleLogin, addToWishlist,getWishlist,
     removeFromWishlist, AddtoCart, fetchcart, updateCartQty,
     fetchuser,
     addAddress,
     getAddresses,
     updateProfile,
     applycoupon,
     placeOrder,
     addMoney,
     fetchWallet,
     fetchWalletTransactions,
     getOrder,
     getOrderById,
     changePassword,
     updateAddress,
     deleteAddress,
     deleteCartItem,
     cancelOrder,
     addFeedback,
     getProductReviews,
     getUserTransactions,
     sendResetOtp,
     verifyResetOtp,
     resetPasswordWithOtp
} from "../controllers/UserController.js"
import  authMiddleware  from "../middlewere/authMiddleware.js"

const router=express.Router()


router.post("/register" ,userregistration)
router.post("/send-otp",sendOtp)
router.post("/verify-otp",verifyotp)
router.post("/userlogin" ,userLogin )
router.post("/googlelogin",googleLogin)

router.post("/forgot-password/send-otp", sendResetOtp);
router.post("/forgot-password/verify-otp", verifyResetOtp);
router.post("/forgot-password/reset",resetPasswordWithOtp);

router.post("/wishlist/:productId", authMiddleware(["user"]), addToWishlist);
router.get("/wishlistproduct",authMiddleware(["user"]),getWishlist)
router.delete("/wishlist/:productId", authMiddleware(["user"]),removeFromWishlist)

router.post("/addtoCart/:id" ,authMiddleware(["user"]),AddtoCart)
router.get("/cart", authMiddleware(["user"]),fetchcart)
router.patch("/updateqty",authMiddleware(["user"]),updateCartQty)
router.delete("/deletecartproduct/:id",authMiddleware(["user"]),deleteCartItem)

router.get("/user",authMiddleware(["user"]),fetchuser)
router.put("/update-profile", authMiddleware(["user"]), updateProfile);

router.post("/address",authMiddleware(["user"]),addAddress)
router.get("/address", authMiddleware(["user"]), getAddresses);
router.put("/address/:id",authMiddleware(["user"]),updateAddress)
router.delete("/deleteaddress/:id", authMiddleware(["user"]),deleteAddress)

router.post("/apply-coupon",authMiddleware(["user"]),applycoupon)

router.post("/wallet/add-money",authMiddleware(["user"]),addMoney)
router.get("/wallet/fetch",authMiddleware(["user"]),fetchWallet)
router.get("/wallet/transactions",authMiddleware(["user"]),fetchWalletTransactions)

router.post("/place-order",authMiddleware(["user"]),placeOrder)
router.get ("/orders",authMiddleware(["user"]),getOrder)
router.get("/orders/:orderId", authMiddleware(["user"]), getOrderById);
router.put("/cancel/:orderId",authMiddleware(["user"]),cancelOrder)

router.post("/changepassword",authMiddleware(["user"]),changePassword)

router.post("/add",authMiddleware(["user"]),addFeedback)
router.get("/feedback/:productId",getProductReviews)
router.get("/usertransactions",authMiddleware(["user"]),getUserTransactions)


export default router