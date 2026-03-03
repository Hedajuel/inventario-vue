/**
 * Modelo Servicio - POO
 * Sistema TECNOFRIO
 */

const Model = require('./Model');

class Servicio extends Model {
    constructor() {
        super('servicios');
    }

    /**
     * Obtener servicios activos con información del tipo de trabajo
     */
    async getAllWithTipoTrabajo() {
        try {
            const sql = `
                SELECT 
                    s.*,
                    t.nombre as tipo_trabajo_nombre,
                    t.color as tipo_trabajo_color
                FROM ${this.tableName} s
                INNER JOIN tipos_trabajo t ON s.tipo_trabajo_id = t.id
                WHERE s.activo = TRUE
                ORDER BY t.nombre, s.nombre
            `;
            return await this.query(sql);
        } catch (error) {
            throw new Error(`Error al obtener servicios: ${error.message}`);
        }
    }

    /**
     * Obtener servicios por tipo de trabajo
     */
    async getByTipoTrabajo(tipoTrabajoId) {
        try {
            return await this.getAll({
                where: { 
                    tipo_trabajo_id: tipoTrabajoId,
                    activo: true 
                },
                orderBy: 'nombre ASC'
            });
        } catch (error) {
            throw new Error(`Error al obtener servicios por tipo: ${error.message}`);
        }
    }

    /**
     * Buscar servicios por nombre (búsqueda parcial)
     */
    async search(termino) {
        try {
            const sql = `
                SELECT 
                    s.*,
                    t.nombre as tipo_trabajo_nombre
                FROM ${this.tableName} s
                INNER JOIN tipos_trabajo t ON s.tipo_trabajo_id = t.id
                WHERE s.nombre LIKE ? AND s.activo = TRUE
                ORDER BY s.nombre
            `;
            return await this.query(sql, [`%${termino}%`]);
        } catch (error) {
            throw new Error(`Error al buscar servicios: ${error.message}`);
        }
    }

    /**
     * Obtener servicios más solicitados
     */
    async getMasSolicitados(limit = 10) {
        try {
            const sql = `
                SELECT * FROM servicios_mas_solicitados
                LIMIT ?
            `;
            return await this.query(sql, [limit]);
        } catch (error) {
            throw new Error(`Error al obtener servicios más solicitados: ${error.message}`);
        }
    }
}

module.exports = new Servicio();