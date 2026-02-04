import { z } from "zod";

export let resetPasswordSchema = z.object({
    currentPassword: z
                .string()
                .trim()
                .min(1, { message: "Current password is required" }),
    newPassword: z
                .string()
                .trim()
                .min(8, { message: "New password must be at least 8 characters long" })
                .max(32, { message: "New password must not be more than 32 characters" }),
    confirmPassword: z
                .string()
                .trim()
                .min(8, { message: "Confirm password must be at least 8 characters long" })
                .max(32, { message: "Confirm password must not be more than 32 characters" })
}).refine((data)=> data.newPassword == data.confirmPassword, {
    message: "New password and confirm password do not match",
    path: ["confirmPassword"]
})
