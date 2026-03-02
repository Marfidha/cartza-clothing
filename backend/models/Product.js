import mongoose from "mongoose"

const productSchema=new mongoose.Schema({
  productName:{
    type:String,
    required:true,
    
  } ,
  sku:{
    type:String,
    required:true,
    unique:true
  } ,

  mainCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MainCategory",
    required: true,
  },
    subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
    required: true,
  },
  size:{
    type:[String],
    required:true
  },
  description:{
    type:String,
    required:true,
  },
  color:{
    type:String,
    required:true,
  },
  material:{
    type:String,
    required:true,
  },
  price: {
    type: Number,
    required:true,
  },
//   stockStatus:{
//  type:String,
//  enum:["In Stock","Low","Out of Stock"],
//  default:"In Stock"
// },
 stock: {
  type: Number,
  required: true
},
  status: {
     type: Boolean,
      default: true
    },
  image:[ {
     url: { type: String, required:true },
     public_id:{ type:String, required:true }
  } ],
  isDeleted:{
    type:Boolean,
    default:false
  }

})
export default mongoose.model("product",productSchema)