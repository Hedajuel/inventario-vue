# TECNOFRIO - Backend API

Sistema de gestión de inventario y servicios para TECNOFRIO.

## Requisitos

- Node.js 18+ 
- MySQL 8.0+
- npm o yarn

## Instalación

1. Instalar dependencias:
```bash npm install
```

2. Configurar variables de entorno:
   - Copiar `.env.example` a `.env`
   - Configurar credenciales de MySQL

3. Crear la base de datos:
```bash mysql -u root -p < db-inventario.sql
```

## Ejecución

### Modo desarrollo (con hot reload):
```bash npm run dev
```

### Modo producción:
```bash npm start
```

El servidor estará disponible en: `http://localhost:3000`

## 📚 Endpoints Principales

### Dashboard
- `GET /api/dashboard/estadisticas` - Estadísticas generales
- `GET /api/dashboard/estado-financiero` - Estado financiero mensual

### Servicios
- `GET /api/servicios` - Listar todos
- `POST /api/servicios` - Crear nuevo
- `PUT /api/servicios/:id` - Actualizar
- `DELETE /api/servicios/:id` - Eliminar

### Ingresos
- `GET /api/ingresos` - Listar todos
- `GET /api/ingresos/today` - Ingresos del día
- `POST /api/ingresos` - Registrar nuevo

### Egresos
- `GET /api/egresos` - Listar todos
- `POST /api/egresos` - Registrar nuevo

Ver documentación completa en: `http://localhost:3000/api/docs`

## Estructura del Proyecto
```
backend/
├── config/          # Configuraciones
├── models/          # Modelos POO
├── controllers/     # Lógica de negocio
├── routes/          # Definición de rutas
├── middlewares/     # Middlewares
├── utils/           # Utilidades
├── .env             # Variables de entorno
├── server.js        # Archivo principal
└── package.json     # Dependencias
```

## 🔐 Variables de Entorno
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=inventario_vue
FRONTEND_URL=http://localhost:5173
```

## 🧪 Pruebas

Para probar la API puedes usar:
- Postman
- Thunder Client (extensión de VS Code)
- Insomnia

## 📝 Licencia

Propietario - TECNOFRIO