/**
 * Configuración de Base de Datos - POO
 * Sistema TECNOFRIO
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * Clase Database - Patrón Singleton
 * Gestiona la conexión a la base de datos
 */
class Database {
    constructor() {
        if (Database.instance) {
            return Database.instance;
        }

        this.pool = null;
        Database.instance = this;
    }

    /**
     * Crear pool de conexiones
     */
    async connect() {
        try {
            this.pool = mysql.createPool({
                host: process.env.DB_HOST || 'localhost',
                user: process.env.DB_USER || 'root',
                password: process.env.DB_PASSWORD || '',
                database: process.env.DB_NAME || 'inventario_vue',
                port: process.env.DB_PORT || 3306,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0,
                enableKeepAlive: true,
                keepAliveInitialDelay: 0
            });

            // Verificar conexión
            const connection = await this.pool.getConnection();
            console.log('Conexión exitosa a MySQL');
            console.log(`Base de datos: ${process.env.DB_NAME}`);
            connection.release();

            return this.pool;
        } catch (error) {
            console.error('Error al conectar a MySQL:', error.message);
            throw error;
        }
    }

    /**
     * Obtener pool de conexiones
     */
    getPool() {
        if (!this.pool) {
            throw new Error('La base de datos no está conectada. Llama a connect() primero.');
        }
        return this.pool;
    }

    /**
     * Ejecutar query con manejo de errores
     */
    async query(sql, params = []) {
        try {
            const [rows] = await this.pool.execute(sql, params);
            return rows;
        } catch (error) {
            console.error('Error en query:', error.message);
            throw error;
        }
    }

    /**
     * Cerrar conexión
     */
    async close() {
        if (this.pool) {
            await this.pool.end();
            console.log('Conexión cerrada a la DB');
        }
    }
}

// Exportar instancia única (Singleton)
module.exports = new Database();