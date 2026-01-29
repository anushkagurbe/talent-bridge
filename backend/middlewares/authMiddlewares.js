import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export let verifyJwtMiddleware = async (req, res, next) =>{
    try
    {
        let token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
        if(!token)
        {
            return res.status(401).json({ success: false, message: "Token not found" });
        }
        let decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        let user = await userModel.findOne({_id: decodedToken._id},{ username: 1, email: 1, fullName: 1, role: 1, isBlocked: 1 });
        if(!user)
        {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if(user.isBlocked)
        {
            return res.status(403).json({ success: false, message: "User is blocked" })
        }
        req.user = user;
        return next();
    }
    catch(error)
    {
        console.log(error);
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
}