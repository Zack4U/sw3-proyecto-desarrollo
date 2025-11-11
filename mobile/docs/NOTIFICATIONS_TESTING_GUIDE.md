# 🔔 Guía de Pruebas de Notificaciones Push

## 📱 Requisitos Previos

### Para Testing Completo (Recomendado)
- **Dispositivo físico Android** - Para notificaciones push reales
- App instalada con Expo Go o build de desarrollo
- Permisos de notificación habilitados
- Conexión a internet

### Para Debug/Testing Local (También Funciona)
- **Emulador Android o iOS** - Para notificaciones locales
- Expo Go o build de desarrollo
- Permisos de notificación habilitados (se solicitan automáticamente)
- ❌ NO requiere conexión a internet para notificaciones locales

> 💡 **Diferencia Clave:**
> - **Emulador**: Notificaciones LOCALES (generadas por la app misma) ✅
> - **Dispositivo físico**: Notificaciones PUSH (pueden venir del backend) ✅✅

## 🚀 Cómo Probar

### Opción 1: Desde BeneficiaryHomeScreen (Implementado)

1. **Abrir la aplicación** en tu dispositivo físico Android
2. **Iniciar sesión** como beneficiario
3. En la pantalla principal, verás un botón: **"🔔 Probar Notificaciones"**
4. **Presionar el botón**
5. La app solicitará permisos si es la primera vez
6. Aparecerá un alert confirmando el envío
7. **En 2-3 segundos** recibirás la notificación

> 💡 **Ventaja de probar autenticado:** El token se asocia con el usuario actual en el contexto, simulando mejor el flujo real donde los establecimientos recibirán notificaciones asociadas a su cuenta.

### Opción 2: Desde Expo Push Tool (Alternativa)

1. Obtener el Expo Push Token desde los logs de la app
2. Ir a: https://expo.dev/notifications
3. Pegar el token
4. Configurar el mensaje:
   ```json
   {
     "to": "ExponentPushToken[tu-token-aqui]",
     "title": "🍽️ Test desde Expo",
     "body": "Probando notificaciones desde la web",
     "data": {
       "type": "food_alert",
       "message": "Test"
     }
   }
   ```
5. Presionar "Send a Notification"

## ✅ Qué Esperar

### Comportamiento Esperado

#### Cuando la App está en **Foreground** (abierta):
- ✅ Aparece un banner de notificación en la parte superior
- ✅ Se reproduce un sonido
- ✅ La notificación se registra en el estado del Context

#### Cuando la App está en **Background**:
- ✅ Aparece en el notification drawer de Android
- ✅ Se reproduce sonido y vibración
- ✅ Al tocar, abre la app

#### Cuando la App está **Cerrada**:
- ✅ Aparece en el notification drawer
- ✅ Se reproduce sonido y vibración
- ✅ Al tocar, abre la app y ejecuta la navegación correspondiente

## 📋 Datos de la Notificación de Prueba

La notificación de prueba simula el comportamiento futuro cuando se seleccione un alimento:

```typescript
{
  title: "🍽️ Nuevo Interés en Alimento",
  body: "Un beneficiario ha mostrado interés en tus alimentos disponibles",
  data: {
    type: "food_alert",
    message: "Notificación de prueba del sistema",
    timestamp: "2025-11-08T..."
  },
  channelId: "food-alerts"  // Android
}
```

## 🔍 Debugging

### Ver Logs en Tiempo Real

#### En Metro Bundler:
```bash
# Los logs aparecerán automáticamente cuando uses la app
# Busca estos mensajes:
📬 Notificación recibida: ...
✅ Push Token obtenido: ExponentPushToken[...]
✅ Token registrado en el backend
```

#### En Android Logcat:
```bash
adb logcat | grep -i "expo\|notification"
```

### Problemas Comunes

#### ❌ "Token no disponible"
**Causa:** La app no tiene permisos o no es dispositivo físico
**Solución:** 
- Verificar que es dispositivo físico
- Ir a Configuración > Apps > ComiYa > Permisos > Notificaciones (Habilitar)

#### ❌ No aparece la notificación
**Causa:** Permisos no otorgados o problemas de red
**Solución:**
1. Verificar permisos: Configuración > Apps > ComiYa > Permisos
2. Verificar logs para ver si hay errores
3. Intentar desde Expo Push Tool para descartar problemas de código

#### ⚠️ "Las notificaciones push solo funcionan en dispositivos físicos"
**Causa:** Estás usando un emulador
**Solución:** Esto es solo un WARNING informativo
- ✅ Las notificaciones **LOCALES** SÍ funcionan en emulador
- ✅ Puedes hacer testing completo
- ❌ Solo las notificaciones **remotas desde servidor** no funcionan en emulador
- 💡 Para testing de integración con backend, usa dispositivo físico

## 🎯 Validación de Funcionalidad

### Checklist de Pruebas

- [ ] Token se obtiene correctamente al iniciar la app
- [ ] Botón "Probar Notificaciones Push" está visible en WelcomeScreen
- [ ] Al presionar, aparece el indicador de carga
- [ ] Aparece alert de confirmación
- [ ] Notificación llega en 2-3 segundos
- [ ] Notificación tiene el título correcto
- [ ] Notificación tiene el cuerpo correcto
- [ ] Notificación tiene el ícono de alimentos (🍽️)
- [ ] Al tocar la notificación, se registra el evento en logs
- [ ] Estado del token muestra "✅ Token registrado"

## 📊 Información Técnica

### Canales Configurados

```typescript
'default'      → Notificaciones generales
'orders'       → Notificaciones de pedidos
'food-alerts'  → Alertas de alimentos (ACTUAL)
```

### Prioridad de Notificación

- **Android:** `AndroidImportance.HIGH`
- **Vibración:** `[0, 500, 250, 500]` ms
- **Sonido:** Default del sistema

## 🔮 Uso Futuro

Esta funcionalidad de prueba establece la base para:

1. **Notificación a Establecimientos** cuando un beneficiario selecciona un alimento
2. **Notificación a Beneficiarios** cuando un pedido cambia de estado
3. **Alertas de Alimentos** cuando un alimento está próximo a vencer
4. **Notificaciones del Sistema** para mantenimiento o actualizaciones

### Flujo Futuro (Ejemplo)

```
Beneficiario selecciona alimento
         ↓
Backend recibe request
         ↓
Backend obtiene token del establecimiento
         ↓
Backend envía notificación push
         ↓
Establecimiento recibe: "🍽️ Nuevo pedido de María G."
```

## 📸 Screenshots Esperados

### 1. WelcomeScreen con Botón de Prueba
- Botón con borde acento
- Texto: "🔔 Probar Notificaciones Push"
- Estado del token visible

### 2. Notificación en Foreground
- Banner superior
- Título: "🍽️ Nuevo Interés en Alimento"
- Cuerpo: "Un beneficiario ha mostrado..."

### 3. Notificación en Notification Drawer
- Ícono de la app
- Título y cuerpo visibles
- Timestamp

## 💡 Tips

1. **Probar en diferentes estados de la app** (abierta, background, cerrada)
2. **Verificar el volumen** del dispositivo
3. **Revisar No Molestar** - desactivarlo si está activo
4. **Probar con diferentes datos** usando Expo Push Tool
5. **Guardar el token** para pruebas futuras desde el backend

## 🆘 Soporte

Si encuentras problemas:

1. Revisar logs de la aplicación
2. Verificar permisos de notificación
3. Confirmar que es dispositivo físico
4. Revisar conexión a internet
5. Verificar que Expo services estén disponibles: https://status.expo.dev

---

**Última actualización:** Noviembre 2025
