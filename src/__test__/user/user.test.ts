import { request } from "../common/supertest";
import { Response } from "express";
let userDetails: Object;

describe("POST Login request", () => {
    let userId: string;
    try {
        beforeEach(() => {
            console.log("Input user details!");
            userDetails = {
                "username": "loc05st",
                "password": "123456"
            }; //new user details to be created
        });


        afterEach(function () {
            console.log("User is created with ID : ", userId);
        });

        test("Login user", async done => {
            const result = request.post(`api/user/login`) //post() of supertest
                //.set('Authorization', `Token $  {request.token}`) //Authorization token
                .send(userDetails) //Request header
                .expect(200) //response to be 200
            console.log(result);
        })
    }
    catch (err) {
        console.log("Exception : ", err)
    }
});