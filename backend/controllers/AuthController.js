import jwt from 'jsonwebtoken'




const admin={
  email :"admin@gmail.com",
  password:"admin@123#"
}


export const adminlogin =async (req,res)=>{
     try{
            const{email ,password}=req.body;
        
            if(email==admin.email && password==admin.password){
    
    
    
                 const token = jwt.sign(
                  {
                    id: "admin",       // or admin._id if from DB
                    role: "admin"      // ✅ ADD THIS
                  },
                  process.env.JWT_SECRET,
                  { expiresIn: "7d" }
                );
                    
                res.json({
                  success: true,
                  message: "Login successful",
                  token,
                  admin: { email: admin.email }
                });
    
            }else{
               res.json({message:"not done",status:500})
            }      
                } catch (error) {
        res.json({ success: false, message: "Server error" });
      }


}
export const checkauth = async (rea,res)=>{
    return res.json({ success: true, message: "Token is valid" });

}