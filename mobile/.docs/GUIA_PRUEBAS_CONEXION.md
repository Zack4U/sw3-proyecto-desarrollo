# 🧪 Guía de Pruebas - Conexión Frontend-Backend

## 🚀 Inicio Rápido

### 1. Iniciar el Backend
```bash
cd backend
npm install
npm run start:dev
```

Deberías ver:
```
[Nest] INFO [NestApplication] Nest application successfully started
```

### 2. Iniciar el Frontend
```bash
cd mobile
npm install
npm start
```

Selecciona la opción según tu dispositivo:
- `w` para web
- `a` para Android emulator
- `i` para iOS simulator

---

## ✅ Pruebas de Funcionalidad

### Test 1: Registro de Establecimiento

**Datos de prueba**:
```
Nombre: Restaurante El Buen Sabor
Descripción: Comida casera y deliciosa
Departamento: Seleccionar uno
Ciudad: Seleccionar una
Barrio: Centro
Dirección: Calle 10 #20-30
Ubicación: -12.0464, -77.0428
Tipo: Restaurante
```

**Resultado esperado**: 
- ✅ Mensaje de éxito
- ✅ Redirección automática a Home
- ⚠️ **NOTA**: Solo se guardarán `address`, `type`, `location`, `user_id` en la base de datos

**Verificar en backend**:
```bash
# Deberías ver en la consola del backend:
POST /establishments 201
```

---

### Test 2: Registro de Alimento

**Datos de prueba**:
```
Nombre: Arroz con Pollo
Descripción: Plato preparado del día
Categoría: Comida Preparada
Cantidad: 5
Unidad de medida: Porción
Fecha de vencimiento: 2025-10-25
Estado: Disponible (default)
ID Establecimiento: temp-establishment-id
```

**Resultado esperado**: 
- ✅ Mensaje de éxito
- ✅ Redirección automática a Home
- ✅ **TODOS los campos se guardan correctamente**

**Verificar en backend**:
```bash
POST /foods 201
```

---

### Test 3: Registro de Beneficiario ⚠️

**Datos de prueba**:
```
Nombre: Juan Pérez
Email: juan.perez@email.com
Teléfono: +51987654321
```

**Resultado esperado**: 
- ❌ Error: "No se pudo conectar con el servidor"
- ❌ Endpoint `/users` no existe en backend

**Verificar en backend**:
```bash
POST /users 404 (Not Found)
```

---

## 🔍 Verificación de Datos en Base de Datos

### Usando Prisma Studio (Recomendado)

```bash
cd backend
npx prisma studio
```

Abre: `http://localhost:5555`

**Verificar**:
1. **Tabla Establishment**: Debería tener el registro con `address`, `type`, `location`, `user_id`
2. **Tabla Food**: Debería tener todos los campos del formulario

---

## 🐛 Troubleshooting

### Error: "No se pudo conectar con el servidor"

**Causas posibles**:
1. Backend no está corriendo → Inicia el backend
2. URL incorrecta en `mobile/config/app.config.ts`
3. Firewall bloqueando el puerto 3000

**Solución**:
```bash
# Verificar que el backend esté corriendo
curl http://localhost:3000/establishments

# Si estás en Android emulator
curl http://10.0.2.2:3000/establishments

# Cambiar URL en app.config.ts según corresponda
```

---

### Error: "Datos inválidos"

**Causas posibles**:
1. Campos requeridos vacíos
2. Formato de datos incorrecto

**Solución**:
- Verifica que todos los campos marcados con * estén llenos
- Revisa la consola del backend para ver el error específico

---

### Establecimiento se crea pero faltan datos

**Esto es NORMAL** con la configuración actual del backend.

El `CreateEstablishmentDto` solo acepta:
- `address`
- `type`
- `location`
- `user_id`

Los campos `name`, `description`, `cityId`, `neighborhood` del formulario **NO se guardan** porque el DTO del backend no los acepta.

**Verificar en Prisma Studio**: Verás que solo estos 4 campos tienen valor.

---

## 📊 Checklist de Verificación

Antes de reportar un problema, verifica:

- [ ] El backend está corriendo (puerto 3000)
- [ ] El frontend está corriendo
- [ ] La URL en `app.config.ts` es correcta para tu entorno
- [ ] Puedes hacer `curl http://localhost:3000/establishments` y obtienes respuesta
- [ ] No hay errores en la consola del navegador/emulador
- [ ] La base de datos PostgreSQL está corriendo
- [ ] Has ejecutado `npx prisma migrate dev` en el backend

---

## 🎯 Comandos Útiles

### Backend
```bash
# Ver logs del servidor
cd backend
npm run start:dev

# Ver base de datos
npx prisma studio

# Reset de base de datos (¡CUIDADO!)
npx prisma migrate reset
```

### Frontend
```bash
# Limpiar cache
cd mobile
rm -rf node_modules
npm install
npm start -- --clear

# Ver logs
npm start
```

---

## 📝 Notas Importantes

1. **Establecimientos**: Solo 4 campos se guardan actualmente (limitación del backend)
2. **Alimentos**: Todos los campos se guardan correctamente ✅
3. **Beneficiarios**: Endpoint no existe, necesita implementación en backend ⚠️
4. **IDs temporales**: Se usan `temp-user-id` y `temp-establishment-id` porque no hay autenticación
5. **Validaciones**: El frontend valida antes de enviar, el backend valida al recibir

---

## ✅ Estado Final

| Funcionalidad | Frontend | Backend | Estado |
|---------------|----------|---------|--------|
| Form Establecimientos | ✅ | ⚠️ Limitado | Funcional con limitaciones |
| Form Alimentos | ✅ | ✅ | Totalmente funcional |
| Form Beneficiarios | ✅ | ❌ | No funcional (endpoint faltante) |
| Validaciones | ✅ | ✅ | Funcionando |
| Manejo de errores | ✅ | ✅ | Funcionando |
| Feedback visual | ✅ | N/A | Funcionando |
