import { User } from "../entity/User";

export function genResponseForm(data: User, error: Object, message: string) {
    return {
        data: data,
        error: error,
        message: message
    }
}