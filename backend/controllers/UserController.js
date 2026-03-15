import bcrypt from "bcryptjs";
import Otp from "../models/otp.js"
import user from "../models/User.js"
import { sendEmail } from "../utils/sendEmail.js";
import jwt from "jsonwebtoken"
import whishlist from "../models/whishlist.js";
import cart from '../models/CartProducts.js'
import Address from "../models/Address.js";
import Coupon from "../models/Coupon.js"
import Wallet from "../models/Wallet.js"
import WalletTransaction from "../models/WalletTransaction.js"
import Order from "../models/Order.js"
import Product from "../models/Product.js"
import Feedback from "../models/Feedback.js";
import Transactions from "../models/Transactions.js";
import razorpay from "../config/razorpay.js";




export const sendOtp= async (req,res)=>{
    const {email}=req.body

    // registereduser= await user.findOne({email})
    // if(registereduser){
    //     alert("Email already registered")
    //      return res.status(400).json({ message: "Email already registered" });
    
    // }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Generated OTP:", otp);
    
    const hashedotp= await bcrypt.hash(otp,10)

     await Otp.deleteMany({ email });
     await Otp.create({
     email,
     otp:hashedotp,
     expiresAt: Date.now() + 5 * 60 * 1000, 
  });
 
    console.log("OTP saved in DB for:", email);
    await sendEmail(email, otp);
    res.json({ success: true, message: "OTP sent to email" });
}





export const verifyotp=async (req,res)=>{
    try {
    let { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP required" });
    }

    const enteredOtp = otp.toString().trim();


    const otpDoc = await Otp.findOne({ email });
    if (!otpDoc) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (otpDoc.expiresAt < Date.now()) {
      await Otp.deleteMany({ email });
      return res.status(400).json({ message: "OTP expired" });
    }

    const isMatch = await bcrypt.compare(enteredOtp, otpDoc.otp);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

 otpDoc.verified = true;
    await otpDoc.save();

    res.json({
      success: true,
      message: "Email verified successfully",
    });

  } catch (error) {
    console.error("verifyOtp error:", error);
    res.status(500).json({ message: "OTP verification failed" });
  }
}

export const userregistration=async(req,res)=>{
    
    try{
        const {email,password,name ,phoneno}=req.body

           const otpDoc = await Otp.findOne({ email });

    if (!otpDoc || !otpDoc.verified) {
      return res.status(400).json({
        message: "Please verify your email first",
      });
    }

      if (!email || !password || !name || !phoneno) {
    return res.status(400).json({
      message: "Email, password, and phone number are required",
    });
  }

    //   const existingUser = await user.findOne({ email });
    // if (existingUser) {
    //   return res.status(400).json({ message: "User already exists" });
    // }

const hashedPassword = await bcrypt.hash(password, 10);

 const User = await user.create({
    name,
    email,
    password: hashedPassword,
    phoneno,
    isEmailVerified: true,
  });

  res.status(201).json({
    success: true,
    message: "Registration successful",
  });
  await Otp.deleteMany({ email });
    }catch(error){
        console.error("registerUser error:", error);
        res.status(500).json({ message: "Registration failed" });

    }
    
} 

 export const userLogin= async (req,res)=>{
  try{
  const {email,password}=req.body
   const useremail= await user.findOne({email})
   if(!useremail){
    return res.status(400).json({ message: "Invalid email or password" });
   }

   if(!useremail.isEmailVerified){
    return res.status(403).json({ message: "Please verify your email" });
   }
     const  passwordMatch= await bcrypt.compare(password ,useremail.password)
   if(!passwordMatch){
    return res.status(400).json({ message: "Invalid email or password" });
   }

    const token = jwt.sign(
      {
        id: useremail._id,
        email: useremail.email,
        role: "user",
      },
      process.env.JWT_SECRET,
     { expiresIn: "7d" } 
    );

//     const refreshToken = jwt.sign(
//   { id: useremail._id },
//   process.env.JWT_REFRESH_SECRET,
//   { expiresIn: "7d" }
// );


     res.status(200).json({
      success: true,
      token,
      user: {
        id: useremail._id,
        email: useremail.email,
        name: useremail.name,
      },
    });
  }catch(error){
    console.error("User login error:", error);
     res.status(500).json({ message: "Login failed" });
  }
 }


 export const googleLogin=  async (req,res)=>{
  try {
    const { email, name, uid } = req.body;

    let userData = await user.findOne({ email });

    if (!userData) {
      userData = await user.create({
        email,
        name,
        googleUid: uid,
        provider: "google",
        isEmailVerified: true,
      });
    }

    const token = jwt.sign(
      {
        id: userData._id,
        email: userData.email,
        role: "user",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      token,
      User: userData,
    });

  } catch (error) {
    res.status(500).json({ message: "Google login failed" });
  }





  
//   try{

//    const {email, name, uid }=req.body
//    const exsistinguser= await user.findOne({email})
//    if(exsistinguser){
//     return res.json({ message: "Login success",exsistinguser });
//    }

//     const newUser= await  user.create({
//       email,
//     name,
//     googleUid: uid,
//     provider: "google",
//      isEmailVerified: true,

//     })
//      return res.json({ message: "Registered via Google", user: newUser });
//   }catch(error){
//      console.error("Google login error:", error);
//     res.status(500).json({ message: "Google login failed" });
//   }
   
 }

