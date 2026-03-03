/**
 * Modelo Egreso - POO
 * Sistema TECNOFRIO
 */

const Model = require('./Model');

class Egreso extends Model {
    constructor() {
        super('egresos');
    }

    /**
     * Obtener egresos con información completa
     */
    async getAllComplete(options = {}) {
        try {
            let sql = `
                SELECT 
                    e.*,
                    t.nombre as tipo_egreso_nombre,
                    t.categoria as tipo_egreso_categoria,
                    t.color as tipo_egreso_color
                FROM ${this.tableName} e
                INNER JOIN tipos_egreso t ON e.tipo_egreso_id = t.id
            `;

            const params = [];

            // Filtros
            if (options.fechaInicio && options.fechaFin) {
                sql += ` WHERE e.fecha BETWEEN ? AND ?`;
                params.push(options.fechaInicio, options.fechaFin);
            }

            sql += ` ORDER BY e.fecha DESC`;

            if (options.limit) {
                sql += ` LIMIT ?`;
                params.push(parseInt(options.limit));
            }

            return await this.query(sql, params);
        } catch (error) {
            throw new Error(`Error al obtener egresos completos: ${error.message}`);
        }
    }

    /**
     * Obtener egresos por rango de fechas
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
            throw new Error(`Error al obtener egresos por fechas: ${error.message}`);
        }
    }

    /**
     * Obtener resumen de egresos por mes
     */
    async getResumenMensual(año = null, mes = null) {
        try {
            let sql = `SELECT * FROM resumen_egresos_mensual`;
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
            throw new Error(`Error al obtener resumen mensual de egresos: ${error.message}`);
        }
    }

    /**
     * Obtener egresos por categoría
     */
    async getByCategoria(categoria) {
        try {
            const sql = `
                SELECT 
                    e.*,
                    t.nombre as tipo_egreso_nombre
                FROM ${this.tableName} e
                INNER JOIN tipos_egreso t ON e.tipo_egreso_id = t.id
                WHERE t.categoria = ?
                ORDER BY e.fecha DESC
            `;
            return await this.query(sql, [categoria]);
        } catch (error) {
            throw new Error(`Error al obtener egresos por categoría: ${error.message}`);
        }
    }

    /**
     * Obtener total de egresos por periodo
     */
    async getTotalPorPeriodo(fechaInicio, fechaFin) {
        try {
            const sql = `
                SELECT 
                    COUNT(*) as total_gastos,
                    SUM(total_pagado) as total_gastado
                FROM ${this.tableName}
                WHERE fecha BETWEEN ? AND ?
            `;
            const results = await this.query(sql, [fechaInicio, fechaFin]);
            return results[0];
        } catch (error) {
            throw new Error(`Error al obtener total de egresos: ${error.message}`);
        }
    }

    /**
     * Obtener egresos por tipo
     */
    async getByTipo(tipoEgresoId) {
        try {
            return await this.getAll({
                where: { tipo_egreso_id: tipoEgresoId },
                orderBy: 'fecha DESC'
            });
        } catch (error) {
            throw new Error(`Error al obtener egresos por tipo: ${error.message}`);
        }
    }

    /**
     * Obtener egresos de hoy
     */
    async getToday() {
        try {
            const sql = `
                SELECT 
                    e.*,
                    t.nombre as tipo_egreso_nombre,
                    t.color as tipo_egreso_color
                FROM ${this.tableName} e
                INNER JOIN tipos_egreso t ON e.tipo_egreso_id = t.id
                WHERE DATE(e.fecha) = CURDATE()
                ORDER BY e.created_at DESC
            `;
            return await this.query(sql);
        } catch (error) {
            throw new Error(`Error al obtener egresos de hoy: ${error.message}`);
        }
    }
}

module.exports = new Egreso();