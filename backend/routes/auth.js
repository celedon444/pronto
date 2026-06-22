const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../db')

const SECRET = 'pronto_santa_marta_2026'

// Registro de usuario
router.post('/registro', async (req, res) => {
    const { usuario, contrasena } = req.body
    if (!usuario || !contrasena) {
        return res.status(400).json({ error: 'Usuario y contraseña son obligatorios' })
    }
    try {
        const hash = bcrypt.hashSync(contrasena, 10)
        const sql = 'INSERT INTO usuarios (usuario, contrasena) VALUES ($1, $2)'
        await pool.query(sql, [usuario, hash])
        res.json({ mensaje: 'Usuario registrado correctamente' })
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({ error: 'El usuario ya existe' })
        }
        console.error(error)
        return res.status(500).json({ error: 'Error al registrar usuario' })
    }
})

// Login de usuario
router.post('/login', async (req, res) => {
    const { usuario, contrasena } = req.body
    try {
        const sql = 'SELECT * FROM usuarios WHERE usuario = $1'
        const { rows } = await pool.query(sql, [usuario])
        if (rows.length === 0) {
            return res.status(400).json({ error: 'Usuario no encontrado' })
        }
        const usuarioDb = rows[0]
        const contrasenaValida = bcrypt.compareSync(contrasena, usuarioDb.contrasena)
        if (!contrasenaValida) {
            return res.status(400).json({ error: 'Contraseña incorrecta' })
        }
        const token = jwt.sign({ usuario: usuarioDb.usuario }, SECRET, { expiresIn: '8h' })
        res.json({ mensaje: 'Login exitoso', usuario: usuarioDb.usuario, token })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error en el servidor' })
    }
})

// Recuperar/cambiar contraseña
router.post('/recuperar', async (req, res) => {
    const { usuario, nuevaContrasena } = req.body
    if (!usuario || !nuevaContrasena) {
        return res.status(400).json({ error: 'Datos incompletos' })
    }
    try {
        const sqlBuscar = 'SELECT * FROM usuarios WHERE usuario = $1'
        const { rows } = await pool.query(sqlBuscar, [usuario])
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' })
        }
        const hash = bcrypt.hashSync(nuevaContrasena, 10)
        const sqlActualizar = 'UPDATE usuarios SET contrasena = $1 WHERE usuario = $2'
        await pool.query(sqlActualizar, [hash, usuario])
        res.json({ mensaje: 'Contraseña actualizada correctamente' })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error al actualizar' })
    }
})

module.exports = router