import { Application } from "express";
import * as express from "express";
import userRoute from "../routes/userRoute";
import { error } from "../middlewares/error";
import * as cookieParser from "cookie-parser";

export default function (app: Application) {
    app.use(express.json());
    app.use(cookieParser());
    app.use('/api/user', userRoute);
    app.use(error);
}