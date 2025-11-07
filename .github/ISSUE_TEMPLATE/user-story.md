---
name: User Story
about: Template para historias de usuario del proyecto ComiYa
title: '[US#.#] - '
labels: ['user-story', 'needs-triage']
assignees: ''
---

**ID:** US#.#  
**Prioridad:** [Alta/Media/Baja]  
**Título:** [Título descriptivo de la historia]  
**Rol:** Como [rol del usuario]  
**Funcionalidad:** Quiero [acción que desea realizar]  
**Beneficio:** Para [beneficio o valor que obtiene]

---

## ✅ **Descripción**

[Descripción detallada de la funcionalidad a implementar. Incluye el contexto, alcance y cualquier información relevante que ayude a entender la historia de usuario.]

---

## 🎯 **Criterios de Aceptación**

### Backend
- [ ] [Criterio de aceptación 1]
- [ ] [Criterio de aceptación 2]
- [ ] [Criterio de aceptación 3]

### Mobile
- [ ] [Criterio de aceptación 1]
- [ ] [Criterio de aceptación 2]
- [ ] [Criterio de aceptación 3]

### Web (opcional)
- [ ] [Criterio de aceptación 1]
- [ ] [Criterio de aceptación 2]

---

## 🧩 **Checklist / Tareas**

### 📊 1. Modelado de Datos (Backend)

- [ ] **Actualizar `backend/prisma/schema.prisma`**
  - Agregar/modificar modelos necesarios
  - Definir relaciones
  - Agregar índices

- [ ] **Ejecutar migración**
  ```bash
  npm run prisma:migrate
  # Nombre: [nombre_descriptivo_de_la_migración]
  ```

- [ ] **Crear/actualizar seeds** en `backend/prisma/seeds/`
  - Datos de prueba relevantes

### 📝 2. DTOs (Backend)

- [ ] **Crear `backend/src/dtos/[Módulo]/create-[entidad].dto.ts`**
  - Validaciones con class-validator
  - Documentación con @ApiProperty

- [ ] **Crear `backend/src/dtos/[Módulo]/update-[entidad].dto.ts`**
  - Campos opcionales
  - Validaciones apropiadas

- [ ] **Crear otros DTOs necesarios** (query, response, etc.)

### 🔧 3. Servicio (Backend)

- [ ] **Crear/actualizar `backend/src/services/[entidad].service.ts`**
  - Método `create()`: [descripción]
  - Método `findAll()`: [descripción]
  - Método `findOne()`: [descripción]
  - Método `update()`: [descripción]
  - Método `remove()`: [descripción]
  - Métodos adicionales: [listar]

### 🎮 4. Controlador (Backend)

- [ ] **Crear/actualizar `backend/src/controllers/[entidad].controller.ts`**
  ```typescript
  @ApiTags('[entidad]')
  @Controller('[entidad]')
  export class [Entidad]Controller {
    // POST /[entidad] - Crear
    // GET /[entidad] - Listar
    // GET /[entidad]/:id - Obtener uno
    // PUT /[entidad]/:id - Actualizar
    // DELETE /[entidad]/:id - Eliminar
    // Endpoints adicionales
  }
  ```

- [ ] **Registrar en `backend/src/app.module.ts`**
  - Agregar controller
  - Agregar service

### 🧪 5. Testing (Backend)

- [ ] **Crear `backend/test/unit/[entidad].service.spec.ts`**
  - Tests de métodos principales
  - Tests de validaciones
  - Tests de casos edge

- [ ] **Crear `backend/test/unit/[entidad].controller.spec.ts`**
  - Tests de endpoints
  - Tests de autenticación
  - Tests de errores

### 📱 6. Servicio Mobile

- [ ] **Crear/actualizar `mobile/services/[entidad]Service.ts`**
  ```typescript
  export interface [Entidad]Response { }
  export interface Create[Entidad]Data { }
  
  export const [entidad]Service = {
    create: async (data) => { },
    getAll: async () => { },
    getById: async (id) => { },
    update: async (id, data) => { },
    delete: async (id) => { }
  }
  ```

- [ ] **Crear/actualizar tipos en `mobile/types/[entidad].types.ts`**

### 🎨 7. Pantallas Mobile

- [ ] **Crear `mobile/screens/[Nombre]Screen.tsx`**
  - Pantalla 1: [descripción y funcionalidad]
  - Pantalla 2: [descripción y funcionalidad]
  - Pantalla N: [descripción y funcionalidad]

- [ ] **Actualizar navegación** si es necesario
  - Agregar rutas
  - Configurar parámetros

### 🎨 8. Estilos Mobile

- [ ] **Crear estilos** para cada pantalla
  - `mobile/styles/[Nombre]ScreenStyle.tsx`
  - Usar paleta de colores global
  - Mantener consistencia con diseño

### 🔔 9. Integraciones (si aplica)

