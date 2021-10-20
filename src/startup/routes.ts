import { Application } from "express";
import * as express from "express";
import userRoute from "../routes/userRoute";

export default function (app: Application) {
    app.use(express.json());
    app.use('/api/user', userRoute);
}