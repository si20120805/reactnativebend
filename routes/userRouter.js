import express from 'express'
import { UpdateTask, forgotPassword, login, logout, myprofile, register,removeTask,resetPassword,taskCreate,updatePassword,updateProfile,verify } from '../controller/banda.js'
import {authentication} from '../middleware/auth.js'

const router=express.Router()  



router.route('/register').post(register)
router.route('/verify').post(authentication,verify)

router.route('/login').post(login)
router.route('/logout').get(logout)

router.route('/getmyprofile').get(authentication,myprofile)
router.route('updateprofile').put(authentication,updateProfile)

router.route('/updatepassword').put(authentication,updatePassword)
router.route('/forgotpassword').post(authentication,forgotPassword)
router.route('/resetpassword').put(authentication,resetPassword)





router.route('/createtask').post(authentication,taskCreate)
router.route('/updatetask/:taskId').get(authentication,UpdateTask)
router.route('/removetask/:taskId').delete(authentication,removeTask)


export default router 