export const sendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const User = await user.findOne({ email });

    if (!User) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 🔢 Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedOtp = await bcrypt.hash(otp, 10);

    // Remove old reset OTPs
    await Otp.deleteMany({ email, type: "reset" });

   await Otp.create({
    email,
    otp: hashedOtp,
   type: "reset",
  expiresAt: Date.now() + 5 * 60 * 1000,
});

    await sendEmail(email, otp);

    res.json({
      success: true,
      message: "OTP sent to email",
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};



export const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await Otp.findOne({
      email,
      type: "reset",
    }).sort({ createdAt: -1 });   // ⭐ latest OTP

    if (!record) {
      return res.status(400).json({
        message: "OTP not found",
      });
    }

    if (record.expiresAt < Date.now()) {
      await Otp.deleteMany({ email, type: "reset" });

      return res.status(400).json({
        message: "OTP expired",
      });
    }

    const isMatch = await bcrypt.compare(
      otp.toString(),
      record.otp
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    record.verified = true;
    await record.save();

    res.json({
      success: true,
      message: "OTP verified",
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        message: "Email and new password are required",
      });
    }

    // 🔒 Check OTP verified
        const record = await Otp.findOne({
        email,
        type: "reset",
        verified: true,
      }).sort({ createdAt: -1 });

    if (!record) {
      return res.status(400).json({
        message: "OTP not verified",
      });
    }

    // 🔍 Find user
    const User = await user.findOne({ email });

    if (!User) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    User.password = hashedPassword;
    await User.save();

    // 🧹 Remove OTP after success
    await Otp.deleteMany({ email, type: "reset" });

    res.json({
      success: true,
      message: "Password reset successful",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};


 export const  addToWishlist=async (req, res)=>{
  try{
  const  userid=req.userId;
  const {productId }=req.params


  const item= await whishlist.create({
    user:userid,
    product:productId,
  })

  res.status(201).json({message: "Added to wishlist", item })
}catch(error){
  if (error.code === 11000) {
      return res.status(400).json({ message: "Already in wishlist" });
    }
    res.status(500).json({ message: "Server error" });
  }
}


export const getWishlist = async (req, res) => {
  try {
    const userId = req.userId;

    const wishlist = await whishlist
      .find({ user: userId })    
      .populate("product");     

    // send only products to frontend
   res.status(200).json(
      wishlist.map((item) => item.product)
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch wishlist" });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.params;

    const deleted = await whishlist.findOneAndDelete({
      user: userId,
      product: productId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Item not found in wishlist" });
    }

    res.status(200).json({ message: "Removed from wishlist" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const AddtoCart=async(req,res)=>{
   try {
      const userId = req.userId;
  const  productId  = req.params.id
   const { size } = req.body;

     if (!size) {
    return res.status(400).json({ message: "Size is required" });
  }
 

  let cartData = await cart.findOne({ user: userId });


console.log("before");
console.log(size ,productId,userId);
console.log(req.body);



  if (!cartData) {
    cartData = await cart.create({
      user: userId,
      items: [{ product: productId,size, quantity: 1 }],
     
    });
    console.log("after");
    
    
    
  } else {
    cartData.items = cartData.items || [];
    const index = cartData.items.findIndex(
      i => i.product.toString() === productId &&
      i.size === size
    );

    if (index > -1) {
      cartData.items[index].quantity += 1;
    } else {
      cartData.items.push({ product: productId,size, quantity: 1, });
    }
  }

  await cartData.save();
  const populatedCart = await cartData.populate("items.product");
 


  res.status(200).json(populatedCart);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


export const fetchcart=async (req,res)=>{
try{
 
  const userId = req.userId;

    const cartData = await cart.findOne({ user: userId }).populate("items.product"); 
  
   if (!cartData) {
      return res.status(200).json([]);
    }
   res.status(200).json(cartData.items);
   
   
}catch(error){
console.error("FETCH CART ERROR:", error);
    res.status(500).json({ message: error.message });
}
}

export const updateCartQty = async (req, res) => {
  const { productId, action ,size} = req.body;
  const userId = req.userId;
  
  const cartData = await cart.findOne({ user: userId });

  if (!cartData) return res.status(404).json("Cart not found");

  const item = cartData.items.find(
    (i) => i.product.toString() === productId &&
    i.size === size
  );

  if (!item) return res.status(404).json("Item not found");

  if (action === "inc") item.quantity += 1;
  if (action === "dec" && item.quantity > 1) item.quantity -= 1;

  await cartData.save();
  await cartData.populate("items.product");

  res.json(cartData.items);
};

export const deleteCartItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const userId = req.userId;
    // if (!directItem) {
    const cartData = await cart.findOne({ user: userId });
    // }
    console.log(cartData);
    
    if (!cartData) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cartData.items = cartData.items.filter(
      (item) => item._id.toString() !== itemId
    );

    await cartData.save();
    await cartData.populate("items.product");

    res.status(200).json(cartData.items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const fetchuser= async (req,res)=>{
 try{
 const userid=req.userId
  
    const users= await user.findOne({_id:userid})
    console.log(users);
      if (!users) {
      return res.status(404).json({ message: "User not found" });
    }
    
    
    res.json({
      success:true,
      data:users
    })
  }catch(error){
    res.status(500).json({message:"server error"})
  }
}




export const addAddress=async (req,res)=>{
try {
    const userId = req.userId;  
    const {
      name,
      phone,
      pincode,
      houseNumber,
      addressLine,
      locality,
      city,
      district,
      state,
      addressType,
      isDefault,
    } = req.body;

     const count = await Address.countDocuments({ user: userId });

    let finalIsDefault = isDefault;

    // ⭐ FIRST ADDRESS → FORCE DEFAULT
    if (count === 0) {
      finalIsDefault = true;
    }

    // ⭐ IF NEW DEFAULT → UNSET OLD DEFAULT
    if (finalIsDefault) {
      await Address.updateMany(
        { user: userId },
        { isDefault: false }
      );
    }

    // Example: push address into user document
    const userAddress = await Address.create(
      {
          user: userId,
          name,
          phone,
          pincode,
          houseNumber,
          addressLine,
          locality,
          city,
          district,
          state,
          addressType,
          isDefault: finalIsDefault,
      }
    )


    res.status(200).json({
      success: true,
      message: "Address added successfully",
      data: userAddress,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const getAddresses = async (req, res) => {
  try {
    const userId = req.userId;

    const addresses = await Address.find({ user: userId }).sort({
      createdAt: -1,
    });
    const hasDefault = addresses.some(a => a.isDefault);

      if (!hasDefault && addresses.length > 0) {
        addresses[0].isDefault = true;
        await addresses[0].save();
      }


    res.status(200).json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);    
    console.log(req.body.isDefault);
    
     if (req.body.isDefault) {
      await Address.updateMany(
        { user: req.userId },
        { isDefault: false }
      );
    }
    const updated = await Address.findOneAndUpdate(
      { _id: id, user: req.userId },
      req.body,
      { new: true }
    );
      console.log("hy");     
    if (!updated) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.status(200).json({
      message: "Address updated",
      address: updated,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Address.findOneAndDelete({
      _id: id,
      user: req.userId
    });

    if (!deleted) {
      return res.status(404).json({ message: "Address not found" });
    }
     if (deleted.isDefault) {
      const another = await Address.findOne({
        user: req.userId
      });

      if (another) {
        another.isDefault = true;
        await another.save();
      }
    }

    res.status(200).json({
      message: "Address deleted successfully",
      id: deleted._id,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId; // from authMiddleware
    const { name, phoneno } = req.body;

    // basic validation
    if (!name || !phoneno) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const updatedUser = await user.findByIdAndUpdate(
      userId,
      {
        name,
        phoneno
      },
      { new: true } 
    ).select("-password"); 

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};




export const applycoupon=async(req,res)=>{
  const code=req.body.code
  const userid=req.userId
 
  
  
if (!code) {
  return res.status(400).json({ message: "Coupon code is required" });
}
  const coupon=await Coupon.findOne({code:code.toUpperCase(),
    status:"active"
  })
 
  
  try{
    if (!coupon) {
      return res.status(400).json({ message: "Invalid coupon code" });
    }

    const now = new Date();
    if (now < coupon.startDate || now > coupon.expiryDate) {
      return res.status(400).json({ message: "Coupon expired or not active yet" });
    }
    
    
     const Cart = await cart.findOne({ user: userid }).populate(
      "items.product"
    );
 
    
    
    if (!Cart || Cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

     const subtotal = Cart.items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);


     if (subtotal < coupon.minOrderValue) {
      return res.status(400).json({
        message: `Minimum order ₹${coupon.minOrderValue} required`,
      });
    }

     let discount = 0;

    if (coupon.type === "PERCENT") {
      discount = (subtotal * coupon.value) / 100;
    } else {
      discount = coupon.value;
    }
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
    
     const tax = subtotal * 0.08;
    const total = subtotal + tax - discount;
 
    console.log(coupon._id);
    console.log(discount);
    console.log(total);
    
    
    

Cart.coupons.push({
  appliedCoupon: coupon._id,
  discount: discount,
  total: total
});
await Cart.save();

     return res.json({
      subtotal,
      tax,
      discount,
      total,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
      },
    });

  }catch(error){
     console.error(error);
    res.status(500).json({ message: "Server error" });
  }
  }


  export const addMoney=async(req,res)=>{
    try{
      const userid=req.userId     
      const {amount}=req.body
      
        if (!amount || amount <= 0) {
          return res.status(400).json({ message: "Invalid amount" });
        }
        
        const wallet = await Wallet.findOne({ user: userid });
        if(!wallet){
        let wallet = await Wallet.findOne({ userId: userid });
       
              if (!wallet) {
        wallet = await Wallet.create({
          userId: userid,
          balance: 0,
          isActive: true
        });
      }
        }

        
       const wallett = await Wallet.findOneAndUpdate(
       { userId: userid },
       { $inc: { balance: Number(amount) } },
       { new: true });
       if (!wallett) {
          return res.status(404).json({ message: "Wallet not found" });
        }
       

        const transaction = await WalletTransaction.create({
  userId: userid,
  walletId: wallett._id,
  type: "credit",
  amount: Number(amount),
  reason: "Wallet recharge",
  status: "success"
});

await Transactions.create({
  userId: userid,
  amount: Number(amount),
  type: "credit",
  category: "wallet_topup",
  paymentMethod: "upi", // or razorpay
  status: "success",
  description: "Wallet recharge",
});

      res.status(200).json({ message: "Money added successfully", balance: wallett.balance });        



        
    }catch(error){
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }


  export const fetchWallet=async(req,res)=>{
    try{
      const userid=req.userId
      const wallet = await Wallet.findOne({ userId: userid });

    if (!wallet) {
      return res.json({
        balance: 0,
        transactions: []
      });
    }

    res.json(wallet);
    }catch(error){
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }

  export const fetchWalletTransactions=async(req,res)=>{
  try {
    console.log("hy");
     const userid=req.userId
    console.log(userid);
    
    
    const transactions = await WalletTransaction.find({  userId: userid}).sort({ createdAt: -1 });
    console.log(transactions);
    
    res.json(transactions);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
  

export const placeOrder = async (req, res) => {
  try {
    console.log("hy");
    
    const userid = req.userId;
    const { selectedAddressId, selectedPayment, directItem } = req.body;
    console.log(selectedPayment,selectedAddressId,directItem);
    
 
    const address = await Address.findById(selectedAddressId);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
   
    
    // 📦 2️⃣ Build items (cart OR direct)
    let items = [];
    let Cart = null;

    if (directItem) {
      // DIRECT BUY NOW
      const product = await Product.findById(directItem._id);

      if (!product)
        return res.status(404).json({ message: "Product not found" });

      if (product.stock < 1)
        return res.status(400).json({ message: "Out of stock" });

      if (!directItem.size)
        return res.status(400).json({ message: "Size required" });

      items.push({
        product: product._id,
        name: product.productName,
        price: product.price,
        size: directItem.size,
        quantity: 1,
        image: product.image?.[0]?.url,
      });

    } else {
      //  CART CHECKOUT
      Cart = await cart.findOne({ user: userid }).populate("items.product");

      if (!Cart || Cart.items.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }
     
      

      items = Cart.items.map((item) => ({
        product: item.product._id,
        name: item.product.productName,
        price: item.product.price,
        size: item.size,
        quantity: item.quantity,
        image: item.product.image?.[0]?.url,
      }));
    }


    //  Check stock availability
    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product || product.stock < item.quantity) {
        return res.status(400).json({
          message: `${item.name} is out of stock`,
        });
      }
    }

    //  Calculate subtotal
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  
    
    //  Apply coupon (only for cart)
    let discount = 0;
    let appliedCoupon = null;


    const couponData = Cart?.coupons?.[Cart.coupons.length - 1];

console.log(couponData);

    if (couponData?.appliedCoupon) {
      const coupon = await Coupon.findById(couponData.appliedCoupon);
      if (coupon && coupon.status === "active") {
        const now = new Date();
        if (
          (!coupon.startDate || now >= coupon.startDate) &&
          (!coupon.expiryDate || now <= coupon.expiryDate)
           ) {
          if (subtotal >= coupon.minOrderValue) {

            if (coupon.type === "PERCENT") {
              discount = (subtotal * coupon.value) / 100;
            } else {
              discount = coupon.value;
            }

            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
              discount = coupon.maxDiscount;
            }

            appliedCoupon = coupon;

          } else {
            return res.status(400).json({
              message: `Minimum order ₹${coupon.minOrderValue} required`,
            });
          }
        } else {
          return res.status(400).json({
            message: "Coupon expired or not active",
          });
        }
      }
    }
    console.log("hy");
    
    //  Tax & Shipping
    const tax = subtotal * 0.05;
    const shipping = subtotal > 500 ? 0 : 40;

    let total = subtotal + tax + shipping - discount;
    total = Math.max(0, total);
    console.log(total);
    
    //  Payment handling
    let paymentStatus = "pending";

    if (selectedPayment === "wallet") {
      const wallet = await Wallet.findOne({ userId: userid });

      if (!wallet || wallet.balance < total) {
        return res.status(400).json({
          message: "INSUFFICIENT_WALLET_BALANCE",
        });
      }

      wallet.balance -= total;
      await wallet.save();

      await WalletTransaction.create({
        userId: userid,
        walletId: wallet._id,
        type: "debit",
        amount: total,
        reason: "Order payment",
        status: "success",
      });

      paymentStatus = "paid";
      
    }
    if (selectedPayment === "razorpay") {
      paymentStatus = "paid";
    }


    // 📉 8️⃣ Reduce stock
  console.log("ok");
  
    
    // 🧾 9️⃣ Create order
    const order = await Order.create({
      user: userid,

      items: items,   // ⭐ FINAL SNAPSHOT

      shippingAddress: {
        name: address.name,
        phone: address.phone,
        addressLine: address.addressLine,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
      },

      paymentMethod: selectedPayment,
      paymentStatus,

      subtotal,
      tax,
      shipping,
      totalAmount: total,

      coupon: appliedCoupon
        ? {
            couponId: appliedCoupon._id,
            code: appliedCoupon.code,
            type: appliedCoupon.type,
            value: appliedCoupon.value,
            discountAmount: discount,
          }
        : null,
    });

      for (const item of items) {
      await Product.updateOne(
        { _id: item.product },
        { $inc: { stock: -item.quantity } }
      );
    }
    console.log("hy");

    // 🧹 1️⃣0️⃣ Clear cart ONLY for cart checkout
    if (!directItem) {
      await cart.findOneAndDelete({ user: userid });
    }
console.log(1);

    // 💳 1️⃣1️⃣ Transaction log
    await Transactions.create({
      userId: userid,
      amount: total,
      type: "debit",
      category: "order_payment",
      paymentMethod: selectedPayment,
      status: paymentStatus === "paid" ? "success" : "pending",
      referenceId: order._id,
      description: "Order payment",
    });
console.log(2);

    // ✅ 1️⃣2️⃣ Success response
    res.json({
      success: true,
      message: "Order placed successfully",
      orderId: order._id,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


  export const getOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await Order.find({ user: userId }) .sort({ createdAt: -1 }); // latest first
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getOrderById = async (req, res) => {
  try {   
    const { orderId } = req.params;
    const userId = req.userId;
    const order = await Order.findOne({
      _id: orderId,
      user: userId, // 🔒 security
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.userId // from auth middleware
    
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 🚫 Cannot cancel after shipping
    // if (order.orderStatus !== "processing") {
    //   return res
    //     .status(400)
    //     .json({ message: "Order cannot be cancelled now" });
    // }

    // ✅ Update status
    order.orderStatus = "cancelled";

    await order.save();

    // If paid order → refund to wallet
if (order.paymentStatus === "paid") {
  const wallet = await Wallet.findOne({ userId: userId });

  wallet.balance += order.totalAmount;
  await wallet.save();

   await WalletTransaction.create({
        userId,
        walletId: wallet._id,
        type: "credit",
        amount: order.totalAmount,
        reason: "Order refund",
        orderId: order._id,
        status: "success",
      });

  await Transactions.create({
    userId,
    amount: order.totalAmount,
    type: "credit",
    category: "refund",
    paymentMethod: "wallet",
    status: "success",
    referenceId: order._id,
    description: "Order refund",
  });
}
    
    res.json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


export const changePassword = async (req, res) => {
  try {
    const userid = req.userId
    const { currentPassword, newPassword } = req.body;    
    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Get user
    const User = await user.findById({ _id: userid });

    if (!User) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check current password
    const isMatch = await bcrypt.compare(
      currentPassword,
      User.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    User.password = hashedPassword;
    await User.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};




export const addFeedback = async (req, res) => {
  try {
    
    const { productId, rating, message, type } = req.body ;
    if (!productId || !message || !type) {
      return res.status(400).json({ message: "Missing required fields" })
    }
    if (type === "review" && !rating) {
      return res.status(400).json({ message: "Rating is required for review" })
    }
    // 🔒 Prevent duplicate reviews
    if (type === "review") {
      const existing = await Feedback.findOne({
        user: req.userId,
        product: productId,
        type: "review"
      })
      if (existing) {
        return res.status(400).json({ message: "You already reviewed this product" })
      }
    }
    // ✅ Check verified buyer
    const hasPurchased = await Order.findOne({
      user: req.userId,
      "items.product": productId
    })
    const isVerified = !!hasPurchased
    const feedback = await Feedback.create({
      user: req.userId,
      product: productId,
      rating,
      message,
      type,
      isVerified
    })  
    res.status(201).json(feedback)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to submit feedback" })
  }
}

export const getProductReviews = async (req, res) => {
  try { 
   const reviews = await Feedback.find({product: req.params.productId,type: "review"}).sort({ createdAt: -1 })
    res.json({ data: reviews })
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews" })
  }
}


export const getUserTransactions = async (req, res) => {
  try {
    const userid = req.userId;
    console.log(userid);
    
    const transactions = await Transactions.find({ userId: userid }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};





