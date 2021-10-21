import * as Joi from "joi";
import { stringCustomEmail, stringCustomMessage } from "./common/message";
import { LoginUserDTO, RegisterUserDTO } from "../interfaces/dtos/user";

const userSchema = Joi.object<RegisterUserDTO>({
    username: Joi.string().min(3).max(50).required().messages(stringCustomMessage),
    fullName: Joi.string().min(3).max(255).required().messages(stringCustomMessage),
    email: Joi.string().min(5).max(255).email().required().messages(stringCustomEmail),
    password: Joi.string().min(5).max(255).required().messages(stringCustomMessage),
    confirmPassword: Joi.string().min(5).max(255).required().valid(Joi.ref("password")).messages(stringCustomMessage)
});

const loginUserSchema = Joi.object<LoginUserDTO>({
    username: Joi.string().required().trim().messages(stringCustomMessage),
    password: Joi.string().required().trim().messages(stringCustomMessage)
});

export const validateUser = (user: RegisterUserDTO) => {
    return userSchema.validate(user, { abortEarly: false });
}

export const validateLoginUser = (user: LoginUserDTO) => {
    return loginUserSchema.validate(user, { abortEarly: false });
}