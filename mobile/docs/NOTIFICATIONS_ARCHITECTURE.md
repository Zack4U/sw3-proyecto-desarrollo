# 🔔 Arquitectura de Notificaciones Push

## 📋 Descripción General

Este documento describe la arquitectura del sistema de notificaciones push implementado en la aplicación móvil ComiYa y cómo se integrará con el backend en el futuro.

## 🏗️ Arquitectura Actual

### Componentes Principales

#### 1. **NotificationService** (`services/notificationService.ts`)
Servicio singleton que maneja toda la lógica de notificaciones:
- ✅ Configuración de canales de notificación (Android)
- ✅ Solicitud de permisos
- ✅ Obtención del Expo Push Token
- ✅ Registro del token en el backend
- ✅ Envío de notificaciones locales
- ✅ Gestión de listeners de notificaciones

#### 2. **NotificationContext** (`contexts/NotificationContext.tsx`)
Context Provider que hace disponible las funcionalidades de notificación en toda la app:
- Proporciona el token push
- Proporciona método para enviar notificaciones de prueba
- Proporciona método para re-registrar notificaciones

#### 3. **useNotifications Hook** (`hooks/useNotifications.ts`)
Hook personalizado que encapsula la lógica de negocio:
- Registra automáticamente el token al montar
- Maneja listeners de notificaciones recibidas
- Maneja respuestas del usuario a notificaciones
- Proporciona navegación contextual según tipo de notificación

### Canales de Notificación (Android)

```typescript
'default'      → Notificaciones generales del sistema
'orders'       → Notificaciones de pedidos
'food-alerts'  → Alertas de alimentos (USADO PARA PRUEBAS)
```

## 🔄 Flujo Actual (Prueba)

```
┌────────────────────────┐
│ BeneficiaryHomeScreen  │
│ (Usuario autenticado)  │
└──────┬─────────────────┘
       │ handleTestPushNotification()
       ↓
┌──────────────────────┐
│ NotificationContext  │
└──────┬───────────────┘
       │ sendTestNotification()
       ↓
┌──────────────────────┐
│ useNotifications     │
└──────┬───────────────┘
       │ + userContext
       ↓
┌──────────────────────┐
│ notificationService  │
└──────┬───────────────┘
       │ sendTestNotificationToBackend()
       ↓
┌──────────────────────┐
│ Expo Notifications   │
│ API                  │
└──────────────────────┘
```

### Ventajas del Flujo Actual
- ✅ Token asociado a usuario autenticado
- ✅ Simula flujo real de producción
- ✅ Permite validar permisos con usuario activo
- ✅ Token puede guardarse en backend asociado al userId

## 🚀 Implementación Futura: Notificaciones del Backend

### Caso de Uso: Selección de Alimento

**Flujo Completo:**

```
┌─────────────────────┐
│ Beneficiario        │
│ Selecciona Alimento │
└─────────┬───────────┘
          │
          │ POST /orders/create
          ↓
┌─────────────────────┐
│ Backend API         │
│ (NestJS)            │
└─────────┬───────────┘
          │
          │ 1. Crea orden en DB
          │ 2. Obtiene token del establecimiento
          ↓
┌─────────────────────┐
│ Notification Service│
│ (Backend)           │
└─────────┬───────────┘
          │
          │ POST https://exp.host/--/api/v2/push/send
          ↓
┌─────────────────────┐
│ Expo Push           │
│ Notification Service│
└─────────┬───────────┘
          │
          │ Push Notification
          ↓
┌─────────────────────┐
│ Establecimiento     │
│ (Dispositivo Móvil) │
└─────────────────────┘
```

### Endpoint Backend (A Implementar)

**POST /api/v1/notifications/send-to-establishment**

```typescript
interface SendNotificationDto {
  establishmentId: string;
  title: string;
  body: string;
  data: {
    type: 'food_alert' | 'order_created' | 'order_updated';
    orderId?: string;
    foodId?: string;
    beneficiaryName?: string;
  };
}
```

**Ejemplo de Request:**
```json
{
  "establishmentId": "est-123",
  "title": "🍽️ Nuevo Pedido Recibido",
  "body": "María García ha solicitado tus Empanadas de Carne",
  "data": {
    "type": "order_created",
    "orderId": "ord-456",
    "foodId": "food-789",
    "beneficiaryName": "María García"
  }
}
```

### Implementación Backend (Ejemplo)

```typescript
// backend/src/services/push-notification.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class PushNotificationService {
  private readonly EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

  constructor(private httpService: HttpService) {}

  async sendToEstablishment(
    establishmentId: string,
    title: string,
    body: string,
    data: any
  ): Promise<void> {
    // 1. Obtener token del establecimiento desde la DB
    const establishment = await this.prisma.establishment.findUnique({
      where: { id: establishmentId },
      select: { pushToken: true }
    });

    if (!establishment?.pushToken) {
      throw new Error('Establishment does not have a push token');
    }

    // 2. Enviar notificación a Expo
    const message = {
      to: establishment.pushToken,
      sound: 'default',
      title,
      body,
      data,
      channelId: 'food-alerts',
      priority: 'high',
    };

    await this.httpService.post(this.EXPO_PUSH_URL, message).toPromise();
    console.log(`✅ Push notification sent to establishment ${establishmentId}`);
  }
}
```

## 📱 Tipos de Notificación

### 1. **order_created**
Cuando un beneficiario crea un pedido
```typescript
{
  type: 'order_created',
  orderId: string,
  foodId: string,
  beneficiaryName: string
}
```

### 2. **order_updated**
Cuando cambia el estado de un pedido
```typescript
{
  type: 'order_updated',
  orderId: string,
  status: 'CONFIRMED' | 'READY' | 'COMPLETED' | 'CANCELLED'
}
```

### 3. **food_alert**
Alertas relacionadas con alimentos (usado actualmente para pruebas)
```typescript
{
  type: 'food_alert',
  foodId?: string,
  message: string,
  timestamp: string
}
```

### 4. **system**
Notificaciones del sistema
```typescript
{
  type: 'system',
  message: string
}
```

## 🔐 Seguridad

### Token Management
- ✅ Los tokens se registran automáticamente al instalar la app
- ✅ Se re-registran en cada inicio de sesión
- ✅ Se almacenan en la base de datos asociados al usuario/establecimiento
- ⚠️ **TODO:** Implementar rotación de tokens
- ⚠️ **TODO:** Implementar expiración de tokens

### Validaciones Backend
- ✅ Verificar que el establecimiento existe
- ✅ Verificar que el token es válido
- ✅ Validar permisos (solo enviar a establecimientos que poseen el alimento)
- ⚠️ **TODO:** Rate limiting para prevenir spam

## 🧪 Testing

### Prueba Manual (Actual)
1. Abrir WelcomeScreen
2. Presionar "🔔 Probar Notificaciones Push"
3. Verificar que aparece la notificación
4. Verificar que se puede tocar y ejecuta la lógica correspondiente

### Pruebas Futuras (Backend)
```bash
# Enviar notificación de prueba desde backend
curl -X POST http://localhost:3001/api/v1/notifications/test \
  -H "Content-Type: application/json" \
  -d '{
    "establishmentId": "est-123",
    "title": "Test",
    "body": "Prueba de notificación"
  }'
```

## 📊 Métricas y Monitoreo

### Logs Importantes
- ✅ Token registration success/failure
- ✅ Notification sent success/failure
- ✅ Notification received
- ✅ Notification tapped
- ⚠️ **TODO:** Implementar analytics para tasas de apertura

## 🔜 Roadmap

### Fase 1: Infraestructura Base (✅ COMPLETADO)
- [x] Configurar Expo Notifications
- [x] Implementar servicio de notificaciones
- [x] Crear context provider
- [x] Implementar registro de tokens
- [x] Pruebas locales

### Fase 2: Integración Backend (🔄 PENDIENTE)
- [ ] Crear endpoint para registrar tokens en DB
- [ ] Crear servicio de envío de notificaciones en backend
- [ ] Implementar lógica de negocio (enviar cuando se selecciona alimento)
- [ ] Pruebas de integración

### Fase 3: Funcionalidades Avanzadas (📋 PLANIFICADO)
- [ ] Notificaciones programadas
- [ ] Notificaciones por proximidad geográfica
- [ ] Notificaciones de recordatorio
- [ ] Rich notifications con imágenes
- [ ] Actions en notificaciones (Aceptar/Rechazar)

## 📚 Referencias

- [Expo Notifications Docs](https://docs.expo.dev/push-notifications/overview/)
- [Expo Push Notification Tool](https://expo.dev/notifications)
- [Android Notification Channels](https://developer.android.com/training/notify-user/channels)
- [iOS Notification Configuration](https://developer.apple.com/documentation/usernotifications)

## 👥 Contacto

Para preguntas sobre la implementación, contactar al equipo de desarrollo.

---

**Última actualización:** Noviembre 2025
**Versión:** 1.0.0
