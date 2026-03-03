/**
 * Modelo Ingreso - POO
 * Sistema TECNOFRIO
 */

const Model = require('./Model');

class Ingreso extends Model {
    constructor() {
        super('ingresos');
    }

    /**
     * Obtener ingresos con información completa
     */
    async getAllComplete(options = {}) {
        try {
            let sql = `
                SELECT 
                    i.*,
                    t.nombre as tipo_trabajo_nombre,
                    t.color as tipo_trabajo_color,
                    s.nombre as servicio_nombre,
                    c.nombre as cliente_nombre,
                    c.telefono as cliente_telefono
                FROM ${this.tableName} i
                INNER JOIN tipos_trabajo t ON i.tipo_trabajo_id = t.id
                LEFT JOIN servicios s ON i.servicio_id = s.id
                LEFT JOIN clientes c ON i.cliente_id = c.id
            `;

            const params = [];

            // Filtros
            if (options.fechaInicio && options.fechaFin) {
                sql += ` WHERE i.fecha BETWEEN ? AND ?`;
                params.push(options.fechaInicio, options.fechaFin);
            }

            sql += ` ORDER BY i.fecha DESC`;

            if (options.limit) {
                sql += ` LIMIT ?`;
                params.push(parseInt(options.limit));
            }

            return await this.query(sql, params);
        } catch (error) {
            throw new Error(`Error al obtener ingresos completos: ${error.message}`);
        }
    }

    /**
     * Obtener ingresos por rango de fechas
     */
    async getByFechas(fechaInicio, fechaFin) {
        try {
            const sql = `
                SELECT * FROM ${this.tableName}
                WHERE fecha BETWEEN ? AND ?
                ORDER BY fecha DESC
            `;
            return await this.query(sql, [fechaInicio, fechaFin]);
        } catch (error) {
            throw new Error(`Error al obtener ingresos por fechas: ${error.message}`);
        }
    }

    /**
     * Obtener resumen de ingresos por mes
     */
    async getResumenMensual(año = null, mes = null) {
        try {
            let sql = `SELECT * FROM resumen_ingresos_mensual`;
            const params = [];

            if (año && mes) {
                sql += ` WHERE año = ? AND mes = ?`;
                params.push(año, mes);
            } else if (año) {
                sql += ` WHERE año = ?`;
                params.push(año);
            }

            return await this.query(sql, params);
        } catch (error) {
            throw new Error(`Error al obtener resumen mensual: ${error.message}`);
        }
    }

    /**
     * Obtener ingresos pendientes de pago
     */
    async getPendientes() {
        try {
            const sql = `
                SELECT 
                    i.*,
                    c.nombre as cliente_nombre,
                    c.telefono as cliente_telefono
                FROM ${this.tableName} i
                LEFT JOIN clientes c ON i.cliente_id = c.id
                WHERE i.estado_pago IN ('pendiente', 'parcial')
                ORDER BY i.fecha DESC
            `;
            return await this.query(sql);
        } catch (error) {
            throw new Error(`Error al obtener ingresos pendientes: ${error.message}`);
        }
    }

    /**
     * Obtener total de ingresos por periodo
     */
    async getTotalPorPeriodo(fechaInicio, fechaFin) {
        try {
            const sql = `
                SELECT 
                    COUNT(*) as total_servicios,
                    SUM(venta_servicio) as total_ventas,
                    SUM(facturado) as total_facturado,
                    SUM(saldo_pendiente) as total_pendiente
                FROM ${this.tableName}
                WHERE fecha BETWEEN ? AND ?
            `;
            const results = await this.query(sql, [fechaInicio, fechaFin]);
            return results[0];
        } catch (error) {
            throw new Error(`Error al obtener total por periodo: ${error.message}`);
        }
    }

    /**
     * Obtener ingresos de hoy
     */
    async getToday() {
        try {
            const sql = `
                SELECT 
                    i.*,
                    t.nombre as tipo_trabajo_nombre,
                    s.nombre as servicio_nombre,
                    c.nombre as cliente_nombre
                FROM ${this.tableName} i
                INNER JOIN tipos_trabajo t ON i.tipo_trabajo_id = t.id
                LEFT JOIN servicios s ON i.servicio_id = s.id
                LEFT JOIN clientes c ON i.cliente_id = c.id
                WHERE DATE(i.fecha) = CURDATE()
                ORDER BY i.created_at DESC
            `;
            return await this.query(sql);
        } catch (error) {
            throw new Error(`Error al obtener ingresos de hoy: ${error.message}`);
        }
    }
}

module.exports = new Ingreso();