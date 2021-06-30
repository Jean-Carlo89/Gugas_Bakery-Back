import pg from 'pg'

const {Pool} = pg

const connection = new Pool({
    user: 'postgres',
    password: '123456',
    host: 'localhost',
    port: 5432,
    database:process.env.NODE_ENV === "test" ? 'gugas_bakery_test': 'gugas_bakery'

})

export default connection
