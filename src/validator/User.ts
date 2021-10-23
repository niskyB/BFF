import * as Joi from "joi";
import { stringCustomEmail, stringCustomMessage, stringCustomPhone } from "./common/message";
import { LoginUserDTO, RegisterUserDTO, UpdatePasswordUserDTO, UpdateProfileUserDTO } from "../interfaces/dtos/user";

const userSchema = Joi.object<RegisterUserDTO>({
    username: Joi.string().min(3).max(50).required().messages(stringCustomMessage),
    fullName: Joi.string().min(3).max(255).required().messages(stringCustomMessage),
    email: Joi.string().min(3).max(255).email().required().messages(stringCustomEmail),
    password: Joi.string().min(3).max(255).required().messages(stringCustomMessage),
    confirmPassword: Joi.string().min(3).max(255).required().valid(Joi.ref("password")).messages(stringCustomMessage)
});

const loginUserSchema = Joi.object<LoginUserDTO>({
    username: Joi.string().required().trim().messages(stringCustomMessage),
    password: Joi.string().required().trim().messages(stringCustomMessage)
});

const updatePasswordUserSchema = Joi.object<UpdatePasswordUserDTO>({
    currentPassword: Joi.string().required().trim().messages(stringCustomMessage),
    password: Joi.string().required().trim().messages(stringCustomMessage),
    confirmPassword: Joi.string().required().valid(Joi.ref("password")).messages(stringCustomMessage)
});

const updateProfileUserSchema = Joi.object<UpdateProfileUserDTO>({
    fullname: Joi.string().min(3).max(255).required().messages(stringCustomMessage),
    email: Joi.string().min(3).max(255).email().required().messages(stringCustomEmail),
    address: Joi.string().max(500).messages(stringCustomMessage),
    phone: Joi.string().min(6).max(20).pattern(/^[0-9]+$/).messages(stringCustomPhone),
});

export const validateUser = (user: RegisterUserDTO) => {
    return userSchema.validate(user, { abortEarly: false });
}

export const validateLoginUser = (user: LoginUserDTO) => {
    return loginUserSchema.validate(user, { abortEarly: false });
}

export const validateUpdatePasswordUser = (user: UpdatePasswordUserDTO) => {
    return updatePasswordUserSchema.validate(user, { abortEarly: false });
}

export const validateUpdateProfileUser = (user: UpdateProfileUserDTO) => {
    return updateProfileUserSchema.validate(user, { abortEarly: false });
}