import mongoose from "mongoose";

let jobSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    skills: [String],
    jobDescription: {
        type: String,
        required: true
    },
    experienceRequired: {
        type: Number,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    salary: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        enum: ["REMOTE", "ONSITE", "HYBRID"]
    },
    employmentType: {
        type: String,
        enum: ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"]
    },
    recruiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    status: {
        type: String,
        enum: ["ACTIVE", "CLOSED"],
        default: "ACTIVE"
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
});

let jobModel = mongoose.model("job", jobSchema);

export default jobModel;