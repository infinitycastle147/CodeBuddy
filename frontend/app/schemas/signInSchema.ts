import { z } from 'zod';

export const signInSchema = z.object({
    identifier: z.string().min(3, "Enter a valid username or email"),
    password: z
        .string()
        .min(8, "Password must be exactly 8 characters long")       
        .max(8, "Password must not exceed 8 characters"),   
}).superRefine((data, ctx) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!usernameRegex.test(data.identifier) && !emailRegex.test(data.identifier)) {
        ctx.addIssue({
            path: ['identifier'],
            code: z.ZodIssueCode.custom,
            message: "Enter a valid username or email",
        });
    }
});