import "reflect-metadata";
import { Application } from "express";
import * as express from "express";
import userRoute from "../routes/userRoute";
import categoryRoute from "../routes/categoryRoute";
import productRoute from "../routes/productRoute";
import orderRoute from "../routes/orderRoute";
import { error } from "../middlewares/error";
import cookieParser from "cookie-parser";

export default function (app: Application) {
    app.use(express.json());
    app.use(cookieParser());
    app.use('/api/user', userRoute);
    app.use('/api/category', categoryRoute);
    app.use('/api/product', productRoute);
    app.use('/api/orders', orderRoute);
    app.use(error);
}