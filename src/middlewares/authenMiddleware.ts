import { Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { BAD_REQUEST, UNAUTHORIZED } from "../constants/statusConstants";
import { User } from "../entity/User";
import { RequestWithUser } from "../interfaces/common/Request";

export default function (req: RequestWithUser<any>, res: Response, next: NextFunction) {
    // get token from cookies
    const token = req.cookies["x-auth-token"];

    // check token
    if (!token) return res.status(UNAUTHORIZED).send('Access denied. No token provided');

    try {
        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY) as User;
        req.user = decoded;
        next();
    } catch (err) {
        res.status(BAD_REQUEST).send("invalid token");
    }
}