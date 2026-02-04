import express from "express";
import { loginUserController, logoutUserController, registerUserController, resetPasswordController } from "../controllers/authControllers.js";
import { verifyJwtMiddleware } from "../middlewares/authMiddlewares.js";
import { loginRateLimiter, registerRateLimiter } from "../middlewares/rateLimiterMiddlewares.js";

let router = express.Router();

router.post("/register", registerRateLimiter,registerUserController);
router.post("/login", loginRateLimiter,loginUserController);
router.post("/logout", verifyJwtMiddleware, logoutUserController);
router.patch("/resetPassword", verifyJwtMiddleware, resetPasswordController);

export default router;