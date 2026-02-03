import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";
import { RevokedToken, User } from "../models";

export interface AuthRequest extends Request {
    user?: { id: number; email: string; role: string; tokenVersion: number; jti: string };
}

export async function authMiddleware(req: any, _res: Response, next: NextFunction) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) return next(new ApiError(401, "Unauthorized"));

    const token = auth.split(" ")[1];

    try {
        const decoded = jwt.verify(token, env.auth.accessSecret, {
            issuer: env.auth.issuer,
            audience: env.auth.audience,
        }) as any;

        // blacklist check (logout / revoked)
        const revoked = await RevokedToken.findOne({ where: { jti: decoded.jti } });
        if (revoked) return next(new ApiError(401, "Token revoked"));

        // tokenVersion check (global revoke)
        const user = await User.findByPk(decoded.sub);
        if (!user) return next(new ApiError(401, "Unauthorized"));

        if (user.tokenVersion !== decoded.tv) {
            return next(new ApiError(401, "Token invalidated"));
        }

        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
            tokenVersion: user.tokenVersion,
            jti: decoded.jti,
        };

        return next();
    } catch {
        return next(new ApiError(401, "Invalid or expired token"));
    }
}
