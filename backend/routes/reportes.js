const express = require('express')
const router = express.Router()
const pool = require('../db')
const verificarToken = require('../middleware/verificarToken')

router.get('/', verificarToken, async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM reportes ORDER BY creado_en DESC')
        res.json(rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al obtener reportes' })
    }
})

router.post('/', verificarToken, async (req, res) => {
    const { usuario, mensaje } = req.body
    if (!usuario || !mensaje) return res.status(400).json({ error: 'Datos incompletos' })
    try {
        await pool.query('INSERT INTO reportes (usuario, mensaje) VALUES ($1, $2)', [usuario, mensaje])
        res.json({ mensaje: 'Reporte guardado' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al guardar reporte' })
    }
})

module.exports = router