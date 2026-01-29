import { jobSchema } from "../validators/jobValidators.js";
import jobModel from "../models/jobModel.js";

export let postJobController = async (req, res) =>{
    try
    {
        let userId = req.user._id;
        let result = jobSchema.safeParse(req.body);
        if(!result.success)
        {
            let errors = result.error.issues.map((error)=>({
                field: error.path[0],
                message: error.message
            }));
            return res.status(400).json({ success: false, message: errors });
        }
        let { title, jobDescription, skills, experienceRequired, salary, companyName, jobType, employmentType, location } = result.data;

        let job = await jobModel.create({ title: title.toLowerCase(), jobDescription, skills, experienceRequired, salary, companyName, jobType, employmentType, location, recruiter: userId });

        return res.status(201).json({ success: true, message: "Job posted successfully", job: job });
    }
    catch(error)
    {
        console.log("Internal server error ", error);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export let updateJobController = async (req, res) =>{
    try
    {
        let userId = req.user._id;
        let { jobId } = req.params; 
        let result = jobSchema.partial().safeParse(req.body);
        if(!result.success)
        {
            let errors = result.error.issues.map((error)=>({
                field: error.path[0],
                message: error.message
            }))
            return res.status(400).json({ success: false, message: errors });
        }
        let updatedJob = await jobModel.findOneAndUpdate({ _id: jobId, recruiter: userId, isDeleted: false, status: "ACTIVE" }, { $set: result.data }, { new: true });
        if(!updatedJob)
        {
            return res.status(404).json({ success: false, message: "Job not found or you are not authorized" });
        } 
        return res.status(200).json({ success: true, message: "Job updated successfully", job: updatedJob });
    }
    catch(error)
    {
        console.log("Internal server error ", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}


export let deleteJobController = async (req, res) =>{
    try
    {
        let { jobId } = req.params;
        let userId = req.user._id;
        let job = await jobModel.findOneAndUpdate({ _id: jobId, recruiter: userId, isDeleted: false }, { $set: { isDeleted: true, status: "CLOSED" } });
        if(!job)
        {
            return res.status(404).json({ success: false, message: "Job not found" })
        }
        return res.status(200).json({ success: true, message: "Job deleted successfully" });
    }
    catch(error)
    {
        console.log("Internal server error ", error);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}