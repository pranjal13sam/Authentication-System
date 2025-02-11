import mongoose from "mongoose";

//creating schema

const userSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,requried:true},
    verifyOtp:{type:String,default:''},
    verifyOtpExpireAt:{type:Number,default:0},
    isAccountVerified:{type:Boolean,default:false},
    resetOtp:{type:String,default:''},
    resetOtpExpireAt:{type:Number,default:0},
})

//first it will search for userModel if it is available then the existing model will be used else newModel will be created
const userModel=mongoose.models.user||mongoose.model('user',userSchema)


export default userModel;