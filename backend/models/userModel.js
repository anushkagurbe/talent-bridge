import mongoose from "mongoose";

let userSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    about: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        enum: ["JOB_SEEKER", "RECRUITER", "ADMIN"],
        default: "JOB_SEEKER"
    },
    skills: [
        String
    ],
    experience: {
        type: Number,
        default: 0
    },
    resume: String,
    profileImage: {
        type: String,
        default: ""
    },
    location: {
        city: { 
            type: String 
        },
        state: {
             type: String 

        },
        country: {
             type: String 

        }
    },
    refreshToken: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    otp: {
        type: Number
    }
},
{
    timestamps: true
})

let userModel = mongoose.model("user", userSchema);

export default userModel;