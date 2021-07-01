import pg from 'pg'
import './setup.js'; 
const {Pool} = pg



const databaseConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.NODE_ENV === "test" ? 'gugas_bakery_test':process.env.DB_DATABASE

}

// const databaseConfig = {
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//         rejectUnauthorized: false
//     }
// }


const connection = new Pool(databaseConfig)




export default connection
