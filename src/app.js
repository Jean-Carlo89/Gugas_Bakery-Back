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
    console.log(hash)
    
    
    try{

        const checkIfEmailExist = await connection.query(`
        SELECT *
        FROM users
        WHERE email=$1
        `,[email])

        if(checkIfEmailExist.rows.length){
            res.sendStatus(400)
            //console.log('entrou aqui')
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

export default app