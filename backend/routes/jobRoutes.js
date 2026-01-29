import express from "express";
import { verifyJwtMiddleware } from "../middlewares/authMiddlewares.js";
import { isRecruiterMiddleware } from "../middlewares/roleMiddlewares.js";
import { deleteJobController, postJobController, updateJobController } from "../controllers/jobControllers.js";

let router = express.Router();

router.post("/postNewJob", verifyJwtMiddleware, isRecruiterMiddleware, postJobController);
router.patch("/updateJob/:jobId", verifyJwtMiddleware, isRecruiterMiddleware, updateJobController);
router.patch("/deleteJob/:jobId", verifyJwtMiddleware, isRecruiterMiddleware, deleteJobController);

export default router;