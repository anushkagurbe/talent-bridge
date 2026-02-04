import mongoose from "mongoose";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import applicationModel from "../models/applicationModel.js";
import jobModel from "../models/jobModel.js";
import userModel from "../models/userModel.js";

export let applyJobController = async (req,res) =>{
    try
    {
        let userId = req.user._id;
        let { jobId } = req.params;
        if(!jobId)
        {
            return res.status(400).json({ success: false, message: "Job Id is required" });
        } 
        let job = await jobModel.findOne({ _id: jobId, status: "ACTIVE", isDeleted: false });
        if(!job)
        {
            return res.status(404).json({ success: false, message: "Job not found" });
        }
        let user = await userModel.findById(userId).select("resume");
        let isApplied = await applicationModel.findOne({ job: jobId, applicant: userId });
        if(isApplied)
        {
            return res.status(400).json({ success: false, message: "You have already applied for this job" });
        }
        let resumeUrl;
        if(req.files?.resume?.[0])
        {
            let uploadedResume = await uploadOnCloudinary(req.files?.resume?.[0].path);
            resumeUrl = uploadedResume?.url;
        }
        else if(user.resume)
        {
            resumeUrl = user.resume;
        }
        else
        {
            return res.status(400).json({ success: false, message: "Resume is required" });
        }
        let application = await applicationModel.create({ job: jobId, applicant: userId, recruiter: job.recruiter, resume: resumeUrl });
        return res.status(201).json({ success: true, message: "Your application has been submitted", application: application });

    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export let myApplicationsController = async (req,res) =>{
    try
    {
        let userId = req.user._id;
        let applications = await applicationModel.aggregate([
            {
                $match: {
                    applicant: userId,
                }
            },
            {
                $lookup: {
                    from: "jobs",
                    localField: "job",
                    foreignField: "_id",
                    as: "job"
                }
            },
            {
                $unwind: "$job"
            },
            {
                $match: {
                    "job.isDeleted": false
                }
            },
            {
                $project: {
                    status: 1,
                    _id: 1,
                    createdAt: 1,
                    job: {
                        title: "$job.title",
                        companyName: "$job.companyName",
                        location: "$job.location",
                        status: "$job.status"
                    }
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ]);
        if(applications.length == 0)
        {
            return res.status(200).json({ success: true , message: "You have no applied to any jobs yet", applications: [] })
        }
        return res.status(200).json({ success: true, applications: applications });
        
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export let applicationsRecievedController = async (req,res) =>{
    try
    {
        let { jobId } = req.params;
        let userId = req.user._id;
        if(!jobId)
        {
            return res.status(400).json({ success: false, message: "Job Id is required" });
        }
        let applications = await applicationModel.aggregate([
            {
                $match: {
                    job: new mongoose.Types.ObjectId(jobId),
                    recruiter: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "jobs",
                    localField: "job",
                    foreignField: "_id",
                    as: "job"
                }
            },
            {
                $unwind: "$job"
            },
            {
                $match: {
                    "job.isDeleted": false
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "applicant",
                    foreignField: "_id",
                    as: "applicant"
                }
            },
            {
                $unwind: "$applicant"
            },
            {
                $project: {
                    status: 1,
                    _id: 1,
                    createdAt: 1,
                    resume: 1,
                    applicant: {
                        fullName: "$applicant.fullName",
                        email: "$applicant.email",
                        location: "$applicant.location",
                        skills: "$applicant.skills"
                    },
                    job: {
                        title: "$job.title",
                        companyName: "$job.companyName",
                        location: "$job.location",
                        status: "$job.status",
                        employmentType: "$job.employmentType"
                    }
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ]);
        if(applications.length == 0)
        {
            return res.status(200).json({ success: true , message: "Applications not recieved yet", applications: [] })
        }
        return res.status(200).json({ success: true, applications: applications });
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const ALLOWED_STATUSES = [
  "SHORTLISTED",
  "REJECTED",
  "HIRED"
];

export let updateApplicationStatusController = async (req,res) =>{
    try
    {
        let { applicationId } = req.params;
        let userId = req.user._id;
        let { status } = req.body;
        if (!applicationId) 
        {
            return res.status(400).json({ success: false, message: "Application ID is required" });
        }
        if(!status || !ALLOWED_STATUSES.includes(status))
        {
            return res.status(400).json({ success: false, message: "Invalid application status" });
        }
        let application = await applicationModel.findOne({_id: applicationId, recruiter: userId});
        if(!application)
        {
            return res.status(404).json({ success: false, message: "Application not found" })
        }
        if(application.status == status)
        {
            return res.status(200).json({ success: true, message: "Applicaion status is already updated" })
        }
        let updatedStatus = await applicationModel.findOneAndUpdate({_id: applicationId, recruiter: userId}, { $set: { status: status } }, { new: true }).select("job applicant status");
        return res.status(200).json({ success: true, message: "Application status updated successfully", updatedStatus: updatedStatus })
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

