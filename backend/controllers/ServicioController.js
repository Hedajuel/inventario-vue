/**
 * Controller Servicio
 * Sistema TECNOFRIO
 */

const Servicio = require('../models/Servicio');

class ServicioController {
    /**
     * Obtener todos los servicios
     */
    async getAll(req, res) {
        try {
            const servicios = await Servicio.getAllWithTipoTrabajo();
            res.json({
                success: true,
                data: servicios
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener servicios',
                error: error.message
            });
        }
    }

    /**
     * Obtener un servicio por ID
     */
    async getById(req, res) {
        try {
            const { id } = req.params;
            const servicio = await Servicio.getById(id);
            
            if (!servicio) {
                return res.status(404).json({
                    success: false,
                    message: 'Servicio no encontrado'
                });
            }

            res.json({
                success: true,
                data: servicio
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener servicio',
                error: error.message
            });
        }
    }

    /**
     * Obtener servicios por tipo de trabajo
     */
    async getByTipoTrabajo(req, res) {
        try {
            const { tipoTrabajoId } = req.params;
            const servicios = await Servicio.getByTipoTrabajo(tipoTrabajoId);
            
            res.json({
                success: true,
                data: servicios
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener servicios por tipo',
                error: error.message
            });
        }
    }

    /**
     * Buscar servicios
     */
    async search(req, res) {
        try {
            const { q } = req.query;
            
            if (!q) {
                return res.status(400).json({
                    success: false,
                    message: 'Debe proporcionar un término de búsqueda'
                });
            }

            const servicios = await Servicio.search(q);
            res.json({
                success: true,
                data: servicios
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al buscar servicios',
                error: error.message
            });
        }
    }

    /**
     * Crear un nuevo servicio
     */
    async create(req, res) {
        try {
            const { tipo_trabajo_id, nombre, descripcion, precio_base, duracion_estimada } = req.body;

            // Validaciones
            if (!tipo_trabajo_id || !nombre) {
                return res.status(400).json({
                    success: false,
                    message: 'Tipo de trabajo y nombre son requeridos'
                });
            }

            const nuevoServicio = await Servicio.create({
                tipo_trabajo_id,
                nombre,
                descripcion,
                precio_base: precio_base || 0,
                duracion_estimada: duracion_estimada || 60
            });

            res.status(201).json({
                success: true,
                message: 'Servicio creado exitosamente',
                data: nuevoServicio
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al crear servicio',
                error: error.message
            });
        }
    }

    /**
     * Actualizar un servicio
     */
    async update(req, res) {
        try {
            const { id } = req.params;
            const { tipo_trabajo_id, nombre, descripcion, precio_base, duracion_estimada, activo } = req.body;

            const existe = await Servicio.getById(id);
            if (!existe) {
                return res.status(404).json({
                    success: false,
                    message: 'Servicio no encontrado'
                });
            }

            const actualizado = await Servicio.update(id, {
                tipo_trabajo_id,
                nombre,
                descripcion,
                precio_base,
                duracion_estimada,
                activo
            });

            res.json({
                success: true,
                message: 'Servicio actualizado exitosamente',
                data: actualizado
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al actualizar servicio',
                error: error.message
            });
        }
    }

    /**
     * Eliminar un servicio
     */
    async delete(req, res) {
        try {
            const { id } = req.params;

            const existe = await Servicio.getById(id);
            if (!existe) {
                return res.status(404).json({
                    success: false,
                    message: 'Servicio no encontrado'
                });
            }

            await Servicio.delete(id);

            res.json({
                success: true,
                message: 'Servicio eliminado exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al eliminar servicio',
                error: error.message
            });
        }
    }

    /**
     * Obtener servicios más solicitados
     */
    async getMasSolicitados(req, res) {
        try {
            const { limit } = req.query;
            const servicios = await Servicio.getMasSolicitados(limit || 10);
            
            res.json({
                success: true,
                data: servicios
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener servicios más solicitados',
                error: error.message
            });
        }
    }
}

module.exports = new ServicioController();