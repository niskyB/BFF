import { User } from "../../entity/User";

export interface RegisterUserDTO extends Pick<User, "username" | "fullName" | "email" | "password"> {
    confirmPassword: string
}

export interface LoginUserDTO extends Pick<User, "username" | "password"> { }

export interface UpdatePasswordUserDTO {
    currentPassword: string,
    password: string,
    confirmPassword: string,
}

export interface UpdateProfileUserDTO extends Pick<User, "fullName" | "email"> {
    address?: string,
    phone?: string,
    avatar?: string
}
