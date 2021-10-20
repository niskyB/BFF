import { ServerRequest } from "../interfaces/common/Request";
import { Request, Response } from "express";
import * as express from "express";
import { RegisterUserDTO } from "../interfaces/dtos/user";
import { validateUser } from "../validator/User";
import { BAD_REQUEST } from "../constants/statusConstants";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../Repository/UserRepository";
import { User } from "../entity/User";
const router = express.Router();

router.post(
    '/register',
    async (req: ServerRequest<RegisterUserDTO>, res: Response) => {
        const { username, fullName, email, password, confirmPassword } = req.body;
        const { error } = validateUser(req.body);
        if (error) return res.status(BAD_REQUEST).send(error.details[0].message);
        const userRepo = getCustomRepository(UserRepository);

        let isExistedUser = await userRepo.findUserByUsername(username);
        console.log(isExistedUser);
    }
)

export default router;