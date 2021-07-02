import express from "express";
import cors from "cors";
import joi from "joi";
import connection from "./database.js";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";
import sendEmail from "./utils/sendEmail.js";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/purchases", async (req, res) => {
  const purchaseSchema = joi.object({
    price: joi.number().required(),
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
      [id, req.body.price]
    );

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post("/sendmail", async (req, res) => {
  const { price } = req.body;

  const mailSchema = joi.object({
    price: joi.number().required(),
  });

  try {
    if (!req.headers.authorization) {
      return res.sendStatus(401);
    }

    const token = req.headers.authorization.replace("Bearer ", "");

    const userPurchasing = await connection.query(
      `
            SELECT "userId" 
            FROM sessions
            WHERE token=$1
        `,
      [token]
    );

    const idUser = userPurchasing.rows[0].userId;
    console.log(idUser);

    if (!idUser) {
      return res.sendStatus(400);
    }

    const userEmail = await connection.query(
      `
            SELECT email 
            FROM users
            WHERE id=$1
        `,
      [idUser]
    );

    console.log(userEmail.rows[0].email);

    const validation = mailSchema.validate(req.body);

    if (validation.error) {
      return res.sendStatus(400);
    }
    const output = `
<h3>Obrigado por gastar ${price} reais na Guga's Bakery </h3>
<p>O Guga agradece o seu <strong>DINHEIRO</strong>.</p>`;

    sendEmail(userEmail.rows[0].email, "gugasbakery63@gmail.com", "Nova Compra", output);

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
    res.sendStatus(500);
  }
});

app.post("/sign-in", async (req, res) => {
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
    res.sendStatus(500);
  }
});

app.get("/categories", async (req, res) => {
  try {
    const result = await connection.query(`
        SELECT * FROM categories`);

    res.send(result.rows);
  } catch (e) {
    console.log("Erro ao pegar as categorias");
    console.log(e);
    res.sendStatus(500);
  }
});

app.post("/food", async (req, res) => {
  const { name, category, price, image } = req.body;

  try {
    await connection.query(
      `
        INSERT INTO food 
        (name,"foodCategory", price,image)
        VALUES ($1,$2,$3,$4)
        `,
      [name, category, price, image]
    );

    res.sendStatus(200);
  } catch (e) {
    console.log('Erro ao adicionar novo item em "food"');
    console.log(e);
    res.sendStatus(500);
  }
});

app.post("/categories", async (req, res) => {
  const { category, image } = req.body;

  try {
    await connection.query(
      `
        INSERT INTO categories 
        (category,image)
        VALUES ($1,$2)
        `,
      [category, image]
    );

    res.sendStatus(200);
  } catch(e) {
    console.log('Erro ao adicionar novo item em "categories"');
    console.log(e);
    res.sendStatus(500);
  }
});

app.get("/food/:idCategory", async (req, res) => {
  console.log(req.params);
  const categoryId = req.params.idCategory;
  console.log(categoryId);

  try {
    const result = await connection.query(
      `
                    SELECT categories.category
                    FROM categories
                    WHERE id = $1

                
            `,
      [categoryId]
    );

    console.log(result.rows);
    const category = result.rows[0].category;
    console.log(category);

    const getItens = await connection.query(
      `
             SELECT * FROM food WHERE "foodCategory" = $1
            `,
      [category]
    );

    res.send(getItens.rows);
  } catch (e) {
    console.log("Erro ao pegar itens da categoria");
    console.log(e);
    res.sendStatus(500);
  }
});

export default app;
