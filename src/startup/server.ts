import "reflect-metadata";
import "./db";
import express from "express";
import * as dotenv from "dotenv";
import routeConfig from "./routes";
import { config } from "./config";
import { connection } from "./db";
// dotenv config
dotenv.config({
  path: `src/config/.env.${process.env.NODE_ENV}`,
});

// start up
const app = express();

// logging();
connection();
routeConfig(app);
config();
export { app };
