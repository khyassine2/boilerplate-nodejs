import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

type ValidatorFn = (body: any) => void;

export const validate =
    (validatorFn: ValidatorFn) =>
        (req: Request, _res: Response, next: NextFunction) => {
            try {
                validatorFn(req.body);
                next();
            } catch (error) {
                next(error);
            }
        };
