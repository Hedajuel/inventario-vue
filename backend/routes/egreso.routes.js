/**
 * Routes Egreso
 * Sistema TECNOFRIO
 */

const express = require('express');
const router = express.Router();
const EgresoController = require('../controllers/EgresoController');

// Rutas para egresos
router.get('/', EgresoController.getAll.bind(EgresoController));
router.get('/today', EgresoController.getToday.bind(EgresoController));
router.get('/resumen-mensual', EgresoController.getResumenMensual.bind(EgresoController));
router.get('/total-periodo', EgresoController.getTotalPorPeriodo.bind(EgresoController));
router.get('/categoria/:categoria', EgresoController.getByCategoria.bind(EgresoController));
router.get('/:id', EgresoController.getById.bind(EgresoController));
router.post('/', EgresoController.create.bind(EgresoController));
router.put('/:id', EgresoController.update.bind(EgresoController));
router.delete('/:id', EgresoController.delete.bind(EgresoController));

module.exports = router;