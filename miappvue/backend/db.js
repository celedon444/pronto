const mysql = require('mysql2')
require('dotenv').config()

// Cambiamos createConnection por createPool
const conexion = mysql.createPool({
    host: 'mysql.railway.internal', // El host interno de tu delfín en Railway
    port: 3306,
    user: 'root',
    password: 'CoKvZqZatICKPXphbadPYyhRggucVlyv', // Tu contraseña real de la captura anterior
    database: 'railway', // El nombre de la base de datos por defecto de Railway
    waitForConnections: true,
    connectionLimit: 10,
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