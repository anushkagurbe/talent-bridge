import express from "express";
import { loginUserController, registerUserController } from "../controllers/authControllers.js";

let router = express.Router();

router.post("/register",registerUserController);
router.post("/login", loginUserController);

export default router;