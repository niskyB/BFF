import { dbStartUp } from "./startup/db";
import * as express from "express";
import * as dotenv from "dotenv";
import * as path from "path";

// dotenv config
dotenv.config({
    path: path.resolve(__dirname, `./config/.env.${process.env.NODE_ENV}`)
});

// start up
const app = express();
dbStartUp();

// listen
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listen on port ${port}...`));
