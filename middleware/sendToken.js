import { User } from "../models/user.js"

export const sendToken=(res,user,statusCode,message)=>{
    const token=user.getJWTToken()

    const options={
        httpOnly:true,
        expires:new Date(Date.now()+2*24*60*60*1000)
        }

    const data={
        _id:user._id,
        name:user.name,
        email:user.email,
        avatar:user.avatar,
        task:user.task,
        verified:user.verified
    }
    
    
res.status(statusCode).cookie("token",token,options).json({
    sucess:true,
    message,
    user:data
})

}

