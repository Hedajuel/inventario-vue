/**
 * Modelo Cliente - POO
 * Sistema TECNOFRIO
 */

const Model = require('./Model');

class Cliente extends Model {
    constructor() {
        super('clientes');
    }

    /**
     * Obtener clientes activos
     */
    async getActivos() {
        const query = `SELECT * FROM ${this.tableName} WHERE activo = 1 ORDER BY nombre`
        return await this.query(query)
    }

    /**
     * Buscar cliente por nombre (búsqueda parcial)
     */
    async search(termino) {
        try {
            const sql = `
                SELECT * FROM ${this.tableName}
                WHERE (nombre LIKE ? OR telefono LIKE ? OR email LIKE ?)
                AND activo = TRUE
                ORDER BY nombre ASC
            `;
            const searchTerm = `%${termino}%`;
            return await this.query(sql, [searchTerm, searchTerm, searchTerm]);
        } catch (error) {
            throw new Error(`Error al buscar clientes: ${error.message}`);
        }
    }

    /**
     * Buscar cliente por teléfono
     */
    async findByTelefono(telefono) {
        try {
            const sql = `SELECT * FROM ${this.tableName} WHERE telefono = ? OR celular = ?`;
            const results = await this.query(sql, [telefono, telefono]);
            return results.length > 0 ? results[0] : null;
        } catch (error) {
            throw new Error(`Error al buscar cliente por teléfono: ${error.message}`);
        }
    }

    /**
     * Obtener clientes con historial de servicios
     */
    async getWithHistorial(clienteId) {
        try {
            const sql = `
                SELECT 
                    c.*,
                    COUNT(i.id) as total_servicios,
                    SUM(i.venta_servicio) as total_gastado,
                    MAX(i.fecha) as ultima_visita
                FROM ${this.tableName} c
                LEFT JOIN ingresos i ON c.id = i.cliente_id
                WHERE c.id = ?
                GROUP BY c.id
            `;
            const results = await this.query(sql, [clienteId]);
            return results.length > 0 ? results[0] : null;
        } catch (error) {
            throw new Error(`Error al obtener cliente con historial: ${error.message}`);
        }
    }

    /**
     * Obtener mejores clientes (por cantidad de servicios)
     */
    async getMejoresClientes(limit = 10) {
        try {
            const sql = `
                SELECT 
                    c.*,
                    COUNT(i.id) as total_servicios,
                    SUM(i.venta_servicio) as total_gastado
                FROM ${this.tableName} c
                INNER JOIN ingresos i ON c.id = i.cliente_id
                WHERE c.activo = TRUE
                GROUP BY c.id
                ORDER BY total_servicios DESC, total_gastado DESC
                LIMIT ?
            `;
            return await this.query(sql, [limit]);
        } catch (error) {
            throw new Error(`Error al obtener mejores clientes: ${error.message}`);
        }
    }
}

module.exports = new Cliente();