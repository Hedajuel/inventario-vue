/**
 * Controller TipoTrabajo
 * Sistema TECNOFRIO
 */

const TipoTrabajo = require('../models/TipoTrabajo');

class TipoTrabajoController {
    /**
     * Obtener todos los tipos de trabajo
     */
    async getAll(req, res) {
        try {
            const tipos = await TipoTrabajo.getAll();
            res.json({
                success: true,
                data: tipos
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener tipos de trabajo',
                error: error.message
            });
        }
    }

    /**
     * Obtener tipos de trabajo activos
     */
    async getActivos(req, res) {
        try {
            const tipos = await TipoTrabajo.getActivos()
            
            res.json({
                success: true,
                data: tipos
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener tipos de trabajo activos',
                error: error.message
            })
        }
    }

    /**
     * Obtener un tipo de trabajo por ID
     */
    async getById(req, res) {
        try {
            const { id } = req.params;
            const tipo = await TipoTrabajo.getById(id);
            
            if (!tipo) {
                return res.status(404).json({
                    success: false,
                    message: 'Tipo de trabajo no encontrado'
                });
            }

            res.json({
                success: true,
                data: tipo
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener tipo de trabajo',
                error: error.message
            });
        }
    }

    /**
     * Crear un nuevo tipo de trabajo
     */
    async create(req, res) {
        try {
            const { nombre, descripcion, color, icono } = req.body;

            // Validaciones
            if (!nombre) {
                return res.status(400).json({
                    success: false,
                    message: 'El nombre es requerido'
                });
            }

            // Verificar si ya existe
            const existe = await TipoTrabajo.findByNombre(nombre);
            if (existe) {
                return res.status(400).json({
                    success: false,
                    message: 'Ya existe un tipo de trabajo con ese nombre'
                });
            }

            const nuevoTipo = await TipoTrabajo.create({
                nombre,
                descripcion,
                color: color || 'blue',
                icono: icono || 'wrench'
            });

            res.status(201).json({
                success: true,
                message: 'Tipo de trabajo creado exitosamente',
                data: nuevoTipo
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al crear tipo de trabajo',
                error: error.message
            });
        }
    }

    /**
     * Actualizar un tipo de trabajo
     */
    async update(req, res) {
        try {
            const { id } = req.params;
            const { nombre, descripcion, color, icono, activo } = req.body;

            // Verificar si existe
            const existe = await TipoTrabajo.getById(id);
            if (!existe) {
                return res.status(404).json({
                    success: false,
                    message: 'Tipo de trabajo no encontrado'
                });
            }

            const actualizado = await TipoTrabajo.update(id, {
                nombre,
                descripcion,
                color,
                icono,
                activo
            });

            res.json({
                success: true,
                message: 'Tipo de trabajo actualizado exitosamente',
                data: actualizado
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al actualizar tipo de trabajo',
                error: error.message
            });
        }
    }

    /**
     * Eliminar un tipo de trabajo
     */
    async delete(req, res) {
        try {
            const { id } = req.params;

            // Verificar si existe
            const existe = await TipoTrabajo.getById(id);
            if (!existe) {
                return res.status(404).json({
                    success: false,
                    message: 'Tipo de trabajo no encontrado'
                });
            }

            await TipoTrabajo.delete(id);

            res.json({
                success: true,
                message: 'Tipo de trabajo eliminado exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al eliminar tipo de trabajo',
                error: error.message
            });
        }
    }

    /**
     * Obtener tipos con cantidad de servicios
     */
    async getWithServiceCount(req, res) {
        try {
            const tipos = await TipoTrabajo.getWithServiceCount();
            res.json({
                success: true,
                data: tipos
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener tipos con servicios',
                error: error.message
            });
        }
    }
}

module.exports = new TipoTrabajoController();