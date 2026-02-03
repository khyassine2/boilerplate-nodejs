import dotenv from "dotenv";
dotenv.config({ quiet: true });

export const env = {
    port: Number(process.env.PORT || 3000),
    db: {
        host: process.env.DB_HOST!,
        port: Number(process.env.DB_PORT || 3306),
        name: process.env.DB_NAME!,
        user: process.env.DB_USER!,
        password: process.env.DB_PASSWORD!,
        sync: process.env.DB_SYNC === "true",
        syncAlter: process.env.DB_SYNC_ALTER === "true",
        syncForce: process.env.DB_SYNC_FORCE === "true",
        poolMax: Number(process.env.DB_POOL_MAX || 10),
        poolMin: Number(process.env.DB_POOL_MIN || 0),
        poolIdle: Number(process.env.DB_POOL_IDLE || 10000),
        poolAcquire: Number(process.env.DB_POOL_ACQUIRE || 30000),
    },
    auth: {
        accessSecret: process.env.JWT_ACCESS_SECRET!,
        refreshSecret: process.env.JWT_REFRESH_SECRET!,
        accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
        bcryptRounds: Number(process.env.BCRYPT_SALT_ROUNDS || 10),
        issuer: process.env.TOKEN_ISSUER || "boilerplate-nodejs",
        audience: process.env.TOKEN_AUDIENCE || "boilerplate-api",
    },
};
