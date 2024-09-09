import request from "supertest";
import app from "../app";

describe("Register user route", () => {
  it("should check if user already exist and return status code 400 and error message", async () => {
    const res = await request(app).post("/api/users").send({
      firstname: "Jane",
      lastname: "Doe",
      email: "janedoe@example.com",
      password: "janedoe",
    });
    expect(res.statusCode).toEqual(400);
    expect(JSON.parse(res.text).message).toEqual("User already exists");
  });
});

describe("Login user route", () => {
  it("should login a user with a valid credential", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: "janedoe@example.com",
      password: "janedoe",
    });
    expect(res.statusCode).toEqual(200);
    expect(JSON.parse(res.text).status).toEqual("success");
  });
  it("should check if email or password is incorrect", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: "jane@example.com",
      password: "janedoe",
    });
    expect(res.statusCode).toEqual(401);
    expect(JSON.parse(res.text).message).toEqual("Invalid email or password");
  });
});
