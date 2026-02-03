import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { validate } from "../middlewares/validate.middleware";
import { validateCreateUser } from "../validators/user.validator";
import {authMiddleware} from "../middlewares/auth.middleware";

const router = Router();

router.post(
    "/",
    validate(validateCreateUser),
    UserController.create
);

router.get("/:id", UserController.findById);
router.get("/me", authMiddleware, (req, res) => {
    res.json({ user: (req as any).user });
});

export default router;
