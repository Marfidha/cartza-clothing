import Coupon from "../models/Coupon.js";
import user from "../models/User.js"
import MainCategory from "../models/MainCategory.js";
import SubCategory from "../models/SubCategory.js";
import Order from "../models/Order.js"
import Feedback from "../models/Feedback.js"
import product from "../models/Product.js"
import Address from "../models/Address.js"




export const addcategory=async(req,res)=>{
  try {
    
    const { name, banner, isActive } = req.body;
     const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    const newCategory = await MainCategory.create({
      name,
      slug,
      banner,   // already Cloudinary URL
      isActive,
    });

    res.status(201).json(newCategory);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const getMainCategories = async (req, res) => {
  try {
    const categories = await MainCategory.find()
  .sort({ createdAt: -1 });

    return res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories" });
  }

}

export const updateCategory = async (req, res) => {
  try {
    const { name, banner, isActive } = req.body;

    const updated = await MainCategory.findByIdAndUpdate(
      req.params.id,
      { name, banner, isActive },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};


export const toggleCategory = async (req, res) => {
  try {
    const category = await MainCategory.findById(req.params.id);

    if (!category)
      return res.status(404).json({ message: "Not found" });

    category.isActive = !category.isActive;
    await category.save();

    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Toggle failed" });
  }
};


export const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;

    const category = await MainCategory.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await MainCategory.findByIdAndDelete(id);

    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

export const addsubcategory=async(req,res)=>{
  try {
    const { name, mainCategoryId } = req.body;

    const sub = await SubCategory.create({
      name,
      mainCategory: mainCategoryId,
    });

    res.json({ success: true, data: sub });
  }catch(error){
    res.status(500).json({message:"failed to add subcategory"})
  }
}

export const getsubcategories=async(req,res)=>{
  try{
    const subcategories=await SubCategory.find().populate("mainCategory","name")
    res.json(subcategories)
  }catch(error){
    res.status(500).json({message:"failed to fetch subcategories"})
  }
}


export const addcoupon=async(req,res)=>{

   const { code,
  discountType,
  discountValue,
  minOrderAmount,
  maxDiscount,
  usageLimit,
  oneTimePerUser,
  startDate,
  expiryDate,
  status} = req.body.couponData
  console.log(req.body);

    if (!code) {
      return res.status(400).json({ message: "Coupon code is required" });
    }

     try{
const value = Number(discountValue);
const minOrderValue = Number(minOrderAmount || 0);
const maxDiscountValue = maxDiscount ? Number(maxDiscount) : undefined;
const usageLimitValue = usageLimit ? Number(usageLimit) : null;

console.log("STEP 2: Converted values", {
  value,
  minOrderValue,
  maxDiscountValue,
  usageLimitValue,
});
     

//     if ([value, minOrderValue, maxDiscountValue, usageLimitValue].some(v => Number.isNaN(v))) {
//   return res.status(400).json({ message: "Numeric fields must be valid numbers" });
// }

// if (new Date(expiryDate) <= new Date(startDate)) {
//   return res.status(400).json({ message: "Expiry date must be after start date" });
// }
  const coupon = await Coupon.create({
      code,
      type: discountType === "percentage" ? "PERCENT" : "FLAT",
      value,
      minOrderValue,
      maxDiscount:maxDiscountValue,
      usageLimit:usageLimitValue,
      oneTimePerUser,
      startDate,
      expiryDate,
      status ,
    });

    res.status(201).json({
      success: true,
      coupon,
    });
  }catch(error){
    res.status(500).json({message:"not done"})
  }
  
}

export const fetchcoupons=async (req,res)=>{
  try{
    const coupons=await Coupon.find()
    res.status(200).json(coupons)
  }catch(err){
    res.status(500).json({message:"failed to fetch coupons"})
  }
}
export const deletecoupon=async (req,res)=>{
try {
    await Coupon.findByIdAndDelete(req.params.id);

    res.json({ message: "Coupon deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const updatecoupon=async (req,res)=>{
try {
  console.log("hy");
  
    const updated = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

}



export const customers = async (req, res) => {
  try {
    const users = await user.find();

    // 🔥 Attach order count to each user
    const customersWithOrders = await Promise.all(
      users.map(async (u) => {
        const orderCount = await Order.countDocuments({
          user: u._id,
        });

        return {
          ...u.toObject(),
          orderCount,
        };
      })
    );

    res.json(customersWithOrders);

  } catch (error) {
    res.status(500).json({ message: "failed" });
  }
};



export const getCustomerById = async (req, res) => {
  try {
    const userId = req.params.id;

    const customer = await user.findById(userId);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // 🔥 Get user's orders
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 });

    // 🔥 Get user's addresses
    const addresses = await Address.find({ user: userId });

    // 🔥 Send combined response
    res.json({
      ...customer.toObject(),
      orders,
      addresses,
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


export const getAllOrders = async (req, res) => {
  try {
    console.log("h");
    
    const orders = await Order.find()
      .populate("user", "name email")     // user info
      .populate("items.product", "name")  // product info
      .sort({ createdAt: -1 });
      console.log(orders);
      

    res.status(200).json(orders);

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};


export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email") // customer info
      .populate("items.product", "name image");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};





// GET /api/admin/report

export const getReport = async (req, res) => {
  try {
    const totalRevenue = await Order.aggregate([
      { $match: { status: "Delivered" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    const totalOrders = await Order.countDocuments();

    const totalCustomers = await user.countDocuments();

    const avgOrderValue =
      totalRevenue[0]?.total / (totalOrders || 1);

    // Top products
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.quantity" }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);

    // Recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name");

    res.json({
      totalRevenue: totalRevenue[0]?.total || 0,
      totalOrders,
      totalCustomers,
      avgOrderValue: avgOrderValue || 0,
      topProducts,
      recentOrders
    });

  } catch (err) {
    res.status(500).json({ message: "Report failed" });
  }
};


// GET /api/admin/sales-chart

// export const salesChart = async (req, res) => {
//   const last7Days = new Date();
//   last7Days.setDate(last7Days.getDate() - 7);

//   const data = await Order.aggregate([
//     { $match: { createdAt: { $gte: last7Days } } },
//     {
//       $group: {
//         _id: { $dayOfMonth: "$createdAt" },
//         revenue: { $sum: "$totalAmount" }
//       }
//     },
//     { $sort: { _id: 1 } }
//   ]);

//   res.json(data);
// };


// controllers/adminReport.js
export const getAllFeedbacks = async (req, res) => {
  try {

    const raw = await Feedback.find();
    const feedbacks = await Feedback.find().populate("user").populate("product").sort({ createdAt: -1 });
    res.json({ data: feedbacks });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch feedbacks" });
  }
};

export const resolveFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" })
    }

    feedback.status = "resolved"
    await feedback.save()

    res.json(feedback)
  } catch (err) {
    res.status(500).json({ message: "Failed to resolve" })
  }
}


export const getSalesReport = async (req, res) => {
  try {
    const { from, to } = req.query;

    // ===== BASE MATCH =====
    let match = {
      orderStatus: "Delivered"
    };

    // ===== DATE FILTER =====

    if (from && to) {
      // Apply selected range
      match.createdAt = {
        $gte: new Date(from),
        $lte: new Date(to)
      };
    } else {
      // 🔥 SHOW ALL DATA (fallback)
      match.createdAt = {
        $gte: new Date("2020-01-01")
      };
    }

    // ===== DAILY SALES AGGREGATION =====
    const dailySales = await Order.aggregate([
      { $match: match },

      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
          },
          orders: { $sum: 1 },
          totalSales: { $sum: "$totalAmount" }
        }
      },

      {
        $project: {
          date: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: "$_id.day"
            }
          },
          orders: 1,
          totalSales: 1,
          _id: 0
        }
      },

      { $sort: { date: -1 } }
    ]);

    // ===== TOTAL KPI DATA =====
    const totals = await Order.aggregate([
      { $match: match },

      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 }
        }
      }
    ]);

    const totalRevenue = totals[0]?.totalRevenue || 0;
    const totalOrders = totals[0]?.totalOrders || 0;
    const avgOrderValue =
      totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // ===== RESPONSE =====
    res.json({
      totalRevenue,
      totalOrders,
      avgOrderValue,
      dailySales
    });

  } catch (err) {
    console.error("Sales report error:", err);
    res.status(500).json({
      message: "Failed to generate sales report"
    });
  }
};


export const getDashboardData = async (req, res) => {
  try {
    // ===== COUNTS =====
    const totalOrders = await Order.countDocuments();

    const pendingOrders = await Order.countDocuments({
      orderStatus: "processing",
    });

    const totalCustomers = await user.countDocuments();

    // ===== TOTAL SALES (only delivered) =====
    const salesData = await Order.aggregate([
      { $match: { orderStatus: "delivered" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const totalSales = salesData[0]?.total || 0;

    // ===== RECENT ORDERS =====
    const recentOrders = await Order.find()
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalOrders,
      totalSales,
      totalCustomers,
      pendingOrders,
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ message: "Dashboard error", error });
  }
};




