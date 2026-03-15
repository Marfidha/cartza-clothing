import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";
import { generateSku } from "../utils/genarateSKU.js";
import MainCategory from "../models/MainCategory.js";


export const addproduct= async (req,res)=>{
     try{

       console.log("FILES:", req.files);
    console.log("BODY:", req.body);

        if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No images uploaded" });
        }
        // upload all images to Cloudinary
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

export const productbycatogary = async (req, res) => {
  const { slug, q } = req.query;
  try {
    // 1️⃣ find category
    const categoryDoc = await MainCategory.findOne({ slug });
    if (!categoryDoc) {
      return res.status(404).json({ message: "Category not found" });
    }
    // 2️⃣ build query object
    const query = {
      mainCategory: categoryDoc._id,
      isDeleted: false
    };
    // 3️⃣ if search exists
    if (q) {
      query.productName = { $regex: q, $options: "i" };
    }
    // 4️⃣ fetch products
    const products = await Product.find(query);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getallproduct=async (req,res)=>{
    const products = await Product.find() .populate("mainCategory", "name")
      .populate("subCategory", "name");;
  res.json(products);
}


export const getproduct=async(req,res)=>{
try{
  const { id } = req.params;
    const product = await Product.findById(id).populate("mainCategory");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
    }catch(err)
    {
    res.status(500).json({ message: err.message });
}}

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    console.log(product)
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.productName = req.body.productname;
    product.mainCategory = req.body.mainCategory;
    product.subCategory = req.body.subCategory;
    product.description = req.body.description;
    product.color = req.body.color;
    product.material = req.body.material;
    product.price = req.body.price;
    product.stock = req.body.stock;
    product.status = req.body.status === "true";
    if (req.body.size) {
      product.size = Array.isArray(req.body.size)
        ? req.body.size
        : [req.body.size];
    }
    await product.save();
    res.json({ message: "Product updated successfully", product });
  } catch (err) {
     console.error("Update Product Error:", err);
  res.status(500).json({ error: err.message });
  }
};

export const softdelete =async (req ,res)=>{
     try{
      console.log("hy");
      
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




export const reorderImages = async (req, res) => {
  try {

    const { images } = req.body;

    const product = await Product.findById(req.params.id);

    product.image = images;

    await product.save();

    res.json({ message: "Image order updated" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const Oneproduct=async (req, res)=>{
   const product = await Product.findById(req.params.id);
  res.json(product);
}