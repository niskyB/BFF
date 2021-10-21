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