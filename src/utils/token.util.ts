import crypto from "node:crypto";

export function newId(): string {
    return crypto.randomUUID();
}

export function sha256(input: string): string {
    return crypto.createHash("sha256").update(input).digest("hex");
}
