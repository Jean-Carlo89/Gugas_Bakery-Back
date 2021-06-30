import express from 'express'
import cors from 'cors'
import joi from 'joi'
import  connection  from './databse.js'
import {v4 as uuid} from 'uuid'
import bcrypt from 'bcrypt'


const app = express()

app.use(cors())
app.use(express.json())


app.post("/sign-up", async(req,res)=>{

    const {name,email,password} = req.body

    const userSchema = joi.object(
        {
            name:joi.string().min(3).required(),
            email:joi.string().email().required(),
            password:joi.string().required()
        }
    )

    const validate = userSchema.validate(req.body)

    if(validate.error){
        res.status(400).send('Algum dos dados está inválido')
        return
    }

    const hash = bcrypt.hashSync(password,12)
    //console.log(hash)
   // 
    
    try{

        const checkIfEmailExist = await connection.query(`
        SELECT *
        FROM users
        WHERE email=$1
        `,[email])

        if(checkIfEmailExist.rows.length){
            res.sendStatus(400)
            
            return
        }

        
        await connection.query(`
        INSERT INTO users (name,email,password)
        VALUES ($1,$2,$3)
        `,[name,email,hash])

        res.sendStatus(200)
    }catch(e){
        console.log('Erro ao salvar novo usuário')
        console.log(e)
    }

})

app.post("/sign-in", async(req,res)=>{

   // console.log(req.body)
    const {email,password} = req.body

    const userSchema = joi.object(
        {
            email:joi.string().email().required(),
            password:joi.string().required()
        }
    )

    const validate = userSchema.validate(req.body)

    if(validate.error){
        res.status(400).send('Algum dos dados está inválido')
        console.log('não passou no validate')
        return
    }
    
    try{
        console.log('entrou no try')
        const result = await connection.query(`
        SELECT * FROM users
        WHERE email = $1
        `,[email])

        const user = result.rows[0]

        if(user && bcrypt.compareSync(password,user.password)){
            const token = uuid()

            await connection.query(`
                INSERT INTO sessions ("userId" , token)
                VALUES($1,$2)

            `,[user.id,token])

            const userData = {
                user:user.name,
                token:token
            }
            res.status(200).send(userData)
        }else{
            res.status(401).send('email e/ou senha incorretos')
        }
    }catch(e){
        console.log('Erro ao procurar usuário para login')
        console.log(e)
    }


    
})

app.get("/categories", async(req,res)=>{

    try{
        const result = await connection.query(`
        SELECT * FROM categories`)

        res.send(result.rows)
    }catch(e){
        console.log('Erro ao pegar as categorias')
        console.log(e)
        res.sendStatus(500)
    }
    
})

app.post("/food", async(req,res)=>{

        const {name,category,price,image} = req.body
    
       try{

       await connection.query(`
        INSERT INTO food 
        (name,"foodCategory", price,image)
        VALUES ($1,$2,$3,$4)
        `,[name,category,price,image])

        res.sendStatus(200)
       }catch(e){
        console.log('Erro ao adicionar novo item em "food"')
        console.log(e)
        res.sendStatus(500)
       }
       
        
    })

    app.post("/categories", async(req,res)=>{

        const {category,image} = req.body
    
       try{

       await connection.query(`
        INSERT INTO categories 
        (category,image)
        VALUES ($1,$2)
        `,[category,image])

        res.sendStatus(200)
       }catch(e){
        console.log('Erro ao adicionar novo item em "categories"')
        console.log(e)
        res.sendStatus(500)
       }
       
        
    })

    app.get("/food/:idCategory" , async(req,res)=>{

        

        const categoryId = req.params.idCategory
        console.log(categoryId)

        // try{
        //     const result = await connection.query(`
        //         SELECT categories.category, food.* FROM categories
        //         JOIN food 
        //         WHERE category.id = $1 AND food."foodCategory" = categories.category

                
        //     `,[categoryId])

        //     console.log( result.rows)
        // }catch(e){
        //     console.log('Erro ao pegar itens da categoria')
        //     console.log(e)
        // }

        try{
            const result = await connection.query(`
                    SELECT categories.category
                    FROM categories
                    WHERE id = $1

                
            `,[categoryId])
            
            console.log( result.rows)
            const category = result.rows[0].category
            console.log(category)

            const getItens = await connection.query(`
             SELECT * FROM food WHERE "foodCategory" = $1
            `,[category])

            res.send(getItens.rows)
        }catch(e){
            console.log('Erro ao pegar itens da categoria')
            console.log(e)
        }
        
    })


export default app