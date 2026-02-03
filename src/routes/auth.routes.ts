import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import { validateLogin, validateRefresh } from "../validators/auth.validator";
import { loginLimiter } from "../middlewares/loginRateLimit.middleware";
import {authMiddleware} from "../middlewares/auth.middleware";
import {requireRole} from "../middlewares/rbac.middleware";

const router = Router();

router.post("/register", validate(validateLogin), AuthController.register);

// rate limit login
router.post("/login", loginLimiter, validate(validateLogin), AuthController.login);

router.post("/refresh", validate(validateRefresh), AuthController.refresh);

router.post("/logout", AuthController.logout);

router.get("/admin-only", authMiddleware, requireRole("admin"), AuthController.rbacAdmin);

export default router;








