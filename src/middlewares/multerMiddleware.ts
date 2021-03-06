import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/statusConstants";
import multer from "multer";
import { Request, Response, NextFunction } from "express";
import { genResponseForm } from "../utils/responseHelper";

export function multerErrorMiddleware(multerAction: any) {
    return (req: Request, res: Response, next: NextFunction) => {
        multerAction(req, res, (err: any) => {
            if (err instanceof multer.MulterError) {
                return res.status(BAD_REQUEST).send(genResponseForm(null, err, err.message));
            }
            else if (err) {
                return res.status(INTERNAL_SERVER_ERROR).send(genResponseForm(null, null, err.message));
            }
            next();
        })
    };
}