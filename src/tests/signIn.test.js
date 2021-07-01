import app from "../app.js"
import connection from '../database.js'
import supertest from 'supertest'

beforeEach(async()=>{
    await connection.query(`DELETE FROM users`)
})

describe("Post / sign-in" ,()=>{

   
    it("should return 400 if user exists but password is invalid", async ()=>{

        const body = {
            email:'teste@gmail.com',
            name:'teste',
            password:'123456'
        }

        await supertest(app).post("/sign-up").send(body)


        body["password"] = 'testeErroSenha'
        delete body["name"]

        const result = await supertest(app).post("/sign-in").send(body)
        const status = result.status

        expect(status).toEqual(401)


    })

    it("should return 400 if invalid email", async ()=>{

        const body = {
            email:'testegmail.com',
            password:'123456'
        }

        const result = await supertest(app).post("/sign-in").send(body)
        const status = result.status

        expect(status).toEqual(400)
    })

    it("should return an object containing token and name keys if valid params", async ()=>{
        const body = {
            email:'teste@gmail.com',
            name:'teste',
            password:'123456'
        }

        await supertest(app).post("/sign-up").send(body)

        delete body["name"]

        const result = await supertest(app).post('/sign-in').send(body)

        expect(result.status).toEqual(200);
        expect(result.body).toEqual(
            expect.objectContaining({
                token:expect.any(String),
                user:expect.any(String)
            })

        )




    })

    

})

afterAll(()=>{
    connection.end()
})