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

describe("Remove team route", () => {
  it("should error if team with the given ID does not exist", async () => {
    const res = await request(app)
      .delete("/api/teams/delete/66dcfab57df9c1c405ab36d9")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(400);
    expect(JSON.parse(res.text).message).toEqual(
      "Team with the ID - 66dcfab57df9c1c405ab36d9 does not exist!"
    );
  });
});

describe("Update team route", () => {
  it("should error if team with the given ID does not exist", async () => {
    const res = await request(app)
      .put("/api/teams/update/66dcfab57df9c1c405ab36d9")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(400);
    expect(JSON.parse(res.text).message).toEqual(
      "Team with the ID - 66dcfab57df9c1c405ab36d9 does not exist!"
    );
  });
});

// describe("Get all team route", () => {
//   it("should return all teams", async () => {
//     const res = await request(app)
//       .get("/api/teams")
//       .set("Authorization", `Bearer ${token}`);
//     // expect(res.statusCode).toEqual(200);
//     expect(JSON.parse(res.text).message).toEqual(
//       "All teams returned successfully from database"
//     );
//   });
// });

describe("Get single team by ID route", () => {
  it("should error if team with the given ID does not exist", async () => {
    const res = await request(app)
      .get("/api/teams/66dcfab57df9c1c405ab36d9")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(400);
    expect(JSON.parse(res.text).message).toEqual(
      "Team with the ID - 66dcfab57df9c1c405ab36d9 does not exist!"
    );
  });
  it("should return a team with the valid ID", async () => {
    const res = await request(app)
      .get("/api/teams/66dcfab57df9c1c405ab36c2")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(JSON.parse(res.text).message).toEqual(
      "Team with ID - 66dcfab57df9c1c405ab36c2 returned successfully"
    );
  });
});
