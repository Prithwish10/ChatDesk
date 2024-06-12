import request from "supertest";
import createApp from "../../loaders/app";

jest.mock("../../loaders/NatsWrapper");

it("clears the cookie after signing out", async () => {
  const app = createApp();

  await request(app)
    .post("/api/v1/users/signup")
    .send({
      firstName: "Alpha",
      lastName: "test",
      mobileNumber: "1290512892",
      email: "alpha1@test.com",
      password: "alpha1@123",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/v1/users/signout")
    .send()
    .expect(204);

  expect(response.get("Set-Cookie")).toBeDefined();
});
