const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/auth')
const busesRoutes = require('./routes/buses')
const rutasRoutes = require('./routes/rutas')
const paradasRoutes = require('./routes/paradas')
const reportesRoutes = require('./routes/reportes')

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.json({ mensaje: 'Backend Pronto funcionando' })
})

app.use('/auth', authRoutes)
app.use('/buses', busesRoutes)
app.use('/rutas', rutasRoutes)
app.use('/paradas', paradasRoutes)
app.use('/reportes', reportesRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});