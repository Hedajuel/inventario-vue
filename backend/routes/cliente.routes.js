const express = require('express')
const router = express.Router()
const ClienteController = require('../controllers/ClienteController')

// Rutas específicas ANTES de las rutas con parámetros
router.get('/activos', ClienteController.getActivos)
router.get('/search', ClienteController.search)

// Rutas CRUD estándar
router.get('/', ClienteController.getAll)
router.get('/:id', ClienteController.getById)
router.post('/', ClienteController.create)
router.put('/:id', ClienteController.update)
router.delete('/:id', ClienteController.delete)

module.exports = router