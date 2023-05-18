import jwt from "jsonwebtoken";
import {User} from '../models/user.js'

export const authentication=async(req,res,next)=>{
try {
    
    const {token}=req.cookies;

    if(!token){
        return res.status(401).json({sucess:false,message:'Login First'})
    }
    const decode=jwt.verify(token,'rrrrrrrrrrrrrrrrrrrrrrrrrr')
     req.user= await User.findById(decode._id)
     next()
} catch (error) {
    res.status(500).json({sucess:false,message:error})
    
}
    

}
