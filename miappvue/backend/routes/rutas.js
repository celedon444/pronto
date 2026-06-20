const express = require('express')
const router = express.Router()
const pool = require('../db')
const verificarToken = require('../middleware/verificarToken')

router.get('/', verificarToken, async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM rutas')
        res.json(rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al obtener rutas' })
    }
})

router.get('/:id/paradas', verificarToken, async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM paradas WHERE id_ruta = $1', [req.params.id])
        res.json(rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al obtener paradas' })
    }
})

router.get('/:id/puntos', verificarToken, async (req, res) => {
    try {
        const sql = 'SELECT latitud, longitud, orden FROM ruta_puntos WHERE id_ruta = $1 ORDER BY orden'
        const { rows } = await pool.query(sql, [req.params.id])
        res.json(rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al obtener puntos' })
    }
})

module.exports = router