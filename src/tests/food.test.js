import app from '../app.js'
import connection from '../database.js'
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
//     it("should return an array of objects contaning especific keys and status 200 if valid params",async ()=>{

//         const body = {
//             name:"teste name",
//             category:"teste category",
//             price:"400",
//             image:"test.jpg"
        
//         }

//         await supertest(app).post("/food").send(body)

//         const result = await connection.query(`SELECT id FROM food WHERE name = 'teste name'`)


//         console.log('resultado do teste')
//         console.log(result.rows)
//         const id = result.rows[0].id

//         const idCategory= id

        
//         const result2 = await supertest(app).get(`/food/${idCategory}`)

//         expect(result2.status).toEqual(200);
        
//         expect(result2.body).toEqual(
//             expect.arrayContaining([
//                 expect.objectContaining({
//                     id:expect.any(Number),
//                     name: expect.any(string),
//                     foodCategory: expect.any(string),
//                     price: expect.any(Number),
//                     image: expect.any(string)
//                 })
    
//             ])
            
//         )
//     })
// })


afterAll(()=>{
    connection.end()
})