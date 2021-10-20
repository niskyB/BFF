import { EntityRepository, Repository } from "typeorm";
import { User } from "../entity/User";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async findUserByUsername(username: string) {
        const user = await this.findOne({ username }).catch((err) => err);
        return user;
    }

    async findUserByEmail(email: string) {
        const user = await this.findOne({ email }).catch(err => err);
        return user;
    }
}