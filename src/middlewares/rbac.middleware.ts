import { NextFunction, Response } from "express";
import { ApiError } from "../utils/ApiError";

export function requireRole(...roles: string[]) {
    return (req: any, _res: Response, next: NextFunction) => {
        const role = req.user?.role;
        if (!role || !roles.includes(role)) return next(new ApiError(403, "Forbidden"));
        next();
    };
}
