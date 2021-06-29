import app from "../app.js"
import connection from '../databse.js'
import supertest from 'supertest'

// beforeEach(()=>{

// })

describe("Post / sign-in" ,()=>{

   
    it("should return 400 if user exists but password is invalid", async ()=>{

        const body = {
            email:'teste@gmail.com',
            password:'123456'
        }

        await supertest(app).post("/sign-up").send(body)


        body["password"] = 'testeErroSenha'

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


})

afterAll(()=>{
    connection.end()
})