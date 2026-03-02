import mongoose, { Schema } from "mongoose";

const UserSchema  = new mongoose.Schema({
    
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        default:null
        // required:true
    },
    name:{
        type:String,
        // default:null
        required:true
    },
    phoneno:{
        type:Number,
        default:null
        // required:true
    },
    avater:{
        type:String
    },
     provider: {
    type: String,
    enum: ["local", "google"],
    default: "local"
  },

  googleUid: {
    type: String,
    default: null
  },

    isEmailVerified:{
        type:Boolean,
        default:false
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,

},
   { timestamps: true } 
)

export default mongoose.model("userdata",UserSchema)

