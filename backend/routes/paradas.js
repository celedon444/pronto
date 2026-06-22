const express = require('express')
const router = express.Router()
const pool = require('../db')
const verificarToken = require('../middleware/verificarToken')

router.get('/', verificarToken, async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM paradas')
        res.json(rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al obtener paradas' })
    }
})

module.exports = router