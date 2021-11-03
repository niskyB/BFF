import { app } from "../../index";
import supertest from "supertest";

export const request = supertest(app);