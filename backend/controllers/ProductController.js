import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";
import { generateSku } from "../utils/genarateSKU.js";
import MainCategory from "../models/MainCategory.js";


export const addproduct= async (req,res)=>{
     console.log(req.body);
     try{

        if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No images uploaded" });
        }

        

        // 🔹 upload all images to Cloudinary
   const images= await Promise.all(
        req.files.map((file ,index)=>{
          return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              
              { folder: "product" },
            
              (error, result) => {
                if (error) reject(error);
                else resolve(
                  {
                  url: result.secure_url,
              public_id: result.public_id,
               } );
              }
              
            ).end(file.buffer);
          });
        })
      );


    
    const { mainCategory, subCategory, color } = req.body;

    const sku = await generateSku(mainCategory, subCategory, color);


       const sizess = req.body["size"];


       const newproduct=new Product({

             productName: req.body.productname,
             sku,
             mainCategory: req.body.mainCategory,
             subCategory: req.body.subCategory,
              size: Array.isArray(sizess) ? sizess : [sizess],
             description:req.body.description,
             color:req.body.color,
             material:req.body.material,
             price:Number(req.body.price),
             stock:Number(req.body.stock),
             status:req.body.status === "true",
             image:images
            //  image: req.files.map(File=>File.filename)

    })

      await newproduct.save()
    
    
    res.json({success:true, message:"product added"})
    
     }catch(error){
      
 console.error("❌ ADD PRODUCT ERROR:", error);
  if (error.code === 11000) {
      return res.status(400).json({ message: "SKU already exists" });
    }
  return res.status(500).json({
    success: false,
    message: error.message,
  });
        
    }
}

// $or: [
    //   // { isDeleted: false },
    //   // { isDeleted: { $exists: false } }
    // ]

export const getallproduct=async (req,res)=>{
    const products = await Product.find() .populate("mainCategory", "name")
      .populate("subCategory", "name");;
  res.json(products);
}




export const softdelete =async (req ,res)=>{
     try{
 const product = await Product.findByIdAndUpdate(
  req.params.id,
  {
    isDeleted:true,
    deletedAt: new Date()
  },
  {
    new:true
  }
 )
 if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
 res.json({ message: "product soft deleted", product });
}catch(err){
res.status(500).json({ message: "Server error" });
}
}




export const deletedproduct=async (req,res)=>{
    const softdeletedproducts= await Product.find({isDeleted:true})
  console.log("DELETED PRODUCTS FROM DB:", softdeletedproducts);
  res.json(softdeletedproducts)

}




export const restoreproduct=async (req,res)=>{
    try{
 const product = await Product.findByIdAndUpdate(
  req.params.id,
  {
    isDeleted:false,
    deletedAt: null
  },
  {
    new:true
  }
 )

 if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
 res.json({ message: "restored the product", product });
}catch(err){
res.status(500).json({ message: "Server error" });
}
}



export const replaceoneimage=async (req,res)=>{
     try {
      const { index } = req.body;
      const { id } = req.params;

      if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
      }

      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const oldImage = product.image[index];
      if (!oldImage) {
        return res.status(400).json({ message: "Invalid image index" });
      }

      // 🔥 REPLACE IMAGE USING SAME public_id
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            public_id: oldImage.public_id, // SAME ID
            overwrite: true,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });

      // Update URL (good practice)
      product.image[index].url = result.secure_url;
      await product.save();

      res.json({
        success: true,
        message: "Image replaced successfully",
        image: product.image[index],
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  
}


export const productbycatogary= async (req,res)=>{
 
  const { slug } = req.query;
console.log(slug);


  try {
    const categoryDoc = await MainCategory.findOne({
      slug: slug
    });
    console.log(categoryDoc);
    

    if (!categoryDoc) {
      return res.status(404).json({ message: "Category not found" });
    }
console.log("CategoryDoc:", categoryDoc?._id);
const productt=await Product.find()
console.log(productt);

    // 2️⃣ Use ID to get products
    const products = await Product.find({
      mainCategory: categoryDoc._id,
      isDeleted: false
    });
    console.log(products);
    

    res.status(200).json(products);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


export const Oneproduct=async (req, res)=>{
   const product = await Product.findById(req.params.id);
  res.json(product);
}