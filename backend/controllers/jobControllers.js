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

export let getAllJobsController = async (req, res) =>{
    try
    {
        let page = Math.max(parseInt(req.query.page) || 1, 1);
        let limit = Math.max(parseInt(req.query.limit) || 10, 10);
        let skip = (page - 1) * limit;

        let baseQuery = {
            isDeleted: false,
            status: "ACTIVE"
        };
        let totalJobsCount = await jobModel.countDocuments(baseQuery);
        let totalPages = Math.ceil(totalJobsCount / limit);
        if(totalJobsCount > 0 && page > totalPages)
        {
            return res.status(200).json({ success: false, 
                pagination: {
                    totalPages,
                    totalJobsCount,
                    currentPage: page,
                    hasNextPage: false,
                    hasPrevPage: true,
                    limit
                },
                message: "No jobs found for this page"})
        }
        let jobs = await jobModel.find(baseQuery).select(
        "title companyName location salary jobType employmentType createdAt"
        ).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
        return res.status(200).json({ success: true, jobs: jobs,
            pagination: {
                totalJobsCount,
                totalPages,
                currentPage: page,
                limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }});
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export let getJobDetailsController = async (req, res) =>{
    try
    {
        let jobId = req.params.jobId;
        if(!jobId)
        {
            return res.status(400).json({ success: false, message: "Job ID is missing" });
        }
        let job = await jobModel.findOne({ _id: jobId, isDeleted: false });
        if(!job)
        {
            return res.status(404).json({ success: false, message: "Job not found" })
        }
        return res.status(200).json({ success: true, job: job });
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}