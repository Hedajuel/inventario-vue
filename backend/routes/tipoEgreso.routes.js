const express = require('express')
const router = express.Router()
const TipoEgresoController = require('../controllers/TipoEgresoController')

// Rutas de tipos de egreso
router.get('/', TipoEgresoController.getAll)
router.get('/activos', TipoEgresoController.getActivos)
router.get('/:id', TipoEgresoController.getById)
router.post('/', TipoEgresoController.create)
router.put('/:id', TipoEgresoController.update)
router.delete('/:id', TipoEgresoController.delete)

module.exports = router