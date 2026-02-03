import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export type UserRole = "user" | "admin";

export class User extends Model {
    declare id: number;
    declare email: string;
    declare password: string;
    declare name?: string;
    declare role: UserRole;
    declare tokenVersion: number; // bump => revoke all tokens
}

User.init(
    {
        id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        password: { type: DataTypes.STRING, allowNull: false },
        name: { type: DataTypes.STRING },
        role: { type: DataTypes.ENUM("user", "admin"), allowNull: false, defaultValue: "user" },
        tokenVersion: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    },
    { sequelize, tableName: "users" }
);
