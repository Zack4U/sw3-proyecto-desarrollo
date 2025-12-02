# 🔔 Notificaciones Push - FAQ (Preguntas Frecuentes)

## ❓ Preguntas Comunes

### 1. "Veo el warning 'Las notificaciones push solo funcionan en dispositivos físicos'. ¿Puedo hacer testing?"

**✅ SÍ, puedes hacer testing completo en emulador.**

Este es solo un **warning informativo**, no un error bloqueante.

#### Diferencias:

| Característica | Emulador | Dispositivo Físico |
|---|---|---|
| Notificaciones Locales | ✅ SÍ | ✅ SÍ |
| Push Token Real | ❌ NO | ✅ SÍ |
| Notificaciones Remotas | ❌ NO | ✅ SÍ |
| Testing de UI | ✅ SÍ | ✅ SÍ |
| Testing de Flujo | ✅ SÍ | ✅ SÍ |

#### Ejemplo Práctico:

```typescript
// En EMULADOR:
token = "LOCAL_TESTING_TOKEN"  // Token simulado
notification = schedulePushNotification()  // ✅ Funciona (local)
sendToExpoAPI()  // ❌ No funciona (remoto)

// En DISPOSITIVO FÍSICO:
token = "ExponentPushToken[xxxxxx]"  // Token real
notification = schedulePushNotification()  // ✅ Funciona (local)
sendToExpoAPI()  // ✅ Funciona (remoto)
```

---

### 2. "¿Qué significa 'Token no disponible'?"

Esto puede ocurrir por varias razones:

#### Causas Comunes:

1. **Primera vez que se solicitan permisos**
   - La app está pidiendo permisos
   - Presiona "Permitir" en el dialog de Android/iOS

2. **Permisos denegados previamente**
   - Ve a: Configuración → Apps → ComiYa → Permisos → Notificaciones
   - Habilita los permisos

3. **Emulador sin permisos configurados**
   - En emulador, acepta el dialog de permisos
   - Los permisos se solicitan automáticamente al presionar el botón

#### Solución:

El botón "Probar Notificaciones" automáticamente:
1. ✅ Solicita permisos si no los tiene
2. ✅ Registra el token (real o local)
3. ✅ Envía la notificación de prueba

**Solo debes presionarlo y aceptar permisos cuando te lo pida.**

---

### 3. "¿Notificaciones locales vs Push? ¿Cuál es la diferencia?"

#### Notificaciones Locales (Local Notifications)
- 📱 Generadas por la **app misma**
- ⚡ Aparecen inmediatamente
- 🔧 Útiles para: Recordatorios, alarmas, testing
- ✅ Funcionan en emulador
- ✅ No requieren internet
- ✅ No requieren servidor

```typescript
// Ejemplo: Notificación Local
await Notifications.scheduleNotificationAsync({
  content: {
    title: "¡Recordatorio!",
    body: "Revisa los alimentos disponibles"
  },
  trigger: null // Inmediato
});
```

#### Notificaciones Push (Push Notifications)
- 🌐 Enviadas desde un **servidor externo**
- 📡 Requieren internet
- 🔧 Útiles para: Mensajes, alertas en tiempo real, comunicación servidor-app
- ❌ NO funcionan en emulador
- ✅ Requieren token real
- ✅ Requieren backend configurado

```typescript
// Ejemplo: Notificación Push (desde backend)
POST https://exp.host/--/api/v2/push/send
{
  "to": "ExponentPushToken[xxxxxx]",
  "title": "Nuevo pedido",
  "body": "María García seleccionó tu alimento"
}
```

---

### 4. "¿Por qué usar notificaciones locales si no son reales?"

Las notificaciones locales son **perfectas para desarrollo y testing** porque:

1. ✅ **Testing de UI**: Verificar que se vean correctamente
2. ✅ **Testing de UX**: Verificar flujo de navegación al tocar
3. ✅ **Testing de Lógica**: Verificar que los datos se manejen bien
4. ✅ **Desarrollo Rápido**: No necesitas backend configurado
5. ✅ **Debugging**: Puedes probar sin conexión

**En producción**, el backend enviará notificaciones **push** reales a dispositivos físicos.

---

### 5. "¿Cómo sé si mi notificación es local o push?"

Revisa los logs al enviar:

```javascript
// EMULADOR:
📱 Token: LOCAL_TESTING_TOKEN
🖥️ Modo: Emulador (Local)
ℹ️ Notificación local enviada (modo emulador)

// DISPOSITIVO FÍSICO:
📱 Token: ExponentPushToken[xK_abc123...]
🖥️ Modo: Dispositivo (Push)
ℹ️ Notificación push enviada (dispositivo físico)
```

---

### 6. "¿Necesito configurar algo especial para testing en emulador?"

**NO**, todo está configurado automáticamente:

