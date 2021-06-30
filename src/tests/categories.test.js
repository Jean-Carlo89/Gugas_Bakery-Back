import app from '../app.js'
import connection from '../databse.js'
import supertest from 'supertest'

beforeEach(async ()=>{
    await connection.query(`DELETE FROM categories`)
})

describe("GET /categories", ()=>{
    it("should return an object containing correct params", async ()=>{
        
        const body =   {
        
                category:'Test category',
                
                image:"https://i.pinimg.com/736x/74/3b/e6/743be6923ee3a684281dc983e5247864.jpg"
            
            }

        await supertest(app).post("/categories").send(body)


        const body2 =   {
        
            category:'Test category2',
            
            image:"https://i.pinimg.com/736.jpg"
        
        }

    await supertest(app).post("/categories").send(body2)

            const result = await supertest(app).get("/categories")

            expect(result.status).toEqual(200)
            
            
            
            expect(result.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        id:expect.any(Number),
                        category:expect.any(String),
                        image:expect.any(String)
                    })
        
                ])
                
            )
    })

    
})

describe("POST /categories" ,()=>{
    it("should return 200 if valid params",async ()=>{

        const body =   {
        
            category:'Test category',
            
            image:"https://i.pinimg.com/736x/74/3b/e6/743be6923ee3a684281dc983e5247864.jpg"
        
        }

        const result = await supertest(app).post("/categories").send(body)

        expect(result.status).toEqual(200)
    })
})

afterAll(()=>{
    connection.end()
})