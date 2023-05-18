import { User } from "../models/user.js";
import { sendMail } from "../middleware/sendMail.js";
import { sendToken } from "../middleware/sendToken.js";
import bcrypt from "bcryptjs";
import cloudinary from "cloudinary";
import fs from "fs";


var options = {
  timeZone: "Asia/Kolkata", // Specify the target time zone
  // Other formatting options can be added as needed
};

export const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    const avatar = req.files.avatar.tempFilePath;
    console.log(avatar);

    let user = User.find({ email });
    if (user.length > 0) {
      return res.status(500).send("already there user");
    }

    const otp = Math.floor(Math.random() * 100000);
    const mycloud = await cloudinary.v2.uploader.upload(avatar, {
      folder: "todoapp",
    });

  
    fs.rmSync("./tmp", { recursive: true });

    user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: mycloud.public_id,
        url: mycloud.secure_url,
      },
      otp,
      otp,
      otp_Expire: new Date(Date.now() + 5 * 60 * 1000),
    });

    await sendMail(email, "verify my account", `your otp ${otp}`);

    sendToken(res, user, 200, "sucessful creted");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const verify = async (req, res, next) => {
  try {
    const otp = req.body.otp;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(500).json({ sucess: false, message: "Invalid OTP" });
    }

    console.log(user.otp_Expire.getTime(), new Date().getTime());

    if (user.otp !== otp || user.otp_Expire.getTime() < new Date().getTime()) {
      return res.status(500).json({ sucess: false, message: "Invalid OTP" });
    }
    user.verified = true;
    user.otp = null;
    user.otp_Expire = null;
    await user.save();
    sendToken(res, user, 200, "Account Verified");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error, sucess: false });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(401)
        .json({ sucess: false, message: "Please Register" });
    }
    const pass = await user.comparepassword(password);
    console.log(pass);
    if (!pass) {
      return res
        .status(401)
        .json({ message: "falied login due to incorrect password and Email" });
    }
    sendToken(res, user, 200, "Login sucessfully");
  } catch (error) {
    console.log(error);

    res.status(501).send(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res
      .status(200)
      .cookie("token", null, { expires: new Date(Date.now()) })
      .json({ message: "Logout sucess", sucess: true });
  } catch (error) {
    res.status(500).json({ sucess: false, message: error });
  }
};

export const taskCreate = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const user = await User.findById(req.user._id);
    user.task.push({
      title,
      description,
      completed: false,
      createdAt: new Date(),
    });

    await user.save();
    res.status(200).json({ message: "Task created Sucessful", sucess: true });
  } catch (error) {
    res.status(500).json({
      message: error,
      sucess: true,
    });
  }
};

export const removeTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const user = await User.findById(req.user._id);
    user.task = user.task.filter(
      (task) => task._id.toString() !== taskId.toString()
    );
    await user.save();

    res.status(200).json({ message: "Task deleted Sucessful", message: true });
  } catch (error) {
    res.status(500).json({
      message: error,
      sucess: true,
    });
  }
};

export const UpdateTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    console.log(req.user._id);
    const user = await User.findById(req.user._id);
    user.task = user.task.find(
      (task) => task._id.toString() === taskId.toString()
    );

    user.task[0].completed = !user.task[0].completed;
    console.log("final", user.task);
    await user.save();

    res.status(200).json({ message: "Task Updated Sucessful", sucess: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error,
      sucess: false,
    });
  }
};

export const myprofile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res
      .status(200)
      .json({
        message: "my Profile sucess",
        sucess: true,
        user: `${user.name}`,
      });
  } catch (error) {
    console.log(error);

    res.status(500).json({ sucess: false, message: error });
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const { name } = req.body;
    const avatar = req.files.avatar.tempFilePath;
    if(avatar){
        await cloudinary.v2.uploader.destroy(user.public_id);
        const mycloud=await cloudinary.v2.uploader.upload(avatar);
        
        fs.rmSync("./tmp", { recursive: true });

        user.avatar={
            public_id:mycloud.public_id,
            url:mycloud.secure_url
        }
    }
    if (name) {
      user.name = name;
    }
    await user.save();
    res
      .status(200)
      .json({ message: "Profile upadate sucessfully", sucess: true });
  } catch (error) {
    res.status(500).json({ sucess: false, message: error });
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("+password");
    const { oldpassword, newpassword } = req.body;
    const pass = await user.comparepassword(password);
    if (!pass) {
      return res.status(500).json({ sucess: false, message: "No match" });
    }
    user.password = newpassword;
    await user.save();
    res
      .status(200)
      .json({ message: "Profile upadate sucessfully", sucess: true });
  } catch (error) {
    res.status(500).json({ sucess: false, message: error });
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(500)
        .json({ sucess: false, message: "Please Enter the email" });
    }
    const otp = Math.floor(Math.random() * 100000);
    user.resetpasswordotp = otp;
    user.resetoptexpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendMail(email, "Verify my accout", `your otp ${otp}`);
    sendToken(res, user, 200, `otp sent top ${user.email}`);
  } catch (error) {
    console.log(error);

    res.status(500).json({ sucess: false, message: error });
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { otp, newPassword } = req.body;
    const user = await User.findOne({
      resetpasswordotp: otp,
      resetoptexpire: { $gt: new Date() },
    }).select("+password");
    console.log(user);

    if (!user) {
      return res
        .status(500)
        .json({ sucess: false, message: "otp exipre or wrong otp" });
    }
    user.password = newPassword;
    user.resetpasswordotp = null;
    user.resetoptexpire = null;

    await user.save();

    res
      .status(200)
      .json({ message: "password send sucessfully", sucess: true });
  } catch (error) {
    console.log(error);

    res.status(500).json({ sucess: false, message: error });
  }
};
