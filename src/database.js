import pg from 'pg'
import './setup.js'; 
const {Pool} = pg

// const connection = new Pool({
//     user: 'postgres',
//     password: '123456',
//     host: 'localhost',
//     port: 5432,
//     database:process.env.NODE_ENV === "test" ? 'gugas_bakery_test': 'gugas_bakery'

// })


const connection = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.NODE_ENV === "test" ? 'gugas_bakery_test':process.env.DB_DATABASE

})




export default connection
