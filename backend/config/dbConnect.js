import mongoose from "mongoose";

export let dbConnect = async () =>{
    try
    {
        await mongoose.connect(process.env.DB_URL);
        console.log("Connected to database");
    }
    catch(error)
    {
        console.log("Database connection error "+ error);
        process.exit(1);
    }
}