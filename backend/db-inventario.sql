-- =====================================================
-- SISTEMA DE GESTIÓN TECNOFRIO
-- Base de Datos para Control de Servicios e Inventario
-- =====================================================

-- Eliminar base de datos si existe
DROP DATABASE IF EXISTS inventario_vue;

-- Crear la base de datos
CREATE DATABASE inventario_vue CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE inventario_vue;

-- =====================================================
-- TABLA: tipos_trabajo
-- =====================================================
CREATE TABLE tipos_trabajo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    color VARCHAR(20) DEFAULT 'blue',
    icono VARCHAR(50) DEFAULT 'wrench',
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLA: servicios
-- =====================================================
CREATE TABLE servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_trabajo_id INT NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precio_base DECIMAL(10, 2) DEFAULT 0.00,
    duracion_estimada INT DEFAULT 60, -- en minutos
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (tipo_trabajo_id) REFERENCES tipos_trabajo(id) ON DELETE RESTRICT,
    INDEX idx_tipo_trabajo (tipo_trabajo_id),
    INDEX idx_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLA: clientes
-- =====================================================
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    tipo_cliente ENUM('persona', 'empresa') DEFAULT 'persona',
    nit VARCHAR(20),
    telefono VARCHAR(20),
    celular VARCHAR(20),
    email VARCHAR(100),
    direccion TEXT,
    ciudad VARCHAR(100) DEFAULT 'La Paz',
    observaciones TEXT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_nombre (nombre),
    INDEX idx_telefono (telefono)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLA: ingresos (Servicios realizados)
-- =====================================================
CREATE TABLE ingresos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    cliente_id INT,
    tipo_trabajo_id INT NOT NULL,
    servicio_id INT,
    descripcion_trabajo TEXT NOT NULL,
    venta_servicio DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    facturado DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    saldo_pendiente DECIMAL(10, 2) DEFAULT 0.00,
    estado_pago ENUM('pagado', 'pendiente', 'parcial') DEFAULT 'pagado',
    tipo_pago ENUM('efectivo', 'transferencia', 'qr', 'credito') DEFAULT 'efectivo',
    observaciones TEXT,
    realizado_por VARCHAR(100) DEFAULT 'Técnico',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL,
    FOREIGN KEY (tipo_trabajo_id) REFERENCES tipos_trabajo(id) ON DELETE RESTRICT,
    FOREIGN KEY (servicio_id) REFERENCES servicios(id) ON DELETE SET NULL,
    INDEX idx_fecha (fecha),
    INDEX idx_estado_pago (estado_pago)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLA: tipos_egreso
