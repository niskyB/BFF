import { User } from "../entity/User";

export function genResponseForm(data: Object, error: Object, message: string) {
    return {
        data: data,
        error: error,
        message: message
    }
}