import mongoose from "mongoose";

const mainCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: { 
      type: String,
       required: true, 
       unique: true }, 


    banner: {
      type: String, 
      default: "",
    },


    isActive: {
      type: Boolean,
      default: true,
    },
    // showOnHomepage: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  { timestamps: true }
);

export default mongoose.model( "MainCategory", mainCategorySchema);
