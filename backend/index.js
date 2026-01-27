import "dotenv/config";
import express from "express";
import authRoutes from "./routes/authRoutes.js"
import { dbConnect } from "./config/dbConnect.js";

let app = express();
await dbConnect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/auth", authRoutes);


app.listen(process.env.PORT, ()=>{
    console.log("The server is listening on port "+ process.env.PORT);
})