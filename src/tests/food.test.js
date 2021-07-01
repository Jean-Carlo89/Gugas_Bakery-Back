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


describe("GET /food:idCategory", ()=>{
    it("should return an array of objects contaning especific keys and status 200 if valid params",async ()=>{

        const newCategory = {
            "category":"Test category",
    
            "image":"https://www.thinnaeventos.com.br/wp-content/uploads/elementor/thumbs/doces-salgados-festa-delivery-salvador-e1595801639779-ot2j5r9u0umy66nzifc23c2yul03cwhwxcxmm529ag.jpg"
        }

        await supertest(app).post("/categories").send(newCategory)


        
        const body = {
            name:"teste name",
            category:"Test category",
            price:"400",
            image:"test.jpg"
        
        }

        await supertest(app).post("/food").send(body)

        const result = await connection.query(`select * from food as f, categories as c where f."foodCategory" = c.category`)
        const id = result.rows[0].id

        const idCategory= id

        
        const result2 = await supertest(app).get(`/food/${idCategory}`)

        expect(result2.status).toEqual(200);
        
        expect(result2.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id:expect.any(Number),
                    name: expect.any(String),
                    foodCategory: expect.any(String),
                    price: expect.any(Number),
                    image: expect.any(String)
                })
    
            ])
            
        )
    })
})


afterAll(async()=>{
    await connection.query(`DELETE FROM food`)
    await connection.query(`DELETE FROM categories`)

    connection.end()
})