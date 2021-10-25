import { Request } from "express";
import { Category } from "../../entity/Category";
import { User } from "../../entity/User";

export interface ServerRequest<T> extends Request {
    body: T;
}

export interface RequestWithUser<T> extends Request {
    body: T,
    user: User
}

export interface RequestWithCategory<T> extends Request {
    body: T,
    category: Category
}