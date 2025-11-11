# 🌍 Geolocation Endpoints

Base URL: `/geolocation`

Documentación de endpoints para verificación de direcciones y coordenadas usando Google Maps API.

---

## 📋 Tabla de Contenidos

- [🌍 Geolocation Endpoints](#-geolocation-endpoints)
  - [📋 Tabla de Contenidos](#-tabla-de-contenidos)
  - [📋 Endpoints Disponibles](#-endpoints-disponibles)
    - [1. Verificar Dirección](#1-verificar-dirección)
    - [2. Verificar Coordenadas](#2-verificar-coordenadas)
  - [📍 Formato de Ubicación](#-formato-de-ubicación)
  - [🗺️ Uso Típico](#%EF%B8%8F-uso-típico)
  - [🔒 Permisos](#-permisos)
  - [⚙️ Configuración](#%EF%B8%8F-configuración)
  - [🐛 Manejo de Errores](#-manejo-de-errores)
  - [💡 Mejores Prácticas](#-mejores-prácticas)
  - [📊 Límites de Google Maps API](#-límites-de-google-maps-api)
  - [🔗 Ver También](#-ver-también)

---

## 📋 Endpoints Disponibles

### 1. Verificar Dirección

**`POST /geolocation/verify-address`** 🔒

Verificar y obtener coordenadas de una dirección usando Google Maps Geocoding API.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "address": "Calle 123 #45-67, Bogotá, Colombia"
}
```

**Response (200):**
```json
{
  "valid": true,
  "formattedAddress": "Calle 123 #45-67, Bogotá, Cundinamarca, Colombia",
  "location": {
    "type": "Point",
    "coordinates": [-74.0721, 4.7110]
  },
  "placeId": "ChIJlQGWPn4bRo4R...",
  "types": ["street_address"],
  "addressComponents": [
    {
      "long_name": "Calle 123",
      "short_name": "Calle 123",
      "types": ["route"]
    },
    {
      "long_name": "Bogotá",
      "short_name": "Bogotá",
      "types": ["locality", "political"]
    },
    {
      "long_name": "Cundinamarca",
      "short_name": "Cundinamarca",
      "types": ["administrative_area_level_1", "political"]
    },
    {
      "long_name": "Colombia",
      "short_name": "CO",
      "types": ["country", "political"]
    }
  ]
}
```

**Errores:**
- `400` - Dirección inválida o no encontrada
- `401` - No autenticado
- `500` - Error al conectar con Google Maps API

**Notas:**
- Requiere `GOOGLE_MAPS_API_KEY` configurado en `.env`
- La API de Google debe tener habilitada "Geocoding API"
- El formato de coordenadas es [longitud, latitud] (GeoJSON)
- La dirección debe ser lo más específica posible

---

### 2. Verificar Coordenadas

**`POST /geolocation/verify-coordinates`** 🔒

Verificar coordenadas y obtener dirección usando Google Maps Reverse Geocoding.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "latitude": 4.7110,
  "longitude": -74.0721
}
```

**Response (200):**
```json
{
  "valid": true,
  "address": "Calle 123 #45-67, Bogotá, Cundinamarca, Colombia",
  "location": {
    "type": "Point",
    "coordinates": [-74.0721, 4.7110]
  },
  "placeId": "ChIJlQGWPn4bRo4R...",
  "types": ["street_address"],
  "addressComponents": [
    {
      "long_name": "Bogotá",
      "short_name": "Bogotá",
      "types": ["locality", "political"]
    },
    {
      "long_name": "Colombia",
      "short_name": "CO",
      "types": ["country", "political"]
    }
  ]
}
```

**Errores:**
- `400` - Coordenadas inválidas o fuera de rango
- `401` - No autenticado
- `500` - Error al conectar con Google Maps API

**Notas:**
- Latitud debe estar entre -90 y 90
- Longitud debe estar entre -180 y 180
- Útil para validar ubicaciones obtenidas por GPS

---

## 📍 Formato de Ubicación

El sistema usa el formato **GeoJSON Point** para almacenar ubicaciones:

```json
{
  "type": "Point",
  "coordinates": [longitude, latitude]
}
```

**Ejemplo:**
- Bogotá: `[-74.0721, 4.7110]`
- Medellín: `[-75.5636, 6.2442]`
- Cali: `[-76.5225, 3.4516]`

⚠️ **Importante:** El orden es `[longitud, latitud]`, no al revés.

---

## 🗺️ Uso Típico

### Flujo de Registro de Establecimiento

1. Usuario ingresa dirección manualmente
2. Frontend llama `POST /geolocation/verify-address`
3. Backend verifica con Google Maps API
4. Se obtienen coordenadas y dirección formateada
5. Usuario confirma ubicación en mapa
6. Se crea establecimiento con `location` validada

### Flujo con GPS

1. Frontend obtiene coordenadas GPS del dispositivo
2. Llama `POST /geolocation/verify-coordinates`
3. Backend obtiene dirección legible
4. Usuario confirma o ajusta dirección
5. Se crea establecimiento

---

## 🔒 Permisos

| Endpoint | Autenticación | Rol |
|----------|--------------|-----|
| POST /geolocation/verify-address | ✅ | Cualquiera autenticado |
| POST /geolocation/verify-coordinates | ✅ | Cualquiera autenticado |

---

## ⚙️ Configuración

### Variables de Entorno Requeridas

```bash
# .env
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### Obtener API Key

1. Ir a [Google Cloud Console](https://console.cloud.google.com)
2. Crear/seleccionar proyecto
3. Habilitar APIs:
   - Geocoding API
   - Maps JavaScript API (opcional, para mapas)
   - Places API (opcional, para autocompletado)
4. Crear credenciales → API Key
5. Restringir key (recomendado):
   - Por IP (backend)
   - Por API (solo Geocoding API)

---

## 🐛 Manejo de Errores

### Error 400 - Dirección no encontrada
```json
{
  "statusCode": 400,
  "message": "Address not found or invalid",
  "error": "Bad Request"
}
```

### Error 400 - Coordenadas inválidas
```json
{
  "statusCode": 400,
  "message": "Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180",
  "error": "Bad Request"
}
```

### Error 500 - Error de Google Maps
```json
{
  "statusCode": 500,
  "message": "Error verifying address with Google Maps API",
  "error": "Internal Server Error"
}
```

---

## 💡 Mejores Prácticas

1. **Validar antes de guardar:** Siempre verificar dirección/coordenadas antes de crear/actualizar establecimiento
2. **Mostrar confirmación:** Mostrar dirección formateada y ubicación en mapa al usuario
3. **Caché:** Considerar cachear resultados frecuentes para ahorrar cuota de API
4. **Manejo de errores:** Tener fallback si Google Maps no está disponible
5. **Límites de uso:** Monitorear uso de API para evitar cargos inesperados

---

## 📊 Límites de Google Maps API

- **Geocoding API:**
  - Free tier: 40,000 requests/mes
  - $5 USD por cada 1,000 requests adicionales
  
- **Mejores prácticas:**
  - Cachear resultados
  - Validar antes de enviar request
  - Usar debouncing en autocomplete

---

## 🔗 Ver También

- [Establishments Endpoints](./ESTABLISHMENTS.md)
- [Google Maps Geocoding API Docs](https://developers.google.com/maps/documentation/geocoding)
- [Google Maps Setup Guide](https://developers.google.com/maps/get-started)
