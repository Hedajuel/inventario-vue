/**
 * Clase Base Model - POO
 * Sistema TECNOFRIO
 * 
 * Esta clase base proporciona métodos CRUD genéricos
 * que heredarán todos los modelos específicos
 */

const db = require('../config/database');

class Model {
    constructor(tableName) {
        this.tableName = tableName;
        this.db = db;
    }

    /**
     * Obtener todos los registros
     * @param {Object} options - Opciones de consulta (limit, offset, orderBy)
     * @returns {Promise<Array>}
     */
    async getAll(options = {}) {
        try {
            let sql = `SELECT * FROM ${this.tableName}`;
            const params = [];

            // Agregar WHERE si existe condición
            if (options.where) {
                const conditions = Object.keys(options.where)
                    .map(key => `${key} = ?`)
                    .join(' AND ');
                sql += ` WHERE ${conditions}`;
                params.push(...Object.values(options.where));
            }

            // Agregar ORDER BY
            if (options.orderBy) {
                sql += ` ORDER BY ${options.orderBy}`;
            } else {
                sql += ` ORDER BY id DESC`;
            }

            // Agregar LIMIT y OFFSET
            if (options.limit) {
                sql += ` LIMIT ?`;
                params.push(parseInt(options.limit));
            }

            if (options.offset) {
                sql += ` OFFSET ?`;
                params.push(parseInt(options.offset));
            }

            return await this.db.query(sql, params);
        } catch (error) {
            throw new Error(`Error al obtener registros de ${this.tableName}: ${error.message}`);
        }
    }

    /**
     * Obtener un registro por ID
     * @param {number} id
     * @returns {Promise<Object|null>}
     */
    async getById(id) {
        try {
            const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
            const results = await this.db.query(sql, [id]);
            return results.length > 0 ? results[0] : null;
        } catch (error) {
            throw new Error(`Error al obtener registro de ${this.tableName}: ${error.message}`);
        }
    }

    /**
     * Crear un nuevo registro
     * @param {Object} data - Datos del registro
     * @returns {Promise<Object>} - Registro creado con su ID
     */
    async create(data) {
        try {
            // Filtrar campos undefined o null
            const cleanData = Object.fromEntries(
                Object.entries(data).filter(([_, v]) => v !== undefined && v !== null)
            );

            const fields = Object.keys(cleanData);
            const values = Object.values(cleanData);
            const placeholders = fields.map(() => '?').join(', ');

            const sql = `INSERT INTO ${this.tableName} (${fields.join(', ')}) VALUES (${placeholders})`;
            const result = await this.db.query(sql, values);

            // Retornar el registro creado
            return await this.getById(result.insertId);
        } catch (error) {
            throw new Error(`Error al crear registro en ${this.tableName}: ${error.message}`);
        }
    }

    /**
     * Actualizar un registro
     * @param {number} id - ID del registro
     * @param {Object} data - Datos a actualizar
     * @returns {Promise<Object|null>}
     */
    async update(id, data) {
        try {
            // Filtrar campos undefined o null
            const cleanData = Object.fromEntries(
                Object.entries(data).filter(([_, v]) => v !== undefined && v !== null)
            );

            const fields = Object.keys(cleanData);
            const values = Object.values(cleanData);

            if (fields.length === 0) {
                throw new Error('No hay datos para actualizar');
            }

            const setClause = fields.map(field => `${field} = ?`).join(', ');
            const sql = `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`;

            await this.db.query(sql, [...values, id]);

            // Retornar el registro actualizado
            return await this.getById(id);
        } catch (error) {
            throw new Error(`Error al actualizar registro en ${this.tableName}: ${error.message}`);
        }
    }

    /**
     * Eliminar un registro (soft delete si existe campo 'activo')
     * @param {number} id
     * @returns {Promise<boolean>}
     */
    async delete(id) {
        try {
            // Verificar si la tabla tiene campo 'activo' para soft delete
            const checkSql = `SHOW COLUMNS FROM ${this.tableName} LIKE 'activo'`;
            const hasActiveField = await this.db.query(checkSql);

            if (hasActiveField.length > 0) {
                // Soft delete
                const sql = `UPDATE ${this.tableName} SET activo = FALSE WHERE id = ?`;
                await this.db.query(sql, [id]);
            } else {
                // Hard delete
                const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
                await this.db.query(sql, [id]);
            }

            return true;
        } catch (error) {
            throw new Error(`Error al eliminar registro de ${this.tableName}: ${error.message}`);
        }
    }

    /**
     * Contar registros
     * @param {Object} where - Condiciones
     * @returns {Promise<number>}
     */
    async count(where = {}) {
        try {
            let sql = `SELECT COUNT(*) as total FROM ${this.tableName}`;
            const params = [];

            if (Object.keys(where).length > 0) {
                const conditions = Object.keys(where)
                    .map(key => `${key} = ?`)
                    .join(' AND ');
                sql += ` WHERE ${conditions}`;
                params.push(...Object.values(where));
            }

            const result = await this.db.query(sql, params);
            return result[0].total;
        } catch (error) {
            throw new Error(`Error al contar registros de ${this.tableName}: ${error.message}`);
        }
    }

    /**
     * Ejecutar query personalizado
     * @param {string} sql
     * @param {Array} params
     * @returns {Promise<Array>}
     */
    async query(sql, params = []) {
        try {
            return await this.db.query(sql, params);
        } catch (error) {
            throw new Error(`Error en query personalizado: ${error.message}`);
        }
    }
}

module.exports = Model;