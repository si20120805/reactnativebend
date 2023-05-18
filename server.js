import express from "express";
import {config} from 'dotenv'
import { db } from "./database.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cookieParser from "cookie-parser";
import * as fs from 'fs';
import cloudinary from "cloudinary"
import cors from 'cors'


import userRouter from './routes/userRouter.js'
import fileUpload from "express-fileupload";
config()
cloudinary.config({
    cloud_name:'dfxickklb',
    api_key:'995658523894877',
    api_secret:'h-U9ClLS1Mey0p4P7LuYooVQFcE',

})
const app=express();

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(fileUpload({limits:{fileSize:50*1024*1024},useTempFiles:true}))
app.use('/api/av',userRouter)







db() 


app.listen(process.env.PORT,()=>{
     console.log(`server is running on ${process.env.PORT}`)
})