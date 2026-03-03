/**
 * Modelo TipoTrabajo - POO
 * Sistema TECNOFRIO
 */

const Model = require('./Model');

class TipoTrabajo extends Model {
    constructor() {
        super('tipos_trabajo');
    }

    /**
     * Obtener tipos de trabajo activos
     */
    async getActivos() {
        const query = `SELECT * FROM ${this.tableName} WHERE activo = 1 ORDER BY nombre`
        return await this.query(query)
    }

    /**
     * Buscar tipo de trabajo por nombre
     */
    async findByNombre(nombre) {
        try {
            const query = `SELECT * FROM ${this.tableName} WHERE nombre LIKE ? AND activo = 1`
            const result = await this.query(query, [`%${nombre}%`])
            return result[0]
        }
        catch (error) {
            throw new Error(`Error al buscar tipo de trabajo: ${error.message}`);
        }
    }

    /**
     * Obtener tipos de trabajo con cantidad de servicios
     */
    async getWithServiceCount() {
        try {
            const sql = `
                SELECT 
                    t.*,
                    COUNT(s.id) as total_servicios
                FROM ${this.tableName} t
                LEFT JOIN servicios s ON t.id = s.tipo_trabajo_id
                WHERE t.activo = TRUE
                GROUP BY t.id
                ORDER BY t.nombre ASC
            `;
            return await this.query(sql);
        } catch (error) {
            throw new Error(`Error al obtener tipos con servicios: ${error.message}`);
        }
    }
}

module.exports = new TipoTrabajo();