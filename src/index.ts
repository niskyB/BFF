import { dbStartUp } from "./startup/db";
import * as express from "express";
import * as dotenv from "dotenv";
import * as path from "path";
import routeConfig from "./startup/routes";
import { config } from "./startup/config";
import logging from "./startup/logging";
// dotenv config
dotenv.config({
    path: path.resolve(__dirname, `./config/.env.${process.env.NODE_ENV}`)
});

// start up
const app = express();
logging();
dbStartUp();
routeConfig(app);
config();


// listen
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listen on port ${port}...`));
