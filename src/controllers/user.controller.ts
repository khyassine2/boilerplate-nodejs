import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";

export class UserController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await UserService.create(req.body);
            res.status(201).json(user);
        } catch (e) {
            next(e);
        }
    }

    static async findById(req: Request, res: Response, next: NextFunction) {
        try {
            res.json(await UserService.findById(Number(req.params.id)));
        } catch (e) {
            next(e);
        }
    }
}
