/**
 * Routes Dashboard
 * Sistema TECNOFRIO
 */

const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/DashboardController');

// Rutas para dashboard
router.get('/estadisticas', DashboardController.getEstadisticas.bind(DashboardController));
router.get('/estado-financiero', DashboardController.getEstadoFinanciero.bind(DashboardController));
router.get('/grafica-mensual', DashboardController.getGraficaMensual.bind(DashboardController));
router.get('/servicios-populares', DashboardController.getServiciosMasSolicitados.bind(DashboardController));
router.get('/distribucion-tipos', DashboardController.getDistribucionTipoTrabajo.bind(DashboardController));
router.get('/egresos-categoria', DashboardController.getResumenEgresosPorCategoria.bind(DashboardController));
router.get('/actividades-recientes', DashboardController.getUltimasActividades.bind(DashboardController));

module.exports = router;