import { createTransport } from "nodemailer";
import nodemailer from 'nodemailer'


export const sendMail=async(email,subject,text)=>{
    
const transport =nodemailer.createTransport({

    host:"smtp.gmail.com",
    port :587,
    service:"Gmail",
    auth:{
        user:"fireguycracker@gmail.com",
        pass:"orllaeeqizqnjwze"
    }

});

await transport.sendMail({

    from:process.env.MAIL_USER,
    to:email,
    text,
})
}
