export let isAdminMiddleware = async (req,res,next) => {
    try
    {
        let role = req.user.role;
        if(role == "ADMIN")
        {
            next();
        }
        return res.status(403).json({ success: false, message: "Admin access required" });
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({success: false, message: "Internal server error"})
    }
}


export let isRecruiterMiddleware = async (req,res,next) => {
    try
    {
        let role = req.user.role;
        if(role == "RECRUITER")
        {
            next();
        }
        return res.status(403).json({ success: false, message: "Access forbidden" });
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({success: false, message: "Internal server error"})
    }
}

export let isJobSeekerMiddleware = async (req,res,next) => {
    try
    {
        let role = req.user.role;
        if(role == "JOB_SEEKER")
        {
            next();
        }
        return res.status(403).json({ success: false, message: "Access forbidden" });
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({success: false, message: "Internal server error"})
    }
}