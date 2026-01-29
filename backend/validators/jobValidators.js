import { string, z } from "zod";

export let jobSchema = z.object({
    title: z
        .string()
        .trim()
        .min(5, { message: "Title must be at least 5 characters long" })
        .max(100, { message: "Title must not be more than 100 characters" }),
    jobDescription: z
                .string()
                .trim()
                .min(5, { message: "Job description must be at least 5 characters long" })
                .max(500, { message: "Job description must not be more than 100 characters" }),
    experienceRequired: z
                .number()
                .min(0, "Experience cannot be negative")
                .max(50, "Experience looks unrealistic"),
    skills: z
        .array(z.string().min(1))
        .min(1, "At least one skill is required"),
    jobType: z
        .enum(["REMOTE", "ONSITE", "HYBRID"]),
    employmentType: z
        .enum([ "FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT" ]),
    salary: z
        .string()
        .min(1, { message: "Salary is reqquired" }),
    companyName: z
            .string()
            .trim()
            .min(5, { message: "Company name must be at least  charaters long" }),
    location: z
            .string()
            .trim()
            .min(1, { message: "Location is required" })
})