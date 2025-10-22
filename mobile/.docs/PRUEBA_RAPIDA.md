# ⚡ Prueba Rápida - 2 Minutos

## 🎯 Objetivo

Verificar que el frontend (mobile) se conecte correctamente con el backend.

---

## 🚀 Pasos Rápidos

### 1️⃣ Terminal 1 - Backend (30 segundos)

```bash
cd backend
npm run start:dev
```

✅ **Espera ver**: `Nest application successfully started`

---

### 2️⃣ Terminal 2 - Frontend (30 segundos)

```bash
cd mobile
npm start
```

Presiona `w` para abrir en navegador web

---

### 3️⃣ Prueba de Alimentos (1 minuto) ✅

1. Click en **"Registrar Alimento"**
2. Llena el formulario:
   - Nombre: `Arroz con Pollo`
   - Descripción: `Comida del día`
   - Categoría: `Comida Preparada`
   - Cantidad: `5`
   - Unidad: `Porción`
   - Fecha vencimiento: `2025-10-25`
3. Click en **"Registrar Alimento"**

**✅ Resultado esperado**:

- Mensaje verde: "¡Alimento registrado exitosamente!"
- Redirección automática a Home

**🔍 Verificar en terminal del backend**:

```
POST /foods 201
```

---

## ✅ Funciona?

**SÍ** → Ya estás conectado! Prueba también "Registrar Establecimiento"

**NO** → Revisa:

1. Backend está corriendo? (terminal 1)
2. URL correcta en `mobile/config/app.config.ts`?
   - Web/iOS: `http://localhost:3000`
   - Android: `http://10.0.2.2:3000`

---

## 📊 Resumen de Estados

| Formulario          | Funciona?  | Limitación           |
| ------------------- | ---------- | -------------------- |
| 🍕 Alimentos        | ✅ SÍ      | Ninguna              |
| 🏪 Establecimientos | ⚠️ Parcial | Solo guarda 4 campos |
| 👤 Beneficiarios    | ❌ NO      | Endpoint no existe   |

---

## 📚 Más Info

- **Guía completa**: [`GUIA_PRUEBAS_CONEXION.md`](./GUIA_PRUEBAS_CONEXION.md)
- **Estado técnico**: [`ESTADO_CONEXION_BACKEND.md`](./ESTADO_CONEXION_BACKEND.md)
