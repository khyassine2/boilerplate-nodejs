import app from "./app";
import { env } from "./config/env";
import { initDatabase } from "./models";
import {logger} from "./config/logger";

(async () => {
    await initDatabase();
    app.listen(env.port, () =>
        logger.info(`🚀 API running on http://localhost:${env.port}`)
    );
})();
