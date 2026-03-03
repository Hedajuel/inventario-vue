/**
 * Controller Ingreso
 * Sistema TECNOFRIO
 */

const Ingreso = require('../models/Ingreso');

class IngresoController {
    /**
     * Obtener todos los ingresos con información completa
     */
    async getAll(req, res) {
        try {
            const { fechaInicio, fechaFin, limit } = req.query;
            
            const options = {};
            if (fechaInicio && fechaFin) {
                options.fechaInicio = fechaInicio;
                options.fechaFin = fechaFin;
            }
            if (limit) {
                options.limit = limit;
            }

            const ingresos = await Ingreso.getAllComplete(options);
            
            res.json({
                success: true,
                data: ingresos,
                total: ingresos.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener ingresos',
                error: error.message
            });
        }
    }

    /**
     * Obtener un ingreso por ID
     */
    async getById(req, res) {
        try {
            const { id } = req.params;
            const ingreso = await Ingreso.getById(id);
            
            if (!ingreso) {
                return res.status(404).json({
                    success: false,
                    message: 'Ingreso no encontrado'
                });
            }

            res.json({
                success: true,
                data: ingreso
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener ingreso',
                error: error.message
            });
        }
    }

    /**
     * Crear un nuevo ingreso
     */
    async create(req, res) {
        try {
            const { 
                fecha,
                cliente_id,
                tipo_trabajo_id,
                servicio_id,
                descripcion_trabajo,
                venta_servicio,
                facturado,
                estado_pago,
                tipo_pago,
                observaciones,
                realizado_por
            } = req.body;

            // Validaciones
            if (!fecha || !tipo_trabajo_id || !descripcion_trabajo || !venta_servicio) {
                return res.status(400).json({
                    success: false,
                    message: 'Faltan campos requeridos: fecha, tipo_trabajo_id, descripcion_trabajo, venta_servicio'
                });
            }

            // Calcular saldo pendiente
            const ventaNum = parseFloat(venta_servicio);
            const facturadoNum = parseFloat(facturado || venta_servicio);
            const saldo_pendiente = facturadoNum - ventaNum;

            const nuevoIngreso = await Ingreso.create({
                fecha,
                cliente_id: cliente_id || null,
                tipo_trabajo_id,
                servicio_id: servicio_id || null,
                descripcion_trabajo,
                venta_servicio: ventaNum,
                facturado: facturadoNum,
                saldo_pendiente,
                estado_pago: estado_pago || 'pagado',
                tipo_pago: tipo_pago || 'efectivo',
                observaciones,
                realizado_por: realizado_por || 'Técnico'
            });

            res.status(201).json({
                success: true,
                message: 'Ingreso registrado exitosamente',
                data: nuevoIngreso
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al crear ingreso',
                error: error.message
            });
        }
    }

    /**
     * Actualizar un ingreso
     */
    async update(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const existe = await Ingreso.getById(id);
            if (!existe) {
                return res.status(404).json({
                    success: false,
                    message: 'Ingreso no encontrado'
                });
            }

            // Recalcular saldo si se actualizan los montos
            if (updateData.venta_servicio || updateData.facturado) {
                const venta = parseFloat(updateData.venta_servicio || existe.venta_servicio);
                const fact = parseFloat(updateData.facturado || existe.facturado);
                updateData.saldo_pendiente = fact - venta;
            }

            const actualizado = await Ingreso.update(id, updateData);

            res.json({
                success: true,
                message: 'Ingreso actualizado exitosamente',
                data: actualizado
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al actualizar ingreso',
                error: error.message
            });
        }
    }

    /**
     * Eliminar un ingreso
     */
    async delete(req, res) {
        try {
            const { id } = req.params;

            const existe = await Ingreso.getById(id);
            if (!existe) {
                return res.status(404).json({
                    success: false,
                    message: 'Ingreso no encontrado'
                });
            }

            await Ingreso.delete(id);

            res.json({
                success: true,
                message: 'Ingreso eliminado exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al eliminar ingreso',
                error: error.message
            });
        }
    }

    /**
     * Obtener resumen de ingresos por mes
     */
    async getResumenMensual(req, res) {
        try {
            const { año, mes } = req.query;
            const resumen = await Ingreso.getResumenMensual(año, mes);
            
            res.json({
                success: true,
                data: resumen
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener resumen mensual',
                error: error.message
            });
        }
    }

    /**
     * Obtener ingresos pendientes de pago
     */
    async getPendientes(req, res) {
        try {
            const pendientes = await Ingreso.getPendientes();
            
            res.json({
                success: true,
                data: pendientes,
                total: pendientes.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener ingresos pendientes',
                error: error.message
            });
        }
    }

    /**
     * Obtener total de ingresos por periodo
     */
    async getTotalPorPeriodo(req, res) {
        try {
            const { fechaInicio, fechaFin } = req.query;

            if (!fechaInicio || !fechaFin) {
                return res.status(400).json({
                    success: false,
                    message: 'Debe proporcionar fechaInicio y fechaFin'
                });
            }

            const total = await Ingreso.getTotalPorPeriodo(fechaInicio, fechaFin);
            
            res.json({
                success: true,
                data: total
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener total de ingresos',
                error: error.message
            });
        }
    }

    /**
     * Obtener ingresos de hoy
     */
    async getToday(req, res) {
        try {
            const ingresos = await Ingreso.getToday();
            
            res.json({
                success: true,
                data: ingresos,
                total: ingresos.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener ingresos de hoy',
                error: error.message
            });
        }
    }
}

module.exports = new IngresoController();