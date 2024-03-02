import request from "supertest";
import Server from "../../Server";
import { Application } from "express";

jest.mock("../../loaders/NatsWrapper");

it("responds with details about the current user", async () => {
  const server = new Server(undefined, null);
  const app = (await server.up()) as unknown as Application;

  const cookie = await getAuthCookie();
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
