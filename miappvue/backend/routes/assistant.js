const express = require('express')
const router = express.Router()

const generateAssistantReply = (message) => {
    const text = message.toLowerCase()

    if (text.includes('hola') || text.includes('buenas')) {
        return '¡Hola! Soy el asistente Pronto. Pregúntame por rutas, paradas, buses, reportes o tu perfil.'
    }

    if (text.includes('mapa') || text.includes('ubicación') || text.includes('ubicacion')) {
        return 'Para ver la ubicación de los buses en tiempo real, ve a la sección Mapa. Ahí aparecen todos los buses en línea.'
    }

    if (text.includes('ruta') || text.includes('rutas')) {
        return 'Puedes revisar y administrar rutas en la sección Administrar rutas. Si necesitas una ruta específica, dime el número o destino.'
    }

    if (text.includes('parada') || text.includes('paradas')) {
        return 'Las paradas están disponibles en el mapa y las rutas. Busca la parada que necesites o pregunta por el nombre de la parada.'
    }

    if (text.includes('reporte') || text.includes('reportes')) {
        return 'En la sección Reportes puedes enviar observaciones y revisar el estado de los reportes existentes.'
    }

    if (text.includes('perfil') || text.includes('usuario') || text.includes('sesión') || text.includes('sesion')) {
        return 'Para ver o editar tu perfil, abre la sección Perfil. Si no estás en sesión, primero inicia sesión.'
    }

    if (text.includes('ayuda') || text.includes('soporte') || text.includes('cómo usar') || text.includes('como usar')) {
        return 'Te puedo ayudar con las secciones Mapa, Administrar rutas, Reportes y Perfil. Pregunta lo que necesites.'
    }

    if (text.includes('gracias') || text.includes('muchas gracias')) {
        return '¡Con gusto! Si tienes otra pregunta, aquí estoy para ayudarte.'
    }

    return 'Estoy aquí para ayudarte con rutas, paradas, buses, reportes y tu perfil. Por favor, escribe tu pregunta con más detalle.'
}

router.post('/', (req, res) => {
    const { message } = req.body
    if (!message || !message.toString().trim()) {
        return res.status(400).json({ error: 'El mensaje es obligatorio' })
    }

    const reply = generateAssistantReply(message.toString())
    res.json({ reply })
})

module.exports = router