- [ ] **Notificaciones**
  - Backend: Enviar notificaciones en eventos
  - Mobile: Manejar notificaciones recibidas

- [ ] **Otras integraciones**
  - [Listar integraciones necesarias]

### 📚 10. Documentación

- [ ] **Crear/actualizar documentación técnica**
  - `backend/[MODULO]_IMPLEMENTATION.md` o similar
  - Documentar flujos
  - Ejemplos de uso

- [ ] **Actualizar Swagger**
  - Documentar todos los endpoints
  - Ejemplos de request/response
  - Códigos de error

- [ ] **README**
  - Actualizar si se agregan nuevas dependencias
  - Documentar nuevos comandos

---

## 📌 **Notas Técnicas**

### Stack Tecnológico

**Backend:**
- Framework: NestJS 11.x
- ORM: Prisma 6.17.x
- Base de datos: PostgreSQL 14+
- Autenticación: JWT con Passport
- Validación: class-validator, class-transformer
- Testing: Jest
- Documentación: Swagger/OpenAPI

**Mobile:**
- Framework: React Native (Expo 54)
- Navegación: @react-navigation/native 7.x
- HTTP Client: axios 1.12.x
- Notificaciones: expo-notifications
- Almacenamiento: expo-secure-store
- Estado: React Context API

### Consideraciones de Diseño

[Agregar consideraciones específicas de diseño, patrones a usar, validaciones de negocio, etc.]

### Endpoints API

```
[Método] /api/[ruta]       - [Descripción]
[Método] /api/[ruta]/:id   - [Descripción]
```

### Estructura de Archivos

```
backend/
├── prisma/
│   ├── schema.prisma              (actualizado/nuevo)
│   └── seeds/
│       └── [entidad].seed.ts      (nuevo)
├── src/
│   ├── controllers/
│   │   └── [entidad].controller.ts (nuevo)
│   ├── services/
│   │   └── [entidad].service.ts    (nuevo)
│   ├── dtos/
│   │   └── [Módulo]/
│   │       ├── create-[entidad].dto.ts (nuevo)
│   │       └── update-[entidad].dto.ts (nuevo)
│   └── app.module.ts              (actualizado)
└── test/
    └── unit/
        ├── [entidad].service.spec.ts   (nuevo)
        └── [entidad].controller.spec.ts (nuevo)

mobile/
├── screens/
│   └── [Nombre]Screen.tsx         (nuevo)
├── services/
│   └── [entidad]Service.ts        (nuevo)
├── types/
│   └── [entidad].types.ts         (nuevo)
└── styles/
    └── [Nombre]ScreenStyle.tsx    (nuevo)
```

### Rama de Trabajo

```bash
git checkout develop
git pull origin develop
git checkout -b feature/backend/us#.#-[nombre-descriptivo]
git checkout -b feature/mobile/us#.#-[nombre-descriptivo]
```

---

## 🚀 **Definition of Done**

- [ ] Modelo de datos creado y migrado exitosamente
- [ ] Todos los endpoints implementados y documentados en Swagger
- [ ] Servicio backend con lógica de negocio completa
- [ ] Validaciones de negocio funcionando correctamente
- [ ] Pruebas unitarias con cobertura > 80%
- [ ] Pantallas mobile implementadas con UX/UI consistente
- [ ] Servicio mobile con todos los métodos necesarios
- [ ] Integración completa entre backend y mobile probada
- [ ] Manejo de errores robusto en ambos lados
- [ ] Documentación técnica completa
- [ ] Seeds de datos de prueba creados
- [ ] Code review aprobado por al menos 1 miembro del equipo
- [ ] Merge a develop exitoso sin conflictos
- [ ] Pruebas end-to-end exitosas
- [ ] Demo funcional presentada (opcional)

---

## 📊 **Estimación de Esfuerzo**

- **Backend**: [X-Y] horas
  - Modelado y migración: [X] horas
  - DTOs y validaciones: [X] horas
  - Servicio con lógica: [X] horas
  - Controlador y endpoints: [X] horas
  - Testing: [X] horas

- **Mobile**: [X-Y] horas
  - Servicio API: [X] horas
  - Pantallas: [X] horas
  - Estilos: [X] horas
  - Integración: [X] horas

- **Documentación y testing integración**: [X] horas

**Total estimado**: [X-Y] horas ([X] días/semanas para [N] desarrolladores)

---

## 🔗 **Dependencias**

- [ ] [US/Issue relacionada 1] - [Estado]
- [ ] [US/Issue relacionada 2] - [Estado]
- [ ] [US/Issue relacionada 3] - [Estado]

---

## 📝 **Notas Adicionales**

[Agregar cualquier nota, consideración especial, o información adicional relevante]

---

**Fecha de creación**: [Fecha]  
**Autor**: [Nombre]  
**Versión**: 1.0
