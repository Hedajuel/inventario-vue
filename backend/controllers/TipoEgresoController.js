/**
 * Controller TipoEgreso
 * Sistema TECNOFRIO
 */

const TipoEgreso = require('../models/TipoEgreso')

class TipoEgresoController {
    async getAll(req, res) {
        try {
            const tipos = await TipoEgreso.getAll()
            
            res.json({
                success: true,
                data: tipos
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener tipos de egreso',
                error: error.message
            })
        }
    }

    async getActivos(req, res) {
        try {
            const tipos = await TipoEgreso.getActivos()
            
            res.json({
                success: true,
                data: tipos
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener tipos de egreso activos',
                error: error.message
            })
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params
            const tipo = await TipoEgreso.getById(id)
            
            if (!tipo) {
                return res.status(404).json({
                    success: false,
                    message: 'Tipo de egreso no encontrado'
                })
            }

            res.json({
                success: true,
                data: tipo
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener tipo de egreso',
                error: error.message
            })
        }
    }

    async create(req, res) {
        try {
            const { nombre, descripcion } = req.body

            if (!nombre) {
                return res.status(400).json({
                    success: false,
                    message: 'El nombre es requerido'
                })
            }

            const nuevoTipo = await TipoEgreso.create({
                nombre,
                descripcion
            })

            res.status(201).json({
                success: true,
                message: 'Tipo de egreso creado exitosamente',
                data: nuevoTipo
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al crear tipo de egreso',
                error: error.message
            })
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params
            const updateData = req.body

            const existe = await TipoEgreso.getById(id)
            if (!existe) {
                return res.status(404).json({
                    success: false,
                    message: 'Tipo de egreso no encontrado'
                })
            }

            const actualizado = await TipoEgreso.update(id, updateData)

            res.json({
                success: true,
                message: 'Tipo de egreso actualizado exitosamente',
                data: actualizado
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al actualizar tipo de egreso',
                error: error.message
            })
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params

            const existe = await TipoEgreso.getById(id)
            if (!existe) {
                return res.status(404).json({
                    success: false,
                    message: 'Tipo de egreso no encontrado'
                })
            }

            await TipoEgreso.delete(id)

            res.json({
                success: true,
                message: 'Tipo de egreso eliminado exitosamente'
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al eliminar tipo de egreso',
                error: error.message
            })
        }
    }
}

module.exports = new TipoEgresoController()