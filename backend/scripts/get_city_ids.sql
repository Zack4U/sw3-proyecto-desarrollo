-- Script para obtener IDs de ciudades
-- Ejecutar este SQL para obtener los cityId

-- Obtener ID de Medellín
SELECT cityId, name, departmentId FROM "City" WHERE name = 'Medellín';

-- Obtener ID de Bogotá
SELECT cityId, name, departmentId FROM "City" WHERE name = 'Bogotá';

-- Obtener ID de Cali
SELECT cityId, name, departmentId FROM "City" WHERE name = 'Cali';

-- Obtener ID de Barranquilla
SELECT cityId, name, departmentId FROM "City" WHERE name = 'Barranquilla';

-- Ver todas las ciudades con sus departamentos
SELECT c.cityId, c.name as ciudad, d.name as departamento 
FROM "City" c 
JOIN "Department" d ON c.departmentId = d.departmentId
ORDER BY d.name, c.name;
