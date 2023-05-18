import mongoose from "mongoose";
import  jwt  from "jsonwebtoken";

import bcrypt from 'bcryptjs';
const userSchema=mongoose.Schema({

name:{
    type:String,
    required:true
},
email:{
    type:String,
    unique:true
},
password:{
    type:String,
    required:true,
    minlength:[8,"password Required "],
    select: false
},

avatar:{
        public_id:String,
        url:String
},
createdAt:{
    type:Date,
    default:Date.now()

},
task:[
    {
        title:String,
        description:String,
        completed:Boolean,
        createdAt:Date
    }
],
otp:Number,
otp_Expire:Date,
verified:{
    type:Boolean,
    default:false
},
resetpasswordotp:Number,
resetoptexpire:Date,


})
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next();
    }
    const haspass=await bcrypt.hash(this.password,12)
    this.password=haspass
    next()
})
userSchema.methods.getJWTToken=function(){
    return  jwt.sign({_id:this._id},'rrrrrrrrrrrrrrrrrrrrrrrrrr',{
        expiresIn:300000
    })

}
userSchema.methods.comparepassword=async function(password){
    console.log(this.password,password)
     return await  bcrypt.compare(password, this.password)

}

    userSchema.index({otp_Expire:1},{expireAfterSeconds:0});

export const  User=mongoose.model('userNative',userSchema)