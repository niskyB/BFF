export interface RegisterUserDTO {
    username: string,
    fullName: string,
    email: string,
    password: string,
    confirmPassword: string
}

export interface LoginUserDTO {
    username: string,
    password: string
}

export interface UpdatePasswordUserDTO {
    currentPassword: string,
    password: string,
    confirmPassword: string,
}

export interface UpdateProfileUserDTO {
    fullname: string,
    email: string,
    address?: string,
    phone?: string,
    avatar?: string
}
