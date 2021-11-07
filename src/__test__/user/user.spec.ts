import { app } from "../../startup/server";

// import supertest from "supertest";

// describe("TEST CI/CD", () => {
//     it("test case 1", async () => {
//         const result = await supertest(app).post("/").send();
//         console.log(result.body);
//         expect(result.text).toBe("ok")
//     });
// });

import supertest from "supertest";

describe("POST Login request", () => {


    it("Login user", async () => {

        const result = await supertest(app).post(`/api/user/login`) //post() of supertest
            .send({
                "username": "loc05st",
                "password": "123456"
            })

        expect(result.statusCode).toBe(220);

    })

});