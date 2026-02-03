import winston from "winston";

const isProd = process.env.NODE_ENV === "production";

const formats = [
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(({ level, message, timestamp }) => {
        return `${timestamp} ${level}: ${message}`;
    }),
];

export const logger = winston.createLogger({
    level: isProd ? "info" : "debug",
    format: isProd
        ? winston.format.combine(...formats)
        : winston.format.combine(
            winston.format.colorize(),
            ...formats
        ),
    transports: [
        new winston.transports.Console(),
        ...(isProd
            ? [
                new winston.transports.File({
                    filename: "logs/app.log",
                }),
                new winston.transports.File({
                    filename: "logs/error.log",
                    level: "error",
                }),
            ]
            : []),
    ],
});
