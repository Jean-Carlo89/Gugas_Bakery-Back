import app from "../app.js";
import connection from "../databse.js";
import supertest from "supertest";

beforeAll(async () => {
  await connection.query(`DELETE FROM sessions`);
  await connection.query(`DELETE FROM purchases`);

  await connection.query(
    `INSERT INTO sessions("userId", token)VALUES(1,'tokenTeste')`
  );
});

beforeEach(async () => {
  await connection.query(`DELETE FROM users`);
});

describe("Post /purchases", () => {
  it("should return 400 if price is not a number", async () => {
    const userBody = {
      email: "teste@gmail.com",
      name: "teste",
      password: "123456",
    };
    await supertest(app).post("/sign-up").send(userBody);
    const userLogged = await supertest(app).post("/sign-in").send(userBody);

    const body = { price: "banana" };

    const result = await supertest(app)
      .post("/purchases")
      .set("Authorization", `Bearer ${userLogged.body.token}`)
      .send(body);

    expect(result.status).toEqual(400);
  });

  it("should return 400 if price is undefined", async () => {
    const userBody = {
      email: "teste@gmail.com",
      name: "teste",
      password: "123456",
    };
    await supertest(app).post("/sign-up").send(userBody);
    const userLogged = await supertest(app).post("/sign-in").send(userBody);

    const body = { price: "banana" };

    const result = await supertest(app)
      .post("/purchases")
      .set("Authorization", `Bearer ${userLogged.body.token}`)
      .send(body);

    expect(result.status).toEqual(400);
  });

  it("should return 401 if token is empty", async () => {
    const body = { price: 1000 };

    const result = await supertest(app).post("/purchases").send(body);

    expect(result.status).toEqual(401);
  });

  it("should return 201 for valid params", async () => {
    const body = { price: 1000 };

    const result = await supertest(app)
      .post("/purchases")
      .set("Authorization", "tokenTeste")
      .send(body);
    expect(result.status).toEqual(201);
  });
});

afterAll(async () => {
  await connection.query(`DELETE FROM purchases`);
  connection.end();
});
