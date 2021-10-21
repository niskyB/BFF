import { ServerRequest, RequestWithUser } from "../interfaces/common/Request";
import { Request, Response } from "express";
import * as express from "express";
import { RegisterUserDTO } from "../interfaces/dtos/user";
import { validateUser } from "../validator/User";
import { BAD_REQUEST } from "../constants/statusConstants";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../Repository/UserRepository";
import { User } from "../entity/User";
import { gentoken } from "../utils/userHelper";
const router = express.Router();

router.get(
    '/me',
    async (req: RequestWithUser<User>, res: Response) => {

    }
)

router.post(
    '/register',
    async (req: ServerRequest<RegisterUserDTO>, res: Response) => {
        // validate data
        const { error } = validateUser(req.body);
        if (error) return res.status(BAD_REQUEST).send(error.details[0].message);

        // get params from req body
        const { username, fullName, email, password, confirmPassword } = req.body;

        // get connection
        const userRepo = getCustomRepository(UserRepository);

        // create variable to store duplicate field
        let duplicatedField = {
            username: "",
            email: ""
        };

        // check existed username
        let isExistedUser = await userRepo.findUserByUsername(username);
        if (isExistedUser) {
            duplicatedField = {
                ...duplicatedField,
                username: "username is already existed"
            };
        }

        isExistedUser = await userRepo.findUserByEmail(email);
        if (isExistedUser) {
            duplicatedField = {
                ...duplicatedField,
                email: "email is already existed"
            };
        }

        if (duplicatedField.username != "" || duplicatedField.email != "") return res.status(BAD_REQUEST).send(duplicatedField);

        // create user object
        let user = new User();
        user.username = username;
        user.fullName = fullName;
        user.email = email;
        user.password = password;

        // save to db
        const result = await userRepo.addNewUser(user);

        // gen token
        const token = await gentoken(user);

        res.cookie("x-auth-token", token, {
            maxAge: 86400 * 100
        });
        res.send("register successful");
    }
)

export default router;