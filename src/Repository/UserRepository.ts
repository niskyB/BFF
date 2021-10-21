import { EntityRepository, Repository } from "typeorm";
import { User } from "../entity/User";
import * as bcrypt from "bcrypt";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async addNewUser(user: User): Promise<User> {
        // hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        // save to db
        const result = await this.manager
            .save(user)
            .catch((err) => err.sqlMessage);
        return result;
    }

    async findUserByUsername(username: string): Promise<User> {
        const user = await this.findOne({ username }).catch((err) => err);
        return user;
    }

    async findUserByEmail(email: string): Promise<User> {
        const user = await this.findOne({ email }).catch(err => err);
        return user;
    }

    async findUserById(userId: string): Promise<User> {
        const user = await this.findOne({ userId }).catch(err => err);
        return user;
    }
}