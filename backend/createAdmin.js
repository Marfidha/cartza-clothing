// import mongoose from "mongoose";
// import dotenv from "dotenv"
// import bycript from "bcryptjs"
// import Admin from "./Models/Admin";


// dotenv.config()

// mongoose.connect(process.env.MONGO_URL).then(async()=>{
//     console.log("connect DB");

//     const email="admin@gmail.com"
//     const password ="admin123"

//     const hashedpassword= await bycript.hash(password,10)

//     await Admin.create({
//         email,
//         password:hashedpassword
//     })
//     console.log("create admin succesfullly");
//     process.exit()
    
    
// }).catch(error => console.log(error))