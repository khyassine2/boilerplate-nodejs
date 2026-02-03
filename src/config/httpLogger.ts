import expressWinston from "express-winston";
import { logger } from "./logger";
import winston from "winston";

export const httpLogger = expressWinston.logger({
    winstonInstance: logger,
    meta: false,
    msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
    colorize: true,
    expressFormat: false,
});
