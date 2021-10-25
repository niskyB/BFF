import { Response, NextFunction } from "express";
import { FORBIDDEN } from "../constants/statusConstants";
import { RequestWithUser } from "../interfaces/common/Request";
import { genResponseForm } from "../utils/responseHelper";

export default function (req: RequestWithUser<any>, res: Response, next: NextFunction) {
    if (req.user.roleId == 0) return res.status(FORBIDDEN).send(genResponseForm(null, null, 'Access denied. No permission'))
    next();
}