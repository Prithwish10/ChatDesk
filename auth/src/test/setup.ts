import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import Server from "../Server";
import { Application } from "express";

declare global {
  var getAuthCookie: () => Promise<string[]>;
}

jest.mock("../config/config.global");
jest.setTimeout(30000);

let mongo: any;
beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  console.log("URI", mongoUri);
  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.getAuthCookie = async () => {
  const server = new Server(undefined, null);
  const app = (await server.up()) as unknown as Application;

  const response = await request(app)
    .post("/api/v1/users/signup")
    .send({
      firstName: "Alpha",
      lastName: "test",
      mobileNumber: "1290512892",
      email: "test@test.com",
      password: "test_password",
    })
    .expect(201);

  const cookie = response.get('Set-Cookie');

  return cookie;
};
