import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    mainCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MainCategory",
      required: true,
    },

    // isActive: {
    //   type: Boolean,
    //   default: true,
    // },
  },
  { timestamps: true }
);

export default mongoose.model( "SubCategory",subCategorySchema);
