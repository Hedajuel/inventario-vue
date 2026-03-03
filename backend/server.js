/**
 * Servidor Principal
 * Sistema TECNOFRIO - Gestión de Inventario y Servicios
 * 
 * @author Tu Nombre
 * @version 1.0.0
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/database');

// Importar rutas
const tipoTrabajoRoutes = require('./routes/tipoTrabajo.routes');
const tipoEgresoRoutes = require('./routes/tipoEgreso.routes')
const servicioRoutes = require('./routes/servicio.routes');
const clienteRoutes = require('./routes/cliente.routes');
const ingresoRoutes = require('./routes/ingreso.routes');
const egresoRoutes = require('./routes/egreso.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// =====================================================
// MIDDLEWARES
// =====================================================

// CORS - Permitir peticiones desde el frontend
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

// Parser de JSON
app.use(express.json());

// Parser de URL encoded
app.use(express.urlencoded({ extended: true }));

// Middleware para logging de peticiones
app.use((req, res, next) => {
    const fecha = new Date().toISOString();
    console.log(`[${fecha}] ${req.method} ${req.path}`);
    next();
});

// =====================================================
// RUTAS
// =====================================================

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API TECNOFRIO - Sistema de Inventario',
        version: process.env.APP_VERSION || '1.0.0',
        endpoints: {
            dashboard: '/api/dashboard',
            tipos_trabajo: '/api/tipos-trabajo',
            servicios: '/api/servicios',
            clientes: '/api/clientes',
            ingresos: '/api/ingresos',
            egresos: '/api/egresos'
        },
        documentacion: '/api/docs'
    });
});

// Ruta de salud (health check)
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: 'connected'
    });
});

// Montar rutas de la API
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/tipos-trabajo', tipoTrabajoRoutes);
app.use('/api/tipos-egreso', tipoEgresoRoutes)
app.use('/api/servicios', servicioRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/ingresos', ingresoRoutes);
app.use('/api/egresos', egresoRoutes);

// Ruta de documentación simple
app.get('/api/docs', (req, res) => {
    res.json({
        success: true,
        message: 'Documentación de la API TECNOFRIO',
        version: '1.0.0',
        endpoints: [
            {
                grupo: 'Dashboard',
                ruta: '/api/dashboard/estadisticas',
                metodo: 'GET',
                descripcion: 'Obtener estadísticas generales del sistema'
            },
            {
                grupo: 'Dashboard',
                ruta: '/api/dashboard/estado-financiero',
                metodo: 'GET',
                descripcion: 'Obtener estado financiero mensual'
            },
            {
                grupo: 'Dashboard',
                ruta: '/api/dashboard/grafica-mensual',
                metodo: 'GET',
                descripcion: 'Obtener datos para gráfica de ingresos vs egresos'
            },
            {
                grupo: 'Tipos de Trabajo',
                ruta: '/api/tipos-trabajo',
                metodo: 'GET',
                descripcion: 'Obtener todos los tipos de trabajo'
            },
            {
                grupo: 'Tipos de Trabajo',
                ruta: '/api/tipos-trabajo/:id',
                metodo: 'GET',
                descripcion: 'Obtener un tipo de trabajo por ID'
            },
            {
                grupo: 'Tipos de Trabajo',
                ruta: '/api/tipos-trabajo',
                metodo: 'POST',
                descripcion: 'Crear un nuevo tipo de trabajo'
            },
            {
                grupo: 'Servicios',
                ruta: '/api/servicios',
                metodo: 'GET',
                descripcion: 'Obtener todos los servicios'
            },
            {
                grupo: 'Servicios',
                ruta: '/api/servicios/tipo/:tipoTrabajoId',
                metodo: 'GET',
                descripcion: 'Obtener servicios por tipo de trabajo'
            },
            {
                grupo: 'Servicios',
                ruta: '/api/servicios/search?q=termino',
                metodo: 'GET',
                descripcion: 'Buscar servicios'
            },
            {
                grupo: 'Clientes',
                ruta: '/api/clientes',
                metodo: 'GET',
                descripcion: 'Obtener todos los clientes'
            },
            {
                grupo: 'Clientes',
                ruta: '/api/clientes/search?q=termino',
                metodo: 'GET',
                descripcion: 'Buscar clientes'
            },
            {
                grupo: 'Clientes',
                ruta: '/api/clientes/:id/historial',
                metodo: 'GET',
                descripcion: 'Obtener cliente con historial de servicios'
            },
            {
                grupo: 'Ingresos',
                ruta: '/api/ingresos',
                metodo: 'GET',
                descripcion: 'Obtener todos los ingresos'
            },
            {
                grupo: 'Ingresos',
                ruta: '/api/ingresos/today',
                metodo: 'GET',
                descripcion: 'Obtener ingresos del día'
            },
            {
                grupo: 'Ingresos',
                ruta: '/api/ingresos/pendientes',
                metodo: 'GET',
                descripcion: 'Obtener ingresos pendientes de pago'
            },
            {
                grupo: 'Ingresos',
                ruta: '/api/ingresos',
                metodo: 'POST',
                descripcion: 'Registrar un nuevo ingreso'
            },
            {
                grupo: 'Egresos',
                ruta: '/api/egresos',
                metodo: 'GET',
                descripcion: 'Obtener todos los egresos'
            },
            {
                grupo: 'Egresos',
                ruta: '/api/egresos/today',
                metodo: 'GET',
                descripcion: 'Obtener egresos del día'
            },
            {
                grupo: 'Egresos',
                ruta: '/api/egresos',
                metodo: 'POST',
                descripcion: 'Registrar un nuevo egreso'
            }
        ]
    });
});

// =====================================================
// MANEJO DE ERRORES
// =====================================================

// Ruta no encontrada (404)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada',
        path: req.path,
        sugerencia: 'Verifica la URL o consulta /api/docs para ver las rutas disponibles'
    });
});

// Manejador de errores global
app.use((error, req, res, next) => {
    console.error('Error:', error);
    
    res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Error interno del servidor',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
});

// =====================================================
// INICIAR SERVIDOR
// =====================================================

const startServer = async () => {
    try {
        // Conectar a la base de datos
        await db.connect();
        
        // Iniciar servidor
        app.listen(PORT, () => {
            console.log('\n' + '='.repeat(60));
            console.log('SERVIDOR TECNOFRIO INICIADO');
            console.log('='.repeat(60));
            console.log(`URL: http://localhost:${PORT}`);
            console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
            console.log(`Base de datos: ${process.env.DB_NAME}`);
            console.log(`Documentación: http://localhost:${PORT}/api/docs`);
            console.log('='.repeat(60) + '\n');
            console.log('Servidor listo para recibir peticiones\n');
        });
    } catch (error) {
        console.error(' Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

// Manejo de señales de terminación
process.on('SIGTERM', async () => {
    console.log('\n Señal SIGTERM recibida. Cerrando servidor...');
    await db.close();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('\n\n Señal SIGINT recibida. Cerrando servidor...');
    await db.close();
    process.exit(0);
});

// Iniciar el servidor
startServer();

module.exports = app;