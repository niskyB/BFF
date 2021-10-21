import * as jwt from "jsonwebtoken";
import { User } from "../entity/User";

export async function gentoken(user: User) {
    const token = jwt.sign({ userId: user.userId, roleId: user.roleId }, process.env.JWT_PRIVATE_KEY);
    return token;
}