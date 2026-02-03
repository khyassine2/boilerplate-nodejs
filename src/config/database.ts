import { Sequelize } from "sequelize";
import { env } from "./env";
import { logger } from "./logger";

export const sequelize = new Sequelize(env.db.name, env.db.user, env.db.password, {
    host: env.db.host,
    port: env.db.port,
    dialect: "mysql",
    pool: {
        max: env.db.poolMax,
        min: env.db.poolMin,
        idle: env.db.poolIdle,
        acquire: env.db.poolAcquire,
    },
    logging: (msg) => logger.debug(msg),
});
