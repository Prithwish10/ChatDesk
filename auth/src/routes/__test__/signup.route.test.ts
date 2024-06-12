import request from "supertest";
import createApp from "../../loaders/app";

jest.mock("../../loaders/NatsWrapper");

it("returns a 201 on successfull signup", async () => {
  const app = createApp();

  return request(app)
    .post("/api/v1/users/signup")
    .send({
      firstName: "Alpha",
      lastName: "test",
      mobileNumber: "1290512892",
      email: "alpha1@test.com",
      password: "alpha1@123",
    })
    .expect(201);
});

it("returns a 422 with an invalid email", async () => {
  const app = createApp();

  return request(app)
    .post("/api/v1/users/signup")
    .send({
      firstName: "Alpha",
      lastName: "test",
      mobileNumber: "1290512892",
      email: "alpha1@test",
      password: "alpha1@123",
    })
    .expect(422);
});

it("returns a 422 with an invalid password", async () => {
  const app = createApp();

  return request(app)
    .post("/api/v1/users/signup")
    .send({
      firstName: "Alpha",
      lastName: "test",
      mobileNumber: "1290512892",
      email: "alpha1@test",
      password: "a",
    })
    .expect(422);
});

it("returns a 422 with an missing firstName, lastName, email and password", async () => {
  const app = createApp();

  await request(app)
    .post("/api/v1/users/signup")
    .send({ firstName: "Alpha" })
    .expect(422);

  await request(app)
    .post("/api/v1/users/signup")
    .send({ lastName: "test" })
    .expect(422);

  await request(app)
    .post("/api/v1/users/signup")
    .send({ email: "alpha1@test.com" })
    .expect(422);

  await request(app)
    .post("/api/v1/users/signup")
    .send({ password: "abcdefg" })
    .expect(422);
});

it("disallows duplicate email", async () => {
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

  await request(app)
    .post("/api/v1/users/signup")
    .send({
      firstName: "Alpha",
      lastName: "test",
      mobileNumber: "1290512892",
      email: "alpha1@test.com",
      password: "alpha1@123",
    })
    .expect(409);
});

it("sets a cookie after successful signup", async () => {
  const app = createApp();

  const response = await request(app).post("/api/v1/users/signup").send({
    firstName: "Alpha",
    lastName: "test",
    mobileNumber: "1290512892",
    email: "alpha1@test.com",
    password: "alpha1@123",
  });
  expect(response.get("Set-Cookie")).toBeDefined();
});
