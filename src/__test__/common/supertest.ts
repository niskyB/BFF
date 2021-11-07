import { app } from "../../startup/server";
import supertest from "supertest";

export const request = supertest(app);