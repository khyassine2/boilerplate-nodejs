import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class RefreshToken extends Model {
    declare id: number;
    declare userId: number;
    declare tokenHash: string;
    declare familyId: string; // token rotation family
    declare revokedAt?: Date | null;
    declare expiresAt: Date;
    declare replacedByTokenId?: number | null;
}

RefreshToken.init(
    {
        id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
        userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
        tokenHash: { type: DataTypes.STRING(128), allowNull: false },
        familyId: { type: DataTypes.STRING(64), allowNull: false },
        revokedAt: { type: DataTypes.DATE, allowNull: true },
        expiresAt: { type: DataTypes.DATE, allowNull: false },
        replacedByTokenId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    },
    { sequelize, tableName: "refresh_tokens", indexes: [{ fields: ["userId"] }, { fields: ["familyId"] }] }
);
