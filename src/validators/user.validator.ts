import validator from "validator";
import { ApiError } from "../utils/ApiError";

export function validateCreateUser(body: any) {
    if (!body.email) {
        throw new ApiError(400, "Email is required");
    }

    if (!validator.isEmail(body.email)) {
        throw new ApiError(400, "Invalid email format");
    }

    if (body.name) {
        if (!validator.isLength(body.name, { min: 2, max: 50 })) {
            throw new ApiError(400, "Name must be between 2 and 50 characters");
        }
    }
}
