import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer  } from 'mongodb-memory-server';
import app from '../src/app.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

describe("Auth Flow", () => {
  it("should register a new student", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        fullName: "Test User",
        email: "test@example.com",
        password: "Password123!",
        role: "student"
      });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe("test@example.com");
  });

  it("should fail to register with an existing email", async () => {
    await request(app).post("/api/auth/register").send({
      fullName: "Test User 1",
      email: "duplicate@example.com",
      password: "Password123!",
    });

    const res = await request(app).post("/api/auth/register").send({
      fullName: "Test User 2",
      email: "duplicate@example.com",
      password: "Password123!",
    });

    expect(res.status).toBe(409);
    expect(res.body.message).toBe("Email is already in use.");
  });

  it("should login successfully and fetch profile", async () => {
    // Register
    await request(app).post("/api/auth/register").send({
      fullName: "Login User",
      email: "login@example.com",
      password: "Password123!",
    });

    // Login
    const loginRes = await request(app).post("/api/auth/login").send({
      email: "login@example.com",
      password: "Password123!",
    });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.token).toBeDefined();

    const token = loginRes.body.token;

    // Me
    const meRes = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.user.email).toBe("login@example.com");
  });
});
