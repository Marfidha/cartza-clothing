import mongoose from "mongoose";


const skucounterSchema=new mongoose.Schema({

    key:{
        type:String,
        unique:true
    },
    seq:{
        type:Number,
        default:0
    }
})


export default mongoose.model("SKU_Counter" ,skucounterSchema)