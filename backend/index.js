import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js"
import profileRoutes from "./routes/profileRoutes.js";
import mongoSanitize from "express-mongo-sanitize";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import { dbConnect } from "./config/dbConnect.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import xss from "xss-clean";

let app = express();
await dbConnect();
app.use(cors());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(cookieParser());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/job", jobRoutes);
app.use("/api/v1/application", applicationRoutes);


app.listen(process.env.PORT, ()=>{
    console.log("The server is listening on port "+ process.env.PORT);
})