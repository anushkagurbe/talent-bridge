import express from "express";
import { loginUserController, logoutUserController, registerUserController } from "../controllers/authControllers.js";
import { verifyJwtMiddleware } from "../middlewares/authMiddlewares.js";

let router = express.Router();

router.post("/register",registerUserController);
router.post("/login", loginUserController);
router.post("/logout", verifyJwtMiddleware, logoutUserController);

export default router;