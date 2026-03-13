import "dotenv/config";
import express from "express"
import cors from "cors"
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import userRoutes from "./routes/UserRoutes.js"
import AdminRoutes from "./routes/AdminRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js"



const app=express()


app.use(express.json());
connectDB()


// app.use(cors({
//   origin: ['http://localhost:5173/'],
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true
// }));
// app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT","PATCH", "DELETE"],
    credentials: true,
  })
);



app.use("/api/admin/auth", authRoutes)
app.use("/api/product" , productRoutes)
app.use("/uploads", express.static("uploads"));
app.use("/api/user/auth",userRoutes)
app.use("/api/admin",AdminRoutes)
app.use("/api/payment", paymentRoutes);



const port=process.env.PORT

app.listen(port,()=>{ 
    console.log(`server is running at port ${port}`);
})