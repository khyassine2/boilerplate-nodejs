import validator from "validator";
import { ApiError } from "../utils/ApiError";

export function validateLogin(body: any) {
    if (!body.email || !validator.isEmail(String(body.email))) throw new ApiError(400, "Invalid email");
    if (!body.password || !validator.isLength(String(body.password), { min: 6 })) {
        throw new ApiError(400, "Password must be at least 6 chars");
    }
}

export function validateRefresh(body: any) {
    if (!body.refreshToken || !validator.isUUID(String(body.refreshToken).replace(/-/g, "")) ) {
        // refresh token is opaque; simplest: just check it's present
        // keep only presence check if you want
        // throw new ApiError(400, "Invalid refreshToken");
    }
    if (!body.refreshToken) throw new ApiError(400, "refreshToken is required");
}
