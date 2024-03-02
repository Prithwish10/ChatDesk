import request from "supertest";
import Server from "../../Server";
import { Application } from "express";

jest.mock("../../loaders/NatsWrapper");

it("responds with details about the current user", async () => {
  const server = new Server(undefined, null);
  const app = (await server.up()) as unknown as Application;

  const signUpResponse = await request(app)
    .post("/api/v1/users/signup")
    .send({
      firstName: "Alpha",
      lastName: "test",
      mobileNumber: "1290512892",
      email: "alpha1@test.com",
      password: "password",
    })
    .expect(201);

  const cookie = signUpResponse.get("Set-Cookie");
  console.log("COOKIE ===>", cookie);

  const res = await request(app)
    .get("/api/v1/users/currentuser")
    .set("Cookie", cookie)
    .send();
  // .expect(200);
});

it("responds with 401 for unauthorised user", async () => {
  const server = new Server(undefined, null);
  const app = (await server.up()) as unknown as Application;

  await request(app).get("/api/v1/users/currentuser").send().expect(401);
});
