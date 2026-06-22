const jwt = require('jsonwebtoken')

const SECRET = 'pronto_santa_marta_2026'

function verificarToken(req, res, next) {
    const authHeader = req.headers['authorization']
    if (!authHeader) {
        return res.status(401).json({ error: 'Acceso denegado. No se proporcionó token.' })
    }
    const token = authHeader.split(' ')[1]
    if (!token) {
        return res.status(401).json({ error: 'Token inválido.' })
    }
    try {
        const datos = jwt.verify(token, SECRET)
        req.usuario = datos.usuario
        next()
    } catch {
        return res.status(403).json({ error: 'Token expirado o inválido.' })
    }
}

module.exports = verificarToken