import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    }
})

export default mongoose.model("Admin",AdminSchema)