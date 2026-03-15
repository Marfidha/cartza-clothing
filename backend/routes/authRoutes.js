import express from "express"
import  authMiddleware  from "../middlewere/authMiddleware.js"
import { adminlogin, checkauth } from "../controllers/AuthController.js"

const router= express.Router()


  router.post("/login",adminlogin )
  router.get("/check", authMiddleware(["admin"]), checkauth);



export default router;

 
