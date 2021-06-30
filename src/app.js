import express from "express";
import cors from "cors";
import joi from "joi";
import connection from "./databse.js";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/purchases", async (req, res) => {

  const purchaseSchema = joi.object({
    price: joi.number().integer().required(),
  });

  try {
    if (!req.headers.authorization) {
      return res.sendStatus(401);
    }

    const token = req.headers.authorization.replace("Bearer ", "");

    const validation = purchaseSchema.validate(req.body);

    if (validation.error) {
      return res.sendStatus(400);
    }

    const userPurchasing = await connection.query(
      `
            SELECT "userId" 
            FROM sessions
            WHERE token=$1
        `,
      [token]
    );

    const id = userPurchasing.rows[0].userId;

    if (!id) {
      return res.sendStatus(400);
    }

    await connection.query(
      `
            INSERT INTO purchases 
            ("userId", price) 
            VALUES ($1,$2);
        `,
      [ id, req.body.price]
    );
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post("/sign-up", async (req, res) => {
  const { name, email, password } = req.body;

  const userSchema = joi.object({
    name: joi.string().min(3).required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
  });

  const validate = userSchema.validate(req.body);

  if (validate.error) {
    res.status(400).send("Algum dos dados está inválido");
    return;
  }

  const hash = bcrypt.hashSync(password, 12);
  //console.log(hash)
  //

  try {
    const checkIfEmailExist = await connection.query(
      `
        SELECT *
        FROM users
        WHERE email=$1
        `,
      [email]
    );

    if (checkIfEmailExist.rows.length) {
      res.sendStatus(400);

      return;
    }

    await connection.query(
      `
        INSERT INTO users (name,email,password)
        VALUES ($1,$2,$3)
        `,
      [name, email, hash]
    );

    res.sendStatus(200);
  } catch (e) {
    console.log("Erro ao salvar novo usuário");
    console.log(e);
  }
});

app.post("/sign-in", async (req, res) => {
  // console.log(req.body)
  const { email, password } = req.body;

  const userSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  });

  const validate = userSchema.validate(req.body);

  if (validate.error) {
    res.status(400).send("Algum dos dados está inválido");
    console.log("não passou no validate");
    return;
  }

  try {
    console.log("entrou no try");
    const result = await connection.query(
      `
        SELECT * FROM users
        WHERE email = $1
        `,
      [email]
    );

    const user = result.rows[0];

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = uuid();

      await connection.query(
        `
                INSERT INTO sessions ("userId" , token)
                VALUES($1,$2)

            `,
        [user.id, token]
      );

      const userData = {
        user: user.name,
        token: token,
      };
      res.status(200).send(userData);
    } else {
      res.status(401).send("email e/ou senha incorretos");
    }
  } catch (e) {
    console.log("Erro ao procurar usuário para login");
    console.log(e);
  }
});

export default app;
