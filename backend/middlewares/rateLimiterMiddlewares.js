import rateLimit from "express-rate-limit";

export let loginRateLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 4,
    message: {
        success: false, 
        message: "Too many login attempts. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false
});

export let registerRateLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 4,
    message: {
        success: false, 
        message: "Too many accounts created from this IP. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false
});

export let applyJobRateLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 4,
    message: {
        success: false, 
        message: "Too many job applications. Slow down."
    },
    standardHeaders: true,
    legacyHeaders: false
})

