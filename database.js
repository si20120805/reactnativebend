import mongoose from "mongoose";

export const db=async()=>{
    

  const {connection}=await mongoose.connect(process.env.DB)
 console.log(`connection ${connection.host}`)
}


