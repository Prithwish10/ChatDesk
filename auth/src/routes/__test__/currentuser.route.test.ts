import request from "supertest";
import createApp from "../../loaders/app";

jest.mock("../../loaders/NatsWrapper");

it("responds with details about the current user", async () => {
  const app = createApp();

  const cookie = await getAuthCookie();
  console.log("COOKIE ===>", cookie);

  const res = await request(app)
    .get("/api/v1/users/currentuser")
    .set("Cookie", cookie)
    .send();
    // .expect(201); 
});

it("responds with 401 for unauthorised user", async () => {
  const app = createApp();

  await request(app).get("/api/v1/users/currentuser").send().expect(401);
});
