import app from '../app.js'
import supertest from 'supertest'
import connection from '../databse.js' 

beforeEach(async()=>{
    await connection.query(`DELETE FROM users`)
})

describe("Post / sign-up" , ()=>{

    it("should return 400 if email already in database",async ()=>{

        await connection.query(`
        INSERT INTO users (name,email,password)
        VALUES ('teste','teste@gmail.com','12345')
        `)
        
        const body = {
            name:'teste',
            email:'teste@gmail.com',
            password:'12345'
        }

        const result = await supertest(app).post("/sign-up").send(body)
        const status = result.status

        expect(status).toEqual(400)
      
     })

     it("should return 200 if valid params", async()=>{

        const body = {
            name:'teste',
            email:'teste@gmail.com',
            password:'12345'
        }

        const result = await supertest(app).post("/sign-up").send(body)
        const status = result.status

        expect(status).toEqual(200)
     })

     it(`should return status 400 if some of the data does not meet 
     requirements`, async()=>{
         let body = {
             name:'te',
             email:'teste@gmail.com',
             password:'12345'
         }
 
        let result = await supertest(app).post("/sign-up").send(body)
        let status = result.status
 
         expect(status).toEqual(400)
 
         body = {
             name:'teste',
             email:'testegmail.com',
             password:'12345'
         }
          result = await supertest(app).post("/sign-up").send(body)
          status = result.status
 
         expect(status).toEqual(400)
 
     })
 
     
})


afterAll(()=>{
    connection.end()
})