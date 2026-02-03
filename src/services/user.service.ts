import { User } from "../models";
import { ApiError } from "../utils/ApiError";

export class UserService {
    static async create(data: { email: string; name?: string }) {
        const exists = await User.findOne({ where: { email: data.email } });
        if (exists) throw new ApiError(409, "Email already exists");

        return User.create(data);
    }

    static async findById(id: number) {
        const user = await User.findByPk(id);
        if (!user) throw new ApiError(404, "User not found");
        return user;
    }
}
