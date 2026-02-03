import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ms from "ms";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";
import { newId, sha256 } from "../utils/token.util";
import { RefreshToken, RevokedToken, User } from "../models";

function expiresAtFrom(expiresIn: string): Date {
    // "15m" / "7d"
    const value = typeof ms === "function" ? ms(expiresIn) : undefined;
    if (!value) {
        // fallback minimal: minutes only
        return new Date(Date.now() + 15 * 60 * 1000);
    }
    return new Date(Date.now() + value);
}

export class AuthService {
    static async register(data: { email: string; password: string; name?: string }) {
        const exists = await User.findOne({ where: { email: data.email } });
        if (exists) throw new ApiError(409, "Email already exists");

        const hash = await bcrypt.hash(data.password, env.auth.bcryptRounds);
        const user = await User.create({ email: data.email, password: hash, name: data.name });

        return this.issueSession(user);
    }

    static async login(email: string, password: string) {
        const user = await User.findOne({ where: { email } });
        if (!user) throw new ApiError(401, "Invalid credentials");

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) throw new ApiError(401, "Invalid credentials");

        return this.issueSession(user);
    }

    // ✅ JWT Rotation: refresh -> new refresh, revoke old
    static async refresh(refreshTokenRaw: string) {
        const tokenHash = sha256(refreshTokenRaw);

        const stored = await RefreshToken.findOne({ where: { tokenHash } });
        if (!stored) throw new ApiError(401, "Invalid refresh token");
        if (stored.revokedAt) throw new ApiError(401, "Refresh token revoked");
        if (stored.expiresAt.getTime() < Date.now()) throw new ApiError(401, "Refresh token expired");

        const user = await User.findByPk(stored.userId);
        if (!user) throw new ApiError(401, "Invalid session");

        // rotation: revoke current refresh
        stored.revokedAt = new Date();

        // create new refresh in same family
        const next = await this.createRefreshToken(user.id, stored.familyId);

        stored.replacedByTokenId = next.id;
        await stored.save();

        const access = this.createAccessToken(user);

        return {
            accessToken: access.token,
            accessTokenExpiresAt: access.expiresAt,
            refreshToken: next.raw, // return raw only once
            refreshTokenExpiresAt: next.expiresAt,
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
        };
    }

    // Logout = revoke refresh + blacklist access (optional)
    static async logout(params: { refreshToken?: string; accessTokenJti?: string; accessExp?: Date }) {
        if (params.refreshToken) {
            const tokenHash = sha256(params.refreshToken);
            const stored = await RefreshToken.findOne({ where: { tokenHash } });
            if (stored && !stored.revokedAt) {
                stored.revokedAt = new Date();
                await stored.save();
            }
        }

        // blacklist access token (if you want immediate invalidation)
        if (params.accessTokenJti && params.accessExp) {
            await RevokedToken.create({
                jti: params.accessTokenJti,
                expiresAt: params.accessExp,
                revokedAt: new Date(),
            });
        }

        return { message: "Logged out" };
    }

    // Global logout (revoke all tokens)
    static async revokeAllSessions(userId: number) {
        const user = await User.findByPk(userId);
        if (!user) throw new ApiError(404, "User not found");

        user.tokenVersion += 1; // access tokens invalidated
        await user.save();

        await RefreshToken.update(
            { revokedAt: new Date() },
            { where: { userId, revokedAt: null } }
        );

        return { message: "All sessions revoked" };
    }

    // ---- helpers ----

    private static async issueSession(user: User) {
        const access = this.createAccessToken(user);
        const familyId = newId();
        const refresh = await this.createRefreshToken(user.id, familyId);

        return {
            accessToken: access.token,
            accessTokenExpiresAt: access.expiresAt,
            refreshToken: refresh.raw,
            refreshTokenExpiresAt: refresh.expiresAt,
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
        };
    }

    private static createAccessToken(user: User) {
        const jti = newId();
        const expiresAt = expiresAtFrom(env.auth.accessExpiresIn);

        if (!env.auth.accessSecret) {
            throw new Error("ACCESS JWT secret is not defined");
        }

        const token = jwt.sign(
            {
                jti,
                tv: user.tokenVersion,
                role: user.role,
            },
            env.auth.accessSecret,
            {
                subject: String(user.id),
                expiresIn: env.auth.accessExpiresIn,
                issuer: env.auth.issuer,
                audience: env.auth.audience,
            }
        );

        return { token, expiresAt, jti };
    }


    private static async createRefreshToken(userId: number, familyId: string) {
        const raw = newId() + newId(); // opaque random
        const tokenHash = sha256(raw);
        const expiresAt = expiresAtFrom(env.auth.refreshExpiresIn);

        const row = await RefreshToken.create({
            userId,
            tokenHash,
            familyId,
            expiresAt,
            revokedAt: null,
            replacedByTokenId: null,
        });

        return { id: row.id, raw, expiresAt };
    }
}
