import { Response, NextFunction } from "express";
import { INTERNAL_SERVER_ERROR } from "../constants/statusConstants";

export function error(err: Error, req: any, res: Response, next: NextFunction) {
    console.error(err);
    res.status(INTERNAL_SERVER_ERROR).send('Something faild.');
}