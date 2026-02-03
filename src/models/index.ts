import { sequelize } from "../config/database";
import { env } from "../config/env";
import { logger } from "../config/logger";

import { User } from "./user.model";
import { RefreshToken } from "./refreshToken.model";
import { RevokedToken } from "./revokedToken.model";

export async function initDatabase() {
    await sequelize.authenticate();
    logger.info("✅ DB connected");

    if (env.db.sync) {
        await sequelize.sync({
            alter: env.db.syncAlter,
            force: env.db.syncForce,
        });
        logger.info(`✅ DB synced (alter=${env.db.syncAlter}, force=${env.db.syncForce})`);
    }
}

export {
  User,
  RefreshToken,
  RevokedToken,
};
