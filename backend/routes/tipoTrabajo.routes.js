/**
 * Routes TipoTrabajo
 * Sistema TECNOFRIO
 */

const express = require('express');
const router = express.Router();
const TipoTrabajoController = require('../controllers/TipoTrabajoController');

// Rutas para tipos de trabajo
router.get('/', TipoTrabajoController.getAll.bind(TipoTrabajoController));
router.get('/activos', TipoTrabajoController.getActivos);
router.get('/con-servicios', TipoTrabajoController.getWithServiceCount.bind(TipoTrabajoController));
router.get('/:id', TipoTrabajoController.getById.bind(TipoTrabajoController));
router.post('/', TipoTrabajoController.create.bind(TipoTrabajoController));
router.put('/:id', TipoTrabajoController.update.bind(TipoTrabajoController));
router.delete('/:id', TipoTrabajoController.delete.bind(TipoTrabajoController));

module.exports = router;