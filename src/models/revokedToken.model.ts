import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class RevokedToken extends Model {
    declare id: number;
    declare jti: string;
    declare expiresAt: Date;
    declare revokedAt: Date;
}

RevokedToken.init(
    {
        id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
        jti: { type: DataTypes.STRING(64), allowNull: false, unique: true },
        expiresAt: { type: DataTypes.DATE, allowNull: false },
        revokedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    },
    { sequelize, tableName: "revoked_tokens", indexes: [{ fields: ["expiresAt"] }] }
);
