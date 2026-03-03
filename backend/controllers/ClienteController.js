const Cliente = require('../models/Cliente')

class ClienteController {
    async getAll(req, res) {
        try {
            const clientes = await Cliente.getAll()
            
            res.json({
                success: true,
                data: clientes,
                total: clientes.length
            })
        } catch (error) {
            console.error('Error en getAll:', error)
            res.status(500).json({
                success: false,
                message: 'Error al obtener clientes',
                error: error.message
            })
        }
    }

    async getActivos(req, res) {
        try {
            const clientes = await Cliente.getActivos()
            
            res.json({
                success: true,
                data: clientes,
                total: clientes.length
            })
        } catch (error) {
            console.error('Error en getActivos:', error)
            res.status(500).json({
                success: false,
                message: 'Error al obtener clientes activos',
                error: error.message
            })
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params
            const cliente = await Cliente.getById(id)
            
            if (!cliente) {
                return res.status(404).json({
                    success: false,
                    message: 'Cliente no encontrado'
                })
            }
            
            res.json({
                success: true,
                data: cliente
            })
        } catch (error) {
            console.error('Error en getById:', error)
            res.status(500).json({
                success: false,
                message: 'Error al obtener cliente',
                error: error.message
            })
        }
    }

    async create(req, res) {
    try {
        const data = req.body
        
        // Validar campos requeridos
        if (!data.nombre || !data.telefono || !data.ciudad) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos requeridos: nombre, telefono, ciudad'
            })
        }

        // Si no se especifica tipo_cliente, por defecto es 'persona'
        if (!data.tipo_cliente) {
            data.tipo_cliente = 'persona'
        }

        // Si no se especifica activo, por defecto es 1
        if (data.activo === undefined) {
            data.activo = 1
        }
        
        // Limpiar campos que puedan no existir en la BD
        const datosLimpios = {
            tipo_cliente: data.tipo_cliente,
            nombre: data.nombre,
            telefono: data.telefono,
            ciudad: data.ciudad,
            activo: data.activo
        }
        
        // Agregar campos opcionales solo si existen en la BD
        if (data.apellido !== undefined) datosLimpios.apellido = data.apellido
        if (data.nit !== undefined) datosLimpios.nit = data.nit
        if (data.email !== undefined) datosLimpios.email = data.email
        if (data.celular !== undefined) datosLimpios.celular = data.celular
        if (data.direccion !== undefined) datosLimpios.direccion = data.direccion
        if (data.observaciones !== undefined) datosLimpios.observaciones = data.observaciones
        
        console.log('Datos a insertar:', datosLimpios)
        
        const nuevoCliente = await Cliente.create(datosLimpios)
        
        res.status(201).json({
            success: true,
            message: 'Cliente creado exitosamente',
            data: nuevoCliente
        })
    } catch (error) {
        console.error('Error en create:', error)
        console.error('SQL Error:', error.sql)
        res.status(500).json({
            success: false,
            message: 'Error al crear cliente: ' + error.message,
            error: error.message,
            sqlError: error.sql
        })
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params
            const data = req.body
            
            // Verificar que el cliente existe
            const clienteExistente = await Cliente.getById(id)
            if (!clienteExistente) {
                return res.status(404).json({
                    success: false,
                    message: 'Cliente no encontrado'
                })
            }
            
            const clienteActualizado = await Cliente.update(id, data)
            
            res.json({
                success: true,
                message: 'Cliente actualizado exitosamente',
                data: clienteActualizado
            })
        } catch (error) {
            console.error('Error en update:', error)
            res.status(500).json({
                success: false,
                message: 'Error al actualizar cliente',
                error: error.message
            })
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params
            
            // Verificar que el cliente existe
            const clienteExistente = await Cliente.getById(id)
            if (!clienteExistente) {
                return res.status(404).json({
                    success: false,
                    message: 'Cliente no encontrado'
                })
            }
            
            await Cliente.delete(id)
            
            res.json({
                success: true,
                message: 'Cliente eliminado exitosamente'
            })
        } catch (error) {
            console.error('Error en delete:', error)
            res.status(500).json({
                success: false,
                message: 'Error al eliminar cliente',
                error: error.message
            })
        }
    }

    async search(req, res) {
        try {
            const { q } = req.query
            
            if (!q) {
                return res.status(400).json({
                    success: false,
                    message: 'Parámetro de búsqueda requerido'
                })
            }
            
            const clientes = await Cliente.search(q)
            
            res.json({
                success: true,
                data: clientes,
                total: clientes.length
            })
        } catch (error) {
            console.error('Error en search:', error)
            res.status(500).json({
                success: false,
                message: 'Error al buscar clientes',
                error: error.message
            })
        }
    }
}

module.exports = new ClienteController()