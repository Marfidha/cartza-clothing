import nodemailer from "nodemailer"

const transporter=nodemailer.createTransport({
     host: "smtp.gmail.com",
        port: 465,
        secure: true,
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})

export const sendEmail=async (to,otp)=>{
    console.log("📨 Sending email to:", to);
    await transporter.sendMail({
        from: `"CARTZA" <${process.env.EMAIL_USER}>`,
        to, 
        subject: "Your OTP Code",
        text: `Your OTP is: ${otp}`,

    })
}