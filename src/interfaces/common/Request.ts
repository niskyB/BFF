import { Request } from "express";
import { User } from "../../entity/User";

export interface ServerRequest<T> extends Request {
    body: T;
}

export interface RequestWithUser<T> extends Request {
    body: T,
    user: User
}

export interface RequestWithCategory<T> extends Request {
    body: T
}

export interface RequestWithProduct<T> extends Request {
    body: T
}