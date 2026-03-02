import express from "express"
import  authMiddleware  from "../middlewere/authMiddleware.js"
import { addcategory,
     addcoupon,
     addsubcategory,
     customers,
     deleteCategory,
     deletecoupon, 
     fetchcoupons,
     getAllFeedbacks, 
     getAllOrders,
      getCustomerById,
      getDashboardData,
      getMainCategories,
         getOrderById,
          getReport,
           getSalesReport,
            getsubcategories,
             resolveFeedback,
              toggleCategory,
          updateCategory,
           updatecoupon } from "../controllers/AdminController.js"
 

const router = express.Router()

router.post("/addmaincategory",addcategory)
router.get("/maincategories",getMainCategories)
router.put("/updatecategory/:id", updateCategory);
router.patch("/togglecategory/:id", toggleCategory);
router.delete("/deletecategory/:id", deleteCategory);
router.post("/addsubcategory",addsubcategory)
router.get("/subcategories",getsubcategories)
router.post("/addcoupon",addcoupon)
router.get("/fetchcoupon",fetchcoupons)
router.delete("/delete/:id",deletecoupon)
router.put("/update/:id",updatecoupon)
router.get("/customers",customers)
router.get("/customers/:id", getCustomerById);
router.get("/orders",getAllOrders)
router.get("/orders/:id", getOrderById);
router.get("/report",getReport)
router.get("/feedback",getAllFeedbacks)
router.patch("/feedback/:id/resolve", resolveFeedback);
router.get("/sales-report", getSalesReport);
router.get("/dashboard",authMiddleware(["admin"]), getDashboardData);



export default router