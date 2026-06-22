const fs = require('fs')
const path = require('path')
const pool = require('./db')

// función para leer y convertir archivos del frontend
function leerDato(archivo) {
    const ruta = path.join(__dirname, '../src/data/', archivo)
    let contenido = fs.readFileSync(ruta, 'utf8')
    contenido = contenido.replace(/export const \w+ = /, 'module.exports = ')
    contenido = contenido.replace(/\/\/.*$/gm, '') // quita comentarios
    const temp = path.join(__dirname, 'temp_' + archivo)
    fs.writeFileSync(temp, contenido)
    const data = require(temp)
    fs.unlinkSync(temp)
    return data
}

const rutas = leerDato('rutas.js')
const buses = leerDato('buses.js')

async function insertar() {
    // insertar rutas
    for (const ruta of rutas) {
        const codigo = ruta.nombre.split(' - ')[0]
        const result = await pool.query(
            'INSERT INTO rutas (codigo, nombre) VALUES ($1, $2) RETURNING id',
            [codigo, ruta.nombre]
        )
        const idRuta = result.rows[0].id

        // insertar puntos de la ruta
        for (let i = 0; i < ruta.puntos.length; i++) {
            const [lat, lng] = ruta.puntos[i]
            await pool.query(
                'INSERT INTO ruta_puntos (id_ruta, latitud, longitud, orden) VALUES ($1, $2, $3, $4)',
                [idRuta, lat, lng, i]
            )
        }
        console.log(`Ruta insertada: ${ruta.nombre}`)
    }

    // insertar buses
    for (const bus of buses) {
        const codigo = bus.ruta.split(' - ')[0]
        const rutaResult = await pool.query(
            'SELECT id FROM rutas WHERE codigo = $1', [codigo]
        )
        const ruta = rutaResult.rows[0]
        await pool.query(
            'INSERT INTO buses (conductor, placa, capacidad, estado, latitud, longitud, id_ruta) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [bus.conductor, bus.placa, bus.capacidad, bus.estado, bus.posicion[0], bus.posicion[1], ruta.id]
        )
        console.log(`Bus insertado: ${bus.placa}`)
    }

    console.log('¡Datos migrados correctamente!')
    process.exit()
}

insertar()