import { ServerRequest, RequestWithUser } from "../interfaces/common/Request";
import { Request, Response } from "express";
import * as express from "express";
import { RegisterUserDTO, LoginUserDTO } from "../interfaces/dtos/user";
import { validateLoginUser, validateUser } from "../validator/User";
import { BAD_REQUEST, CREATED } from "../constants/statusConstants";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../Repository/UserRepository";
import { User } from "../entity/User";
import { gentoken } from "../utils/userHelper";
import authenMiddleware from "../middlewares/authenMiddleware";
import * as bcrypt from "bcrypt";
const router = express.Router();

router.get(
    '/me/logout',
    authenMiddleware,
    async (req: ServerRequest<User>, res: Response) => {
        res.cookie("x-auth-token", "", {
            maxAge: -1
        });
        res.send('logout success!')
    }
)

router.get(
    '/me',
    authenMiddleware,
    async (req: RequestWithUser<User>, res: Response) => {
        // get connection
        const userRepo = getCustomRepository(UserRepository);

        // get user from token
        const user = await userRepo.findUserById(req.user.userId);

        // send user info
        res.send({
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            address: user.address,
            phone: user.phone,
            roleId: user.roleId
        });
    }
)

router.post(
    '/login',
    async (req: ServerRequest<LoginUserDTO>, res: Response) => {
        // validate data
        const { error } = validateLoginUser(req.body);
        if (error) return res.status(BAD_REQUEST).send(error.details[0].message);

        // get params from req body
        const { username, password } = req.body;

        // get connection
        const userRepo = getCustomRepository(UserRepository);

        // check existed user
        const user = await userRepo.findUserByUsername(username);
        if (!user) return res.status(BAD_REQUEST).send('username or password is wrong');

        // check password
        if (!await bcrypt.compare(password, user.password)) return res.status(BAD_REQUEST).send('username or password is wrong');

        // gen token
        const token = await gentoken(user);

        // set token to cookies
        res.cookie("x-auth-token", token, {
            maxAge: 86400 * 100
        });
        res.send('login successful...');
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
        res.status(CREATED).send("register successful");
    }
)

export default router;