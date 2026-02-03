import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10, // 10 tentatives / 15min
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many login attempts, try later." },

    // key = ip + email (si dispo)
    keyGenerator: (req: any) => {
        const email = (req.body?.email || "").toString().toLowerCase();
        return `${req.ip}:${email}`;
    },
});
