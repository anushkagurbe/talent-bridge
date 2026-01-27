import userModel from "../models/userModel.js";
import { userLoginSchema, userRegisterSchema } from "../validators/authValidators.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

let cookieOptions = {
            httpOnly: true
        }

export let registerUserController = async (req,res) =>{
    try
    {
        let result = userRegisterSchema.safeParse(req.body);
        if(!result.success)
        {
            let errors = result.error.issues.map((error)=>({
                field: error.path[0],
                message: error.message
            }));
            console.log(errors);
            return res.status(400).json({ success: false, message: errors });
        }
        console.log(result.data)
        let { fullName, username, email, password, role } = result.data;
        let isUserExists = await userModel.findOne({ $and: [ { email: email }, { username: username } ] });
        if(isUserExists)
        {
            return res.status(400).json({ success: false, message: "Username or email already exists" });
        }
        let hashedPassword = await bcrypt.hash(password, 12);
        let user = await userModel.create({ fullName, username, email, role, password: hashedPassword });
        return res.status(201).json({ success: true, message: "User registered successfully", user: user });
    }
    catch(error)
    {
        console.log("Internal server error "+ error);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}


export let loginUserController = async (req,res) =>{
    try
    {
        let result = userLoginSchema.safeParse(req.body);
        if(!result.success)
        {
            let errors = result.error.issues.map((error)=>({
                field: error.path[0],
                message: error.message
            }));
            return res.status(400).json({ success: false, message: errors });
        }
        let { email, password } = result.data;
        let isUserExist = await userModel.findOne({ email }, { _id: 1, username: 1, password: 1, role: 1, email: 1 });
        if(!isUserExist)
        {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        let isPasswordCorrect = await bcrypt.compare(password, isUserExist.password);
        if(!isPasswordCorrect)
        {
            return res.status(400).json({ success: false, message: "Incorrect password" });
        }
        let accessToken = await jwt.sign({_id: isUserExist._id, username: isUserExist.username, role: isUserExist.role},
            process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        });

        let refreshToken = await jwt.sign({_id: isUserExist._id, username: isUserExist.username},
            process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        });

        await userModel.updateOne({ _id: isUserExist._id }, { $set: { refreshToken: refreshToken } });

        return res.status(200).cookie("accessToken", accessToken, cookieOptions).cookie("refreshToken", refreshToken, cookieOptions).json({ success: true, message: "Login successfully", user: {
            _id: isUserExist._id,
            username: isUserExist.username,
            email: isUserExist.email,
            role: isUserExist.role
        } })

    }
    catch(error)
    {
        console.log("Internal server error "+ error);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export let logoutUserController = async (req,res) =>{
    try
    {
        await userModel.updateOne({ _id: req.user._id }, { $set: { refreshToken: "" } })
        return res.status(200).clearCookie("accessToken").json({ success: true, message: "Logged out successfully" })
    }
    catch(error)
    {
        console.log("Internal server error "+ error);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}