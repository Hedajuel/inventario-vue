const Model = require('./Model')

class TipoEgreso extends Model {
    constructor() {
        super('tipos_egreso')
    }

    async getActivos() {
        const query = `SELECT * FROM ${this.tableName} WHERE activo = 1 ORDER BY nombre`
        const [rows] = await this.query(query)
        return rows
    }
}

module.exports = new TipoEgreso()