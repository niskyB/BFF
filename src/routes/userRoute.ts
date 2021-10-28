import { ServerRequest, RequestWithUser } from "../interfaces/common/Request";
import { Response } from "express";
import * as express from "express";
import { RegisterUserDTO, LoginUserDTO, UpdatePasswordUserDTO, UpdateProfileUserDTO } from "../interfaces/dtos/user";
import { validateLoginUser, validateUpdatePasswordUser, validateUpdateProfileUser, validateUser } from "../validator/User";
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND } from "../constants/statusConstants";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../Repository/UserRepository";
import { User } from "../entity/User";
import { gentoken } from "../utils/userHelper";
import authenMiddleware from "../middlewares/authenMiddleware";
import * as bcrypt from "bcrypt";
import { genResponseForm } from "../utils/responseHelper";
import { multerErrorMiddleware } from "../middlewares/multerMiddleware";
import { upload } from "../utils/multerHelper";
const router = express.Router();

// Get logout
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

// Get me
router.get(
    '/me',
    authenMiddleware,
    async (req: RequestWithUser<User>, res: Response) => {
        // get connection
        const userRepo = getCustomRepository(UserRepository);

        // get user from token
        const user = await userRepo.findUserById(req.user.userId);

        // check current user
        if (!user) {
            return res.status(NOT_FOUND).send(genResponseForm(null, null, 'cannot find the current user'));
        }

        // send user info
        let showedUser = new User();
        showedUser.username = user.username;
        showedUser.fullName = user.fullName;
        showedUser.email = user.email;
        showedUser.address = user.address;
        showedUser.phone = user.phone;
        showedUser.avatar = user.avatar;
        res.send(genResponseForm(showedUser, null, "get information of the current user successful"));
    }
)

// Post login
router.post(
    '/login',
    async (req: ServerRequest<LoginUserDTO>, res: Response) => {
        // validate data
        const { error } = validateLoginUser(req.body);
        if (error) {
            const errors = error.details.reduce((pre, next) => {
                return {
                    ...pre,
                    [next.context.label]: next.message
                }
            }, {});
            return res.status(BAD_REQUEST).send(genResponseForm(null, errors, 'Invalid params'));
        }

        // get params from req body
        const { username, password } = req.body;

        // get connection
        const userRepo = getCustomRepository(UserRepository);

        // check existed user
        const user = await userRepo.findUserByUsername(username);
        if (!user) return res.status(BAD_REQUEST).send(genResponseForm(null, null, 'username or password is wrong'));

        // check password
        if (!await bcrypt.compare(password, user.password)) return res.status(BAD_REQUEST).send(genResponseForm(null, null, 'username or password is wrong'));

        // gen token
        const token = await gentoken(user);

        // set token to cookies
        res.cookie("x-auth-token", token, {
            maxAge: 86400 * 100
        });
        res.send(genResponseForm(null, null, 'login successful'));
    }
)

// Post register
router.post(
    '/register',
    async (req: ServerRequest<RegisterUserDTO>, res: Response) => {
        // validate data
        const { error } = validateUser(req.body);
        if (error) {
            const errors = error.details.reduce((pre, next) => {
                return {
                    ...pre,
                    [next.context.label]: next.message
                }
            }, {});
            return res.status(BAD_REQUEST).send(genResponseForm(null, errors, 'Invalid params'));
        }

        // get params from req body
        const { username, fullName, email, password } = req.body;

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

        if (duplicatedField.username != "" || duplicatedField.email != "") return res.status(BAD_REQUEST).send(genResponseForm(null, duplicatedField, 'invalid username or email'));

        // create user object
        let user = new User();
        user.username = username;
        user.fullName = fullName;
        user.email = email;
        user.password = password;

        // save to db
        const result = await userRepo.addNewUser(user);

        // gen token
        const token = await gentoken(result);

        res.cookie("x-auth-token", token, {
            maxAge: 86400 * 100
        });
        res.status(CREATED).send(genResponseForm(null, null, "register successful"));
    }
);

// Put update password
router.put(
    '/me/updatePassword',
    authenMiddleware,
    async (req: RequestWithUser<UpdatePasswordUserDTO>, res: Response) => {
        // validate data
        const { error } = validateUpdatePasswordUser(req.body);
        if (error) {
            const errors = error.details.reduce((pre, next) => {
                return {
                    ...pre,
                    [next.context.label]: next.message
                }
            }, {});
            return res.status(BAD_REQUEST).send(genResponseForm(null, errors, 'Invalid params'));
        }

        // get connection
        const userRepo = getCustomRepository(UserRepository);

        // get current user
        const user = await userRepo.findUserById(req.user.userId);

        // check current user
        if (!user) {
            return res.status(NOT_FOUND).send(genResponseForm(null, null, 'cannot find the current user'));
        }

        // check password
        if (!await bcrypt.compare(req.body.currentPassword, user.password)) {
            return res.status(BAD_REQUEST).send(genResponseForm(null, null, 'the current password is incorrect'));
        }

        // check current password and new password
        if (req.body.currentPassword === req.body.password) {
            return res.status(BAD_REQUEST).send(genResponseForm(null, null, 'new password should be different with current password'));
        }

        // update password
        const result = await userRepo.updateUserPassword(req.user.userId, req.body.password);

        // check query
        if (!result) return res.status(INTERNAL_SERVER_ERROR).send(genResponseForm(null, null, 'Something went wrong'));

        res.send(genResponseForm(null, null, 'update password successful'));
    }
);

// Put update profile
router.put(
    '/me/updateProfile',
    [
        authenMiddleware,
        multerErrorMiddleware(upload.single('avatar'))
    ],
    async (req: RequestWithUser<UpdateProfileUserDTO>, res: Response) => {
        const { error } = validateUpdateProfileUser(req.body);
        if (error) {
            const errors = error.details.reduce((pre, next) => {
                return {
                    ...pre,
                    [next.context.label]: next.message
                }
            }, {});
            return res.status(BAD_REQUEST).send(genResponseForm(null, errors, 'Invalid params'));
        }

        // get connection
        const userRepo = getCustomRepository(UserRepository);

        // get current user
        let user = await userRepo.findUserById(req.user.userId);

        // check current user
        if (!user) {
            return res.status(NOT_FOUND).send(genResponseForm(null, null, 'cannot find the current user'));
        }

        // check existed email
        const isExistedEmail = await userRepo.findUserByEmail(req.body.email);
        if (req.body.email != user.email && isExistedEmail) {
            return res.status(BAD_REQUEST).send(genResponseForm(null, null, 'the given email is already existed'));
        }

        // check avatar
        if (req.file) {
            req.body.avatar = req.file.filename;
        }

        // set the current value if have null params
        user.fullName = req.body.fullname;
        user.email = req.body.email;
        user.address = req.body.address ? req.body.address : user.address;
        user.phone = req.body.phone ? req.body.phone : user.phone;
        user.avatar = req.body.avatar ? req.body.avatar : user.avatar;

        // update to database
        const result = await userRepo.updateUserProfile(user);

        // check query
        if (!result) return res.status(INTERNAL_SERVER_ERROR).send(genResponseForm(null, null, 'Something went wrong'));

        res.send(genResponseForm(null, null, "update profile successful"));
    }
)

export default router;