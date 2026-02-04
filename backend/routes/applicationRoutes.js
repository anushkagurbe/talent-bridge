import express from "express";
import { verifyJwtMiddleware } from "../middlewares/authMiddlewares.js";
import { isJobSeekerMiddleware, isRecruiterMiddleware } from "../middlewares/roleMiddlewares.js";
import { applicationsRecievedController, applyJobController, myApplicationsController, updateApplicationStatusController } from "../controllers/applicationControllers.js";
import { upload } from "../middlewares/multerMiddlewares.js";
import { applyJobRateLimiter } from "../middlewares/rateLimiterMiddlewares.js";

let router = express.Router();

router.post("/applyToJob/:jobId", verifyJwtMiddleware, isJobSeekerMiddleware, upload.fields([{ name: "resume", maxCount: 1 }]), applyJobRateLimiter, applyJobController);
router.get("/myApplications", verifyJwtMiddleware, isJobSeekerMiddleware, myApplicationsController);
router.get("/applicationsRecieved/:jobId", verifyJwtMiddleware, isRecruiterMiddleware, applicationsRecievedController);
router.patch("/updateApplicationStatus/:applicationId", verifyJwtMiddleware, isRecruiterMiddleware, updateApplicationStatusController);

export default router;