-- =====================================================
CREATE TABLE tipos_egreso (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    categoria ENUM('operativo', 'administrativo', 'personal', 'otros') DEFAULT 'operativo',
    descripcion TEXT,
    color VARCHAR(20) DEFAULT 'red',
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLA: egresos (Gastos)
-- =====================================================
CREATE TABLE egresos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    tipo_egreso_id INT NOT NULL,
    descripcion VARCHAR(200) NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    cantidad INT DEFAULT 1,
    total_pagado DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    nro_factura VARCHAR(50),
    proveedor VARCHAR(150),
    metodo_pago ENUM('efectivo', 'transferencia', 'qr', 'cheque') DEFAULT 'efectivo',
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (tipo_egreso_id) REFERENCES tipos_egreso(id) ON DELETE RESTRICT,
    INDEX idx_fecha (fecha),
    INDEX idx_tipo (tipo_egreso_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLA: inventario_materiales (Para control de stock)
-- =====================================================
CREATE TABLE inventario_materiales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    categoria ENUM('repuesto', 'herramienta', 'consumible', 'equipo') DEFAULT 'repuesto',
    unidad_medida VARCHAR(20) DEFAULT 'unidad',
    stock_actual INT DEFAULT 0,
    stock_minimo INT DEFAULT 5,
    precio_compra DECIMAL(10, 2) DEFAULT 0.00,
    precio_venta DECIMAL(10, 2) DEFAULT 0.00,
    ubicacion VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_codigo (codigo),
    INDEX idx_categoria (categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- INSERTAR DATOS REALES DE TECNOFRIO
-- =====================================================

-- Tipos de Trabajo
INSERT INTO tipos_trabajo (nombre, descripcion, color, icono) VALUES
('Mantenimiento', 'Servicios de mantenimiento preventivo y correctivo', 'blue', 'tools'),
('Instalación', 'Instalación de equipos y sistemas', 'green', 'hammer'),
('Reparación', 'Reparación de equipos y sistemas', 'orange', 'wrench');

-- Servicios
INSERT INTO servicios (tipo_trabajo_id, nombre, precio_base) VALUES
-- Mantenimiento
(1, 'Cargado de gas', 200.00),
(1, 'Cargado de gas heladera', 250.00),
(1, 'Cargado de gas frezzer', 350.00),
(1, 'Mantenimiento de aire acondicionado', 400.00),
(1, 'Mantenimiento exhibidoras frigorificas', 350.00),
(1, 'Mantenimiento a lavarropas', 200.00),
(1, 'Camiones frigorificos - Mantenimiento electrico', 2000.00),
-- Instalación
(2, 'Instalación de lavarropa', 150.00),
(2, 'Armado de camara de frio', 3500.00),
(2, 'Armado de maquinaria de carniceria', 1100.00),
-- Reparación
(3, 'Cambio de cañerias frizzers', 800.00),
(3, 'Cambio de cañerias heladeras', 1000.00),
(3, 'Cambio de aceites de maquinaria', 200.00),
(3, 'Cambio de rodamientos', 350.00),
(3, 'Cambio de pieza', 450.00);

-- Clientes (datos de ejemplo, puedes agregar los reales después)
INSERT INTO clientes (nombre, tipo_cliente, telefono, direccion, ciudad) VALUES
('Juan Pérez', 'persona', '70123456', 'Av. Buenos Aires #123', 'La Paz'),
('Mercado Central', 'empresa', '2234567', 'Zona Central', 'La Paz'),
('Restaurante El Buen Sabor', 'empresa', '70234567', 'Av. Arce #456', 'La Paz'),
('María González', 'persona', '70345678', 'Calle Comercio #789', 'La Paz'),
('Supermercado Los Andes', 'empresa', '2345678', 'Av. 6 de Agosto', 'La Paz');

-- Ingresos (Datos reales de tu Excel)
INSERT INTO ingresos (fecha, tipo_trabajo_id, servicio_id, descripcion_trabajo, venta_servicio, facturado, saldo_pendiente, estado_pago) VALUES
('2025-06-29', 2, 12, 'Cambio de cañerias heladeras', 1000.00, 1125.00, 0.00, 'pagado'),
('2025-06-29', 3, 14, 'Cambio de rodamientos', 350.00, 393.75, 0.00, 'pagado'),
('2025-04-25', 2, 8, 'Instalación de lavarropa', 150.00, 168.75, 0.00, 'pagado'),
('2025-04-23', 2, 9, 'Armado de camara de frio', 3500.00, 3937.50, 0.00, 'pagado'),
('2025-04-12', 1, 3, 'Cargado de gas frezzer', 350.00, 393.75, 0.00, 'pagado'),
('2025-04-10', 2, 8, 'Instalación de lavarropa', 150.00, 168.75, 0.00, 'pagado'),
('2025-04-09', 3, 13, 'Cambio de aceites de maquinaria', 200.00, 225.00, 0.00, 'pagado'),
('2025-04-04', 2, 8, 'Instalación de lavarropa', 150.00, 168.75, 0.00, 'pagado'),
('2025-04-04', 1, 7, 'Camiones frigorificos - Mantenimiento electrico', 2000.00, 2250.00, 0.00, 'pagado'),
('2025-04-01', 2, 7, 'Camiones frigorificos - Mantenimiento electrico', 3500.00, 3937.50, 0.00, 'pagado'),
('2025-03-21', 3, 15, 'Cambio de pieza', 450.00, 506.25, 0.00, 'pagado'),
('2025-03-18', 1, 1, 'Cargado de gas', 450.00, 506.25, 0.00, 'pagado'),
('2025-03-18', 1, 1, 'Cargado de gas', 200.00, 225.00, 0.00, 'pagado'),
('2025-03-14', 2, 8, 'Instalación de lavarropa', 150.00, 168.75, 0.00, 'pagado'),
('2025-03-14', 3, 4, 'Mantenimiento de aire acondicionado', 730.00, 821.25, 0.00, 'pagado'),
('2025-03-05', 2, 10, 'Armado de maquinaria de carniceria', 1100.00, 1237.50, 0.00, 'pagado'),
('2025-02-18', 1, 1, 'Cargado de gas', 200.00, 225.00, 0.00, 'pagado'),
('2025-02-15', 1, 1, 'Cargado de gas', 200.00, 225.00, 0.00, 'pagado'),
('2025-02-12', 1, 1, 'Cargado de gas', 150.00, 168.75, 0.00, 'pagado'),
('2025-02-04', 2, 9, 'Armado de camara de frio', 3500.00, 3937.50, 0.00, 'pagado');

-- Tipos de Egreso
INSERT INTO tipos_egreso (nombre, categoria, color) VALUES
('Sueldos', 'personal', 'purple'),
('Servicios básicos - Luz', 'administrativo', 'yellow'),
('Servicios básicos - Agua', 'administrativo', 'blue'),
('Gasolina', 'operativo', 'orange'),
('Compra de repuestos', 'operativo', 'green'),
('Compra de herramientas', 'operativo', 'gray'),
('Otros gastos', 'otros', 'red');

-- Egresos (Datos reales de tu Excel)
INSERT INTO egresos (fecha, tipo_egreso_id, descripcion, precio_unitario, cantidad, total_pagado) VALUES
('2025-04-25', 1, 'Sueldos mensuales', 1500.00, 2, 3000.00),
('2025-04-12', 2, 'Servicio básico luz', 210.85, 1, 210.85),
('2025-04-12', 3, 'Servicio básico agua', 48.50, 1, 48.50),
('2025-03-25', 1, 'Sueldos mensuales', 1500.00, 2, 3000.00),
('2025-03-12', 2, 'Servicio básico luz', 150.00, 1, 150.00),
('2025-03-12', 3, 'Servicio básico agua', 45.10, 1, 45.10),
('2025-02-25', 1, 'Sueldos mensuales', 1500.00, 2, 3000.00),
('2025-02-12', 2, 'Servicio básico luz', 112.00, 1, 112.00),
('2025-02-12', 3, 'Servicio básico agua', 58.10, 1, 58.10),
('2025-01-25', 1, 'Sueldos mensuales', 1500.00, 2, 3000.00),
('2025-01-24', 4, 'Compra de Gasolina', 110.00, 1, 110.00),
('2025-01-20', 5, 'Compra de tuercas', 10.00, 5, 50.00),
('2025-01-14', 4, 'Gasolina', 150.00, 1, 150.00),
('2025-01-12', 2, 'Servicio básico luz', 48.50, 1, 48.50),
('2025-01-12', 3, 'Servicio básico agua', 45.78, 1, 45.78);

-- Inventario de materiales (ejemplos básicos)
INSERT INTO inventario_materiales (codigo, nombre, categoria, stock_actual, stock_minimo, precio_compra, precio_venta) VALUES
('GAS-R22', 'Gas Refrigerante R22', 'consumible', 10, 3, 150.00, 250.00),
('GAS-R134', 'Gas Refrigerante R134a', 'consumible', 8, 3, 180.00, 300.00),
('ACE-POE', 'Aceite POE para compresores', 'consumible', 5, 2, 80.00, 150.00),
('COMP-1HP', 'Compresor 1 HP', 'repuesto', 2, 1, 800.00, 1200.00),
('TERM-DIG', 'Termómetro Digital', 'herramienta', 3, 1, 50.00, 100.00),
('SOLD-EL', 'Soldadora Eléctrica', 'equipo', 1, 1, 1500.00, 0.00);

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista: Resumen de ingresos por mes
CREATE VIEW resumen_ingresos_mensual AS
SELECT 
    YEAR(fecha) AS año,
    MONTH(fecha) AS mes,
    DATE_FORMAT(fecha, '%Y-%m') AS periodo,
    COUNT(*) AS total_servicios,
    SUM(venta_servicio) AS total_ventas,
    SUM(facturado) AS total_facturado,
    SUM(saldo_pendiente) AS total_pendiente,
    AVG(venta_servicio) AS promedio_venta
FROM ingresos
GROUP BY año, mes, periodo
ORDER BY año DESC, mes DESC;

-- Vista: Resumen de egresos por mes
CREATE VIEW resumen_egresos_mensual AS
SELECT 
    YEAR(fecha) AS año,
    MONTH(fecha) AS mes,
    DATE_FORMAT(fecha, '%Y-%m') AS periodo,
    COUNT(*) AS total_gastos,
    SUM(total_pagado) AS total_gastado
FROM egresos
GROUP BY año, mes, periodo
ORDER BY año DESC, mes DESC;

-- Vista: Estado financiero mensual
CREATE VIEW estado_financiero_mensual AS
SELECT 
    COALESCE(i.periodo, e.periodo) AS periodo,
    COALESCE(i.total_facturado, 0) AS ingresos,
    COALESCE(e.total_gastado, 0) AS egresos,
    (COALESCE(i.total_facturado, 0) - COALESCE(e.total_gastado, 0)) AS utilidad
FROM 
    resumen_ingresos_mensual i
LEFT JOIN 
    resumen_egresos_mensual e ON i.periodo = e.periodo
UNION
SELECT 
    COALESCE(i.periodo, e.periodo) AS periodo,
    COALESCE(i.total_facturado, 0) AS ingresos,
    COALESCE(e.total_gastado, 0) AS egresos,
    (COALESCE(i.total_facturado, 0) - COALESCE(e.total_gastado, 0)) AS utilidad
FROM 
    resumen_ingresos_mensual i
RIGHT JOIN 
    resumen_egresos_mensual e ON i.periodo = e.periodo
ORDER BY periodo DESC;

-- Vista: Servicios más solicitados
CREATE VIEW servicios_mas_solicitados AS
SELECT 
    s.nombre AS servicio,
    t.nombre AS tipo_trabajo,
    COUNT(i.id) AS veces_realizado,
    SUM(i.venta_servicio) AS ingresos_totales,
    AVG(i.venta_servicio) AS precio_promedio
FROM ingresos i
LEFT JOIN servicios s ON i.servicio_id = s.id
LEFT JOIN tipos_trabajo t ON i.tipo_trabajo_id = t.id
GROUP BY s.nombre, t.nombre
ORDER BY veces_realizado DESC;

-- Vista: Stock de materiales bajo mínimo
CREATE VIEW stock_bajo_minimo AS
SELECT 
    codigo,
    nombre,
    categoria,
    stock_actual,
    stock_minimo,
    (stock_minimo - stock_actual) AS faltante
FROM inventario_materiales
WHERE stock_actual <= stock_minimo AND activo = TRUE
ORDER BY faltante DESC;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger: Calcular saldo pendiente automáticamente
DELIMITER $$

CREATE TRIGGER calcular_saldo_ingreso
BEFORE INSERT ON ingresos
FOR EACH ROW
BEGIN
    SET NEW.saldo_pendiente = NEW.facturado - NEW.venta_servicio;
    
    IF NEW.saldo_pendiente <= 0 THEN
        SET NEW.estado_pago = 'pagado';
    ELSEIF NEW.saldo_pendiente >= NEW.facturado THEN
        SET NEW.estado_pago = 'pendiente';
    ELSE
        SET NEW.estado_pago = 'parcial';
    END IF;
END$$

-- Trigger: Calcular total pagado en egresos
CREATE TRIGGER calcular_total_egreso
BEFORE INSERT ON egresos
FOR EACH ROW
BEGIN
    SET NEW.total_pagado = NEW.precio_unitario * NEW.cantidad;
END$$

DELIMITER ;

-- =====================================================
-- CONSULTAS DE VERIFICACIÓN
-- =====================================================

-- Ver tipos de trabajo
SELECT * FROM tipos_trabajo;

-- Ver todos los servicios con su tipo
SELECT 
    s.id,
    s.nombre AS servicio,
    t.nombre AS tipo_trabajo,
    s.precio_base
FROM servicios s
INNER JOIN tipos_trabajo t ON s.tipo_trabajo_id = t.id
ORDER BY t.nombre, s.nombre;

-- Ver resumen financiero
SELECT * FROM estado_financiero_mensual;

-- Ver servicios más solicitados
SELECT * FROM servicios_mas_solicitados;

-- Ver stock bajo mínimo
SELECT * FROM stock_bajo_minimo;

-- =====================================================
-- ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices compuestos para consultas comunes
CREATE INDEX idx_ingresos_fecha_estado ON ingresos(fecha, estado_pago);
CREATE INDEX idx_egresos_fecha_tipo ON egresos(fecha, tipo_egreso_id);

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================

SELECT 'Base de datos TECNOFRIO creada exitosamente!' AS mensaje;