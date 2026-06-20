const express = require('express')
const router = express.Router()
const pool = require('../db')
const verificarToken = require('../middleware/verificarToken')

router.get('/', verificarToken, async (req, res) => {
    try {
        const sql = `
            SELECT b.*, r.codigo, r.nombre as nombre_ruta 
            FROM buses b 
            LEFT JOIN rutas r ON b.id_ruta = r.id
        `
        const { rows } = await pool.query(sql)
        res.json(rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al obtener buses' })
    }
})

module.exports = router