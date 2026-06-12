const mysql = require('mysql2')
require('dotenv').config()

// Cambiamos createConnection por createPool
const conexion = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // Máximo de conexiones simultáneas
    queueLimit: 0
})

// Verificar la conexión inicial
conexion.getConnection((error, client) => {
    if (error) {
        console.log('Error al conectar a la base de datos:', error)
        return
    }
    console.log('Conectado a MySQL de Railway correctamente')
    client.release() // Devuelve la conexión al pool
})

module.exports = conexion