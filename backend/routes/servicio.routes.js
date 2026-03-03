/**
 * Routes Servicio
 * Sistema TECNOFRIO
 */

const express = require('express');
const router = express.Router();
const ServicioController = require('../controllers/ServicioController');

// Rutas para servicios
router.get('/', ServicioController.getAll.bind(ServicioController));
router.get('/search', ServicioController.search.bind(ServicioController));
router.get('/mas-solicitados', ServicioController.getMasSolicitados.bind(ServicioController));
router.get('/tipo/:tipoTrabajoId', ServicioController.getByTipoTrabajo.bind(ServicioController));
router.get('/:id', ServicioController.getById.bind(ServicioController));
router.post('/', ServicioController.create.bind(ServicioController));
router.put('/:id', ServicioController.update.bind(ServicioController));
router.delete('/:id', ServicioController.delete.bind(ServicioController));

module.exports = router;