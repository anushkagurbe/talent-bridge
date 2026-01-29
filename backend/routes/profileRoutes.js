import express from "express";
import { verifyJwtMiddleware } from "../middlewares/authMiddlewares.js";
import { getMyProfileController, updateMyProfileController } from "../controllers/profileControllers.js";
import { upload } from "../middlewares/multerMiddlewares.js";

let router = express.Router();

router.get("/getMyProfile", verifyJwtMiddleware, getMyProfileController);
router.patch("/updateMyProfile", verifyJwtMiddleware, upload.fields([{name: "profileImage", maxCount: 1}, { name: "resume", maxCount: 1 }]), updateMyProfileController);

export default router;