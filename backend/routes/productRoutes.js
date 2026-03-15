import express from "express"
import upload from "../middlewere/Multer.js";
import authMiddleware  from "../middlewere/authMiddleware.js";
import {addproduct, deletedproduct, getallproduct, replaceoneimage, restoreproduct, softdelete ,productbycatogary, Oneproduct, getproduct, updateProduct, reorderImages } from "../controllers/ProductController.js";

const router = express.Router()

router.post("/addproduct", upload.array("images",4),addproduct)
router.get("/productbycategory" ,productbycatogary)
router.get("/", getallproduct);
router.get("/:id", getproduct)
router.put("/product/:id",authMiddleware(["admin"]),upload.array("images"), updateProduct)
router.put("/:id/delete",authMiddleware(["admin"]), softdelete)
router.get("/deleted", authMiddleware(["admin"]), deletedproduct)
router.put("/:id/restore",authMiddleware(["admin"]), restoreproduct)
router.post( "/:id/new-img", authMiddleware(["admin"]), upload.single("image"), replaceoneimage);
router.put("/product/:id/reorder-images", authMiddleware(["admin"]),reorderImages);
router.get("/product/:id",Oneproduct)

export default router