import nodemailer from "nodemailer"


     // Create a transport with your SMTP server settings
const transporter=nodemailer.createTransport({
     host: "smtp.gmail.com",
        port: 587,
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})
// Send an email using mixed address formats
export const sendEmail=async (to,otp)=>{
    console.log("Length:", process.env.EMAIL_PASS?.length);
    try{
    console.log("📨 Sending email to:", to);
   const info= await transporter.sendMail({
        from: `"CARTZA" <${process.env.EMAIL_USER}>`,
        to, 
        subject: "Your OTP Code",
        text: `Your OTP is: ${otp}`,

    })
      console.log("✅ Email sent successfully");
    console.log(info)
    return info;
}catch(error){
    console.error("❌ Email sending failed:");
    console.error(error);
    throw error;
}
}