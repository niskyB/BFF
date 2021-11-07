import "reflect-metadata";
import "./db";
import express from "express";
import * as dotenv from "dotenv";
import * as path from "path";
import routeConfig from "./routes";
import { config } from "./config";
import logging from "./logging";
// dotenv config
dotenv.config({
    path: path.resolve(__dirname, `./../config/.env.${process.env.NODE_ENV}`)
});


// start up
const app = express();

// logging();
routeConfig(app);
config();
export { app };

