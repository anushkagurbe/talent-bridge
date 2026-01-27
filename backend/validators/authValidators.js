import { z } from "zod";

export let userLoginSchema = z.object({
    email: z
        .string()
        .email({ message: "Invalid email address format" })
        .min(12, { message: "Email must be at least 12 characters long" })
        .max(50, { message: "Email must not be more than 50 characters" }),
    password: z
        .string()
        .trim()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(32, { message: "Password must not be more than 32 characters" })
})

export let userRegisterSchema = userLoginSchema.extend({
    fullName: z
        .string()
        .trim()
        .min(5, { message: "Name must be at least 5 characters long" })
        .max(50, { message: "Name must not be more than 50 characters" }),
    username: z
        .string()
        .trim()
        .min(5, { message: "Name must be at least 5 characters long" })
        .max(50, { message: "Name must not be more than 50 characters" }),
    role: z
        .enum(["JOB_SEEKER", "RECRUITER"], { message: "Role must be either Job seeker or recruiter" })
})

