import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import routes from "./routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import { httpLogger } from "./config/httpLogger";

const app = express();

app.use(express.json());
app.use(helmet());

app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
    })
);

// HTTP logs
app.use(httpLogger);

app.use("/api", routes);
app.use(errorMiddleware);

export default app;
