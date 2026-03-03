/**
 * Controller Egreso
 * Sistema TECNOFRIO
 */

const Egreso = require('../models/Egreso');

class EgresoController {
    /**
     * Obtener todos los egresos con información completa
     */
    async getAll(req, res) {
    try {
        const { fechaInicio, fechaFin, limit } = req.query
        
        let query = `
            SELECT e.*, te.nombre as tipo_egreso_nombre, te.color as tipo_egreso_color
            FROM egresos e
            LEFT JOIN tipos_egreso te ON e.tipo_egreso_id = te.id
            WHERE 1=1
        `
        
        const params = []
        
        if (fechaInicio && fechaFin) {
            query += ` AND e.fecha BETWEEN ? AND ?`
            params.push(fechaInicio, fechaFin)
        }
        
        query += ` ORDER BY e.fecha DESC`
        
        if (limit) {
            query += ` LIMIT ?`
            params.push(parseInt(limit))
        }
        
        const egresos = await Egreso.query(query, params)
        
        res.json({
            success: true,
            data: egresos,
            total: egresos.length
        })
    } catch (error) {
        console.error('Error en getAll:', error)
        res.status(500).json({
            success: false,
            message: 'Error al obtener egresos',
            error: error.message
        })
    }
    }

    /**
     * Obtener un egreso por ID
     */
    async getById(req, res) {
        try {
            const { id } = req.params;
            const egreso = await Egreso.getById(id);
            
            if (!egreso) {
                return res.status(404).json({
                    success: false,
                    message: 'Egreso no encontrado'
                });
            }

            res.json({
                success: true,
                data: egreso
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener egreso',
                error: error.message
            });
        }
    }

    /**
     * Crear un nuevo egreso
     */
    async create(req, res) {
        try {
            const { 
                fecha,
                tipo_egreso_id,
                descripcion,
                precio_unitario,
                cantidad,
                nro_factura,
                proveedor,
                metodo_pago,
                observaciones
            } = req.body;

            // Validaciones
            if (!fecha || !tipo_egreso_id || !descripcion || !precio_unitario) {
                return res.status(400).json({
                    success: false,
                    message: 'Faltan campos requeridos: fecha, tipo_egreso_id, descripcion, precio_unitario'
                });
            }

            // Calcular total pagado
            const precioNum = parseFloat(precio_unitario);
            const cantidadNum = parseInt(cantidad || 1);
            const total_pagado = precioNum * cantidadNum;

            const nuevoEgreso = await Egreso.create({
                fecha,
                tipo_egreso_id,
                descripcion,
                precio_unitario: precioNum,
                cantidad: cantidadNum,
                total_pagado,
                nro_factura,
                proveedor,
                metodo_pago: metodo_pago || 'efectivo',
                observaciones
            });

            res.status(201).json({
                success: true,
                message: 'Egreso registrado exitosamente',
                data: nuevoEgreso
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al crear egreso',
                error: error.message
            });
        }
    }

    /**
     * Actualizar un egreso
     */
    async update(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const existe = await Egreso.getById(id);
            if (!existe) {
                return res.status(404).json({
                    success: false,
                    message: 'Egreso no encontrado'
                });
            }

            // Recalcular total si se actualizan precio o cantidad
            if (updateData.precio_unitario || updateData.cantidad) {
                const precio = parseFloat(updateData.precio_unitario || existe.precio_unitario);
                const cant = parseInt(updateData.cantidad || existe.cantidad);
                updateData.total_pagado = precio * cant;
            }

            const actualizado = await Egreso.update(id, updateData);

            res.json({
                success: true,
                message: 'Egreso actualizado exitosamente',
                data: actualizado
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al actualizar egreso',
                error: error.message
            });
        }
    }

    /**
     * Eliminar un egreso
     */
    async delete(req, res) {
        try {
            const { id } = req.params;

            const existe = await Egreso.getById(id);
            if (!existe) {
                return res.status(404).json({
                    success: false,
                    message: 'Egreso no encontrado'
                });
            }

            await Egreso.delete(id);

            res.json({
                success: true,
                message: 'Egreso eliminado exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al eliminar egreso',
                error: error.message
            });
        }
    }

    /**
     * Obtener resumen de egresos por mes
     */
    async getResumenMensual(req, res) {
        try {
            const { año, mes } = req.query;
            const resumen = await Egreso.getResumenMensual(año, mes);
            
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
     * Obtener egresos por categoría
     */
    async getByCategoria(req, res) {
        try {
            const { categoria } = req.params;
            const egresos = await Egreso.getByCategoria(categoria);
            
            res.json({
                success: true,
                data: egresos
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener egresos por categoría',
                error: error.message
            });
        }
    }

    /**
     * Obtener total de egresos por periodo
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

            const total = await Egreso.getTotalPorPeriodo(fechaInicio, fechaFin);
            
            res.json({
                success: true,
                data: total
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener total de egresos',
                error: error.message
            });
        }
    }

    /**
     * Obtener egresos de hoy
     */
    async getToday(req, res) {
        try {
            const egresos = await Egreso.getToday();
            
            res.json({
                success: true,
                data: egresos,
                total: egresos.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener egresos de hoy',
                error: error.message
            });
        }
    }
}

module.exports = new EgresoController();