✅ Permisos se solicitan automáticamente
✅ Token local se genera automáticamente
✅ Notificaciones locales funcionan out-of-the-box
✅ Solo presiona el botón y acepta permisos

---

### 7. "En producción, ¿cómo funcionarán las notificaciones reales?"

#### Flujo Completo:

```
1. Usuario selecciona alimento
         ↓
2. App envía request al backend
   POST /orders/create
         ↓
3. Backend procesa orden
         ↓
4. Backend obtiene token del establecimiento
   SELECT pushToken FROM establishments WHERE id = X
         ↓
5. Backend envía a Expo Push API
   POST https://exp.host/--/api/v2/push/send
   {
     "to": "ExponentPushToken[...]",
     "title": "🍽️ Nuevo Pedido",
     "body": "María García seleccionó: Empanadas"
   }
         ↓
6. Expo distribuye la notificación
         ↓
7. Establecimiento recibe push notification
   (en su dispositivo físico)
         ↓
8. Usuario toca notificación
         ↓
9. App navega a detalles del pedido
```

---

### 8. "¿Por qué el botón dice 'Registrando permisos...' pero luego no funciona?"

Esto pasa cuando:

1. Rechazaste los permisos la primera vez
2. Los permisos están deshabilitados en configuración del sistema

**Solución:**

1. Ve a **Configuración del dispositivo/emulador**
2. Apps → ComiYa → Permisos → Notificaciones
3. **Habilitar**
4. Vuelve a la app y presiona el botón nuevamente

---

### 9. "¿Cuándo debería usar dispositivo físico para testing?"

Usa dispositivo físico cuando necesites probar:

- ✅ Token push real
- ✅ Notificaciones desde el backend
- ✅ Integración completa
- ✅ Performance real
- ✅ Sonidos y vibraciones específicas del dispositivo
- ✅ Notificaciones cuando la app está cerrada

Usa emulador para:

- ✅ Desarrollo rápido
- ✅ Testing de UI
- ✅ Testing de lógica
- ✅ Debugging con herramientas de desarrollo
- ✅ No tienes dispositivo físico disponible

---

### 10. "La notificación no aparece. ¿Qué reviso?"

#### Checklist de Debug:

```bash
# 1. Verificar permisos
Configuración > Apps > ComiYa > Permisos > Notificaciones ✅

# 2. Verificar logs
📱 Token: LOCAL_TESTING_TOKEN o ExponentPushToken[...]  ✅
✅ Notificación de prueba enviada correctamente  ✅

# 3. Verificar modo de la app
App en foreground → Debería aparecer banner en la parte superior
App en background → Debería aparecer en notification drawer

# 4. Verificar volumen
Volumen del dispositivo > 0

# 5. Verificar No Molestar
No Molestar debe estar desactivado

# 6. Probar notificación simple
await Notifications.scheduleNotificationAsync({
  content: { title: "Test", body: "Simple test" },
  trigger: null
});
```

---

## 📊 Tabla Resumen

| Aspecto | Emulador | Dispositivo Físico |
|---------|----------|-------------------|
| **Notificaciones Locales** | ✅ Sí | ✅ Sí |
| **Notificaciones Push** | ❌ No | ✅ Sí |
| **Token Real** | ❌ No (`LOCAL_TESTING_TOKEN`) | ✅ Sí (`ExponentPushToken[...]`) |
| **Testing de UI** | ✅ Perfecto | ✅ Perfecto |
| **Testing de Backend** | ❌ No (sin token real) | ✅ Sí |
| **Desarrollo Rápido** | ✅✅ Excelente | ✅ Bueno |
| **Debugging** | ✅✅ Excelente | ✅ Bueno |
| **Integración Completa** | ❌ Limitado | ✅✅ Completo |

---

## 🎯 Recomendaciones

### Durante Desarrollo
1. ✅ Usa **emulador** para desarrollo rápido
2. ✅ Usa notificaciones **locales** para testing
3. ✅ Usa logs para verificar funcionamiento
4. ✅ Acepta permisos cuando te lo pida

### Antes de Producción
1. ✅ Prueba en **dispositivo físico**
2. ✅ Prueba notificaciones **push** desde backend
3. ✅ Prueba con app en foreground, background y cerrada
4. ✅ Prueba navegación al tocar notificaciones
5. ✅ Verifica que los tokens se guarden en la base de datos

---

## 🆘 ¿Aún tienes problemas?

1. Revisa los logs en Metro Bundler
2. Verifica los permisos del sistema
3. Prueba con una notificación simple
4. Consulta la documentación: [NOTIFICATIONS_TESTING_GUIDE.md](./NOTIFICATIONS_TESTING_GUIDE.md)
5. Revisa la arquitectura: [NOTIFICATIONS_ARCHITECTURE.md](./NOTIFICATIONS_ARCHITECTURE.md)

---

**Última actualización:** Noviembre 2025
