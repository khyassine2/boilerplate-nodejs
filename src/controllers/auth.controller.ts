import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AuthService } from "../services/auth.service";
import { ApiError } from "../utils/ApiError";

export class AuthController {
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await AuthService.register(req.body);
            res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const data = await AuthService.login(email, password);
            res.json(data);
        } catch (e) {
            next(e);
        }
    }

    static async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) return next(new ApiError(400, "refreshToken is required"));
            const data = await AuthService.refresh(refreshToken);
            res.json(data);
        } catch (e) {
            next(e);
        }
    }

    static async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.body;

            // optional: blacklist access token if provided
            let jti: string | undefined;
            let expDate: Date | undefined;

            const auth = req.headers.authorization;
            if (auth?.startsWith("Bearer ")) {
                const access = auth.split(" ")[1];
                const decoded: any = jwt.decode(access);
                if (decoded?.jti && decoded?.exp) {
                    jti = decoded.jti;
                    expDate = new Date(decoded.exp * 1000);
                }
            }

            const data = await AuthService.logout({
                refreshToken,
                accessTokenJti: jti,
                accessExp: expDate,
            });

            res.json(data);
        } catch (e) {
            next(e);
        }
    }


    static async rbacAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            res.json({result:"ok! it's admin"});
        } catch (e) {
            next(e);
        }
    }
}




