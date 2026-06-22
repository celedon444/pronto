const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
})

pool.connect((error) => {
    if (error) {
        console.log('Error al conectar a la base de datos:', error)
        return
    }
    console.log('Conectado a Supabase (PostgreSQL) correctamente')
})

module.exports = pool