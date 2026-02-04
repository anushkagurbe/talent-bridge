import mongoose from "mongoose";

let applicationSchema = mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "job",
        required: true,
        index: true
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        index: true
    },
    recruiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        index: true
    },
    resume: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["APPLIED", "SHORTLISTED", "REJECTED", "HIRED"],
        default: "APPLIED"
    }
},
{
    timestamps: true
});

let applicationModel = mongoose.model("application",applicationSchema);

export default applicationModel;