import request from "supertest";
import app from "../app";

let token = "";

beforeAll(async () => {
  const response = await request(app).post("/api/users/login").send({
    email: "nurudeen@gmail.com",
    password: "nurudeen",
  });
  token = response.body.token;
});

describe("Remove fixture route", () => {
  it("should error if fixture with the given ID does not exist", async () => {
    const res = await request(app)
      .delete("/api/fixtures/delete/66d9eb202021b3c66a6e5dfe")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(400);
    expect(JSON.parse(res.text).message).toEqual(
      "Fixture with the ID - 66d9eb202021b3c66a6e5dfe does not exist!"
    );
  });
});

describe("Update score route", () => {
  it("should update score for a given fixture", async () => {
    const res = await request(app)
      .put("/api/fixtures/score/66dcff4d64c323e0812de700")
      .send({
        homeScore: 3,
        awayScore: 1,
      })
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(201);
    expect(JSON.parse(res.text).message).toEqual("Score updated successfully!");
  });
  it("should check if home and away scores are passed", async () => {
    const res = await request(app)
      .put("/api/fixtures/score/66dcff4d64c323e0812de700")
      .send({
        awayScore: 1,
      })
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(400);
    expect(JSON.parse(res.text).message).toEqual(
      "Home and away scores are required"
    );
  });
  it("should error if fixture with the given ID does not exist", async () => {
    const res = await request(app)
      .put("/api/fixtures/score/66dcff4d64c323e0812de734")
      .send({
        homeScore: 3,
        awayScore: 1,
      })
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(400);
    expect(JSON.parse(res.text).message).toEqual(
      "Fixture with the ID - 66dcff4d64c323e0812de734 does not exist!"
    );
  });
});

describe("Update fixture route", () => {
  it("should update fixture by ID", async () => {
    const res = await request(app)
      .put("/api/fixtures/update/66dcff4d64c323e0812de700")
      .send({
        season: "2024/2025",
      })
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(201);
    expect(JSON.parse(res.text).message).toEqual(
      "Fixture with ID - 66dcff4d64c323e0812de700 updated successfully!"
    );
  });
  it("should error if fixture with the given ID does not exist", async () => {
    const res = await request(app)
      .put("/api/fixtures/update/66dcff4d64c323e0812de734")
      .send({
        season: "2024/2025",
      })
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(400);
    expect(JSON.parse(res.text).message).toEqual(
      "Fixture with the ID - 66dcff4d64c323e0812de734 does not exist!"
    );
  });
  it("should error if wrong season format is passed", async () => {
    const res = await request(app)
      .put("/api/fixtures/update/66dcff4d64c323e0812de700")
      .send({
        season: "Wrong season format",
      })
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(400);
    expect(JSON.parse(res.text).message).toEqual(
      `Wrong season format. Should follow this format - "YYYY/YYYY"!`
    );
  });
});

describe("Get fixtures by ID route", () => {
  it("should error if fixture with the given ID does not exist", async () => {
    const res = await request(app)
      .get("/api/fixtures/single/66dcff4d64c323e0812de746")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(400);
    expect(JSON.parse(res.text).message).toEqual(
      "Fixture with the ID - 66dcff4d64c323e0812de746 does not exist!"
    );
  });
});
