/**
 * Controller Dashboard
 * Sistema TECNOFRIO
 * Maneja estadísticas y reportes generales
 */

const db = require('../config/database');

class DashboardController {
    /**
     * Obtener estadísticas generales del dashboard
     */
    async getEstadisticas(req, res) {
        try {
            const { fechaInicio, fechaFin } = req.query;
            
            // Si no se proporcionan fechas, usar el mes actual
            const hoy = new Date();
            const inicioMes = fechaInicio || `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-01`;
            const finMes = fechaFin || hoy.toISOString().split('T')[0];

            // Obtener totales de ingresos
            const [totalIngresos] = await db.query(`
                SELECT 
                    COUNT(*) as total_servicios,
                    COALESCE(SUM(venta_servicio), 0) as total_ventas,
                    COALESCE(SUM(facturado), 0) as total_facturado,
                    COALESCE(SUM(saldo_pendiente), 0) as total_pendiente
                FROM ingresos
                WHERE fecha BETWEEN ? AND ?
            `, [inicioMes, finMes]);

            // Obtener totales de egresos
            const [totalEgresos] = await db.query(`
                SELECT 
                    COUNT(*) as total_gastos,
                    COALESCE(SUM(total_pagado), 0) as total_gastado
                FROM egresos
                WHERE fecha BETWEEN ? AND ?
            `, [inicioMes, finMes]);

            // Calcular utilidad
            const utilidad = totalIngresos.total_facturado - totalEgresos.total_gastado;

            // Obtener ingresos de hoy
            const [ingresosHoy] = await db.query(`
                SELECT 
                    COUNT(*) as servicios_hoy,
                    COALESCE(SUM(venta_servicio), 0) as ventas_hoy
                FROM ingresos
                WHERE DATE(fecha) = CURDATE()
            `);

            // Obtener total de clientes activos
            const [totalClientes] = await db.query(`
                SELECT COUNT(*) as total FROM clientes WHERE activo = TRUE
            `);

            // Obtener servicios pendientes de pago
            const [serviciosPendientes] = await db.query(`
                SELECT COUNT(*) as total FROM ingresos 
                WHERE estado_pago IN ('pendiente', 'parcial')
            `);

            res.json({
                success: true,
                data: {
                    periodo: {
                        inicio: inicioMes,
                        fin: finMes
                    },
                    ingresos: {
                        total_servicios: totalIngresos.total_servicios || 0,
                        total_ventas: parseFloat(totalIngresos.total_ventas) || 0,
                        total_facturado: parseFloat(totalIngresos.total_facturado) || 0,
                        total_pendiente: parseFloat(totalIngresos.total_pendiente) || 0
                    },
                    egresos: {
                        total_gastos: totalEgresos.total_gastos || 0,
                        total_gastado: parseFloat(totalEgresos.total_gastado) || 0
                    },
                    utilidad: parseFloat(utilidad) || 0,
                    hoy: {
                        servicios: ingresosHoy.servicios_hoy || 0,
                        ventas: parseFloat(ingresosHoy.ventas_hoy) || 0
                    },
                    clientes_activos: totalClientes.total || 0,
                    servicios_pendientes: serviciosPendientes.total || 0
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener estadísticas',
                error: error.message
            });
        }
    }

    /**
     * Obtener estado financiero mensual
     */
    async getEstadoFinanciero(req, res) {
        try {
            const { año } = req.query;
            
            let sql = `SELECT * FROM estado_financiero_mensual`;
            const params = [];

            if (año) {
                sql += ` WHERE periodo LIKE ?`;
                params.push(`${año}%`);
            }

            sql += ` ORDER BY periodo DESC LIMIT 12`;

            const estado = await db.query(sql, params);

            res.json({
                success: true,
                data: estado
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener estado financiero',
                error: error.message
            });
        }
    }

    /**
     * Obtener gráfica de ingresos vs egresos por mes
     */
    async getGraficaMensual(req, res) {
        try {
            const { año } = req.query;
            const añoActual = año || new Date().getFullYear();

            const datos = await db.query(`
                SELECT 
                    MONTH(fecha) as mes,
                    'ingreso' as tipo,
                    SUM(facturado) as total
                FROM ingresos
                WHERE YEAR(fecha) = ?
                GROUP BY MONTH(fecha)
                
                UNION ALL
                
                SELECT 
                    MONTH(fecha) as mes,
                    'egreso' as tipo,
                    SUM(total_pagado) as total
                FROM egresos
                WHERE YEAR(fecha) = ?
                GROUP BY MONTH(fecha)
                
                ORDER BY mes, tipo
            `, [añoActual, añoActual]);

            // Organizar datos por mes
            const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            const grafica = meses.map((nombre, index) => {
                const mesNum = index + 1;
                const ingreso = datos.find(d => d.mes === mesNum && d.tipo === 'ingreso');
                const egreso = datos.find(d => d.mes === mesNum && d.tipo === 'egreso');
                
                return {
                    mes: nombre,
                    ingresos: ingreso ? parseFloat(ingreso.total) : 0,
                    egresos: egreso ? parseFloat(egreso.total) : 0
                };
            });

            res.json({
                success: true,
                data: grafica
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener gráfica mensual',
                error: error.message
            });
        }
    }

    /**
     * Obtener servicios más solicitados
     */
    async getServiciosMasSolicitados(req, res) {
        try {
            const { limit } = req.query;
            
            const servicios = await db.query(`
                SELECT * FROM servicios_mas_solicitados
                ORDER BY veces_realizado DESC
                LIMIT ?
            `, [parseInt(limit) || 10]);

            res.json({
                success: true,
                data: servicios
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener servicios más solicitados',
                error: error.message
            });
        }
    }

    /**
     * Obtener distribución de ingresos por tipo de trabajo
     */
    async getDistribucionTipoTrabajo(req, res) {
        try {
            const { fechaInicio, fechaFin } = req.query;
            
            const params = [];
            let whereClause = '';
            
            if (fechaInicio && fechaFin) {
                whereClause = 'WHERE i.fecha BETWEEN ? AND ?';
                params.push(fechaInicio, fechaFin);
            }

            const distribucion = await db.query(`
                SELECT 
                    t.nombre,
                    t.color,
                    COUNT(i.id) as cantidad,
                    SUM(i.venta_servicio) as total_ventas
                FROM tipos_trabajo t
                LEFT JOIN ingresos i ON t.id = i.tipo_trabajo_id ${whereClause}
                WHERE t.activo = TRUE
                GROUP BY t.id, t.nombre, t.color
                ORDER BY total_ventas DESC
            `, params);

            res.json({
                success: true,
                data: distribucion
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener distribución por tipo de trabajo',
                error: error.message
            });
        }
    }

    /**
     * Obtener resumen por categoría de egresos
     */
    async getResumenEgresosPorCategoria(req, res) {
        try {
            const { fechaInicio, fechaFin } = req.query;
            
            const params = [];
            let whereClause = '';
            
            if (fechaInicio && fechaFin) {
                whereClause = 'WHERE e.fecha BETWEEN ? AND ?';
                params.push(fechaInicio, fechaFin);
            }

            const resumen = await db.query(`
                SELECT 
                    te.categoria,
                    te.nombre,
                    COUNT(e.id) as cantidad,
                    SUM(e.total_pagado) as total_gastado
                FROM tipos_egreso te
                LEFT JOIN egresos e ON te.id = e.tipo_egreso_id ${whereClause}
                WHERE te.activo = TRUE
                GROUP BY te.categoria, te.nombre
                ORDER BY total_gastado DESC
            `, params);

            res.json({
                success: true,
                data: resumen
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener resumen de egresos',
                error: error.message
            });
        }
    }

    /**
     * Obtener últimas actividades (ingresos y egresos recientes)
     */
    async getUltimasActividades(req, res) {
        try {
            const { limit } = req.query;
            const limitNum = parseInt(limit) || 10;

            const actividades = await db.query(`
                (SELECT 
                    i.id,
                    'ingreso' as tipo,
                    i.fecha,
                    i.descripcion_trabajo as descripcion,
                    i.venta_servicio as monto,
                    t.nombre as categoria,
                    t.color,
                    i.created_at
                FROM ingresos i
                INNER JOIN tipos_trabajo t ON i.tipo_trabajo_id = t.id
                ORDER BY i.created_at DESC
                LIMIT ?)
                
                UNION ALL
                
                (SELECT 
                    e.id,
                    'egreso' as tipo,
                    e.fecha,
                    e.descripcion,
                    e.total_pagado as monto,
                    te.nombre as categoria,
                    te.color,
                    e.created_at
                FROM egresos e
                INNER JOIN tipos_egreso te ON e.tipo_egreso_id = te.id
                ORDER BY e.created_at DESC
                LIMIT ?)
                
                ORDER BY created_at DESC
                LIMIT ?
            `, [limitNum, limitNum, limitNum]);

            res.json({
                success: true,
                data: actividades
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener últimas actividades',
                error: error.message
            });
        }
    }
}

module.exports = new DashboardController();