import app from '../app.js'
import connection from '../databse.js'
import supertest from 'supertest'

beforeEach(async ()=>{
    await connection.query(`DELETE FROM food`)
})

describe("POST /food", ()=>{
    it("should return 200 if valid params", async ()=>{

        const body = {
            name:"teste name",
            category:"teste category",
            price:"400",
            image:"test.jpg"
        
        }

        const result = await supertest(app).post("/food").send(body)

        expect(result.status).toEqual(200)
    })
})


// describe("GET /food:idCategory", ()=>{
//     it("should return an array of objects contaning especific keys and status 200 if valid params",()=>{

//         const body = {
//             name:"teste name",
//             category:"teste category",
//             price:"400",
//             image:"test.jpg"
        
//         }

//         await supertest(app).post("/food").send(body)

//         const body2 = {
//             name:"teste name test2",
//             category:"teste category 2",
//             price:"400",
//             image:"testsausddj8as90.jpg"
        
//         }

//         await supertest(app).post("/food").send(body2)

//         connst result = await supertest(app).get("/food/:idCategory")
//     })
// })


afterAll(()=>{
    connection.end()
})