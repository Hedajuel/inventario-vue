const express = require('express')
const router = express.Router()
const IngresoController = require('../controllers/IngresoController')

// Rutas de ingresos
router.get('/', IngresoController.getAll)
router.get('/today', IngresoController.getToday)
router.get('/pendientes', IngresoController.getPendientes)
router.get('/resumen-mensual', IngresoController.getResumenMensual)
router.get('/total-periodo', IngresoController.getTotalPorPeriodo)
router.get('/:id', IngresoController.getById)
router.post('/', IngresoController.create)
router.put('/:id', IngresoController.update)
router.delete('/:id', IngresoController.delete)

module.exports = router