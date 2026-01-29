import { success } from "zod";
import userModel from "../models/userModel.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";

export let getMyProfileController = async (req, res) =>{
    try
    {
        let userId = req.user._id;
        let user = await userModel.findOne({ _id: userId }).select("-password -otp -refreshToken");
        if(!user)
        {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({ success: true, message: user });
    }
    catch(error)
    {
        console.log("Internal server error "+ error);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}


export let updateMyProfileController = async (req,res) =>{
    try
    {
        let userId = req.user._id;
        let role = req.user.role;
        let profileImage = req.files?.profileImage?.[0]?.path;
        let resume = req.files?.resume?.[0]?.path;
        let resumeUrl;
        // let allowedFields = {
        //     JOB_SEEKER : [
        //         "fullName",
        //         "username",
        //         "skills",
        //         "experience",
        //         "resume",
        //         "profileImage",
        //         "about",
        //         "location"
        //     ],
        //     RECRUITER : [
        //         "fullName",
        //         "about",
        //         "companyName",
        //         "profileImage",
        //         "location",
        //         "username"
        //     ],
        //     ADMIN: [
        //         "fullName",
        //         "about"
        //     ]
        // }

        let updateData = {};

        if(req.body.fullName) updateData.fullName = req.body.fullName;
        if(req.body.username) updateData.username = req.body.username;
        if(req.body.about) updateData.about = req.body.about;

        let profileImageUrl;
        if(profileImage)
        {
            profileImageUrl = await uploadOnCloudinary(profileImage);
            if(!profileImageUrl?.url)
            {
                return res.status(500).json({ success: false, message: "Image upload failed" });
            }
            updateData.profileImage = profileImageUrl.url;
        }
        
        if(req.body.location) if(req.body.location) updateData.location = JSON.parse(req.body.location);

        if(role === "JOB_SEEKER") 
        {
            if(req.body.skills) updateData.skills = JSON.parse(req.body.skills);
            if(req.body.experience) updateData.experience = req.body.experience;
            if(resume) 
            {
                resumeUrl = await uploadOnCloudinary(resume);
                if(!resumeUrl?.url)
                {
                    return res.status(500).json({ success: false, message: "Resume upload failed" });
                }
                updateData.resume = resumeUrl.url;
            }
        }

        if(role === "RECRUITER") 
        {
            if(req.body.companyName) updateData.companyName = req.body.companyName;
        }

        let updatedUser = await userModel.findByIdAndUpdate(userId, { $set: updateData }, { new: true }).select("-password -refreshToken -otp");
        return res.status(200).json({ success: true, message: "Profile updated successfully", user: updatedUser })
    }
    catch(error)
    {
        console.log("Internal server error "+ error);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}