# 📚 Documentación del Proyecto - Backend

Esta carpeta contiene toda la documentación técnica del backend del proyecto Comiya Business.

## 📄 Documentos Disponibles

### 🔄 [database-workflow.md](./database-workflow.md)
Guía completa y detallada sobre cómo trabajar con Prisma y actualizar la base de datos.

**Contenido:**
- Escenarios comunes de cambios en DB
- Flujos paso a paso con ejemplos
- Comparación de comandos
- Problemas comunes y soluciones
- Mejores prácticas

**Cuándo consultar:** Cuando necesites hacer cualquier cambio en la estructura de la base de datos.

---

### ⚡ [database-quick-guide.md](./database-quick-guide.md)
Guía rápida de referencia para actualizar la base de datos.

**Contenido:**
- TL;DR con comandos esenciales
- Diagramas visuales de flujos
- Ejemplos prácticos cortos
- Tabla de comandos

**Cuándo consultar:** Cuando necesites recordar rápidamente cómo hacer un cambio común.

---

## 🚀 Inicio Rápido

### ¿Primera vez trabajando con la base de datos?

1. Lee primero: [database-workflow.md](./database-workflow.md) (guía completa)
2. Ten a mano: [database-quick-guide.md](./database-quick-guide.md) (referencia rápida)

### ¿Ya tienes experiencia?

Consulta directamente: [database-quick-guide.md](./database-quick-guide.md)

---

## 📖 Otros Recursos

### Scripts de Configuración
Ver `backend/scripts/` para scripts de setup de base de datos:
- `setup-database.ps1` - Script PowerShell para Windows
- `setup-database.sh` - Script Bash para Linux/macOS
- `setup-database.sql` - Script SQL puro

### Prisma Schema
Archivo principal: `backend/prisma/schema.prisma`

### Migraciones
Carpeta: `backend/prisma/migrations/`

---

## 🤝 Contribuir a la Documentación

Si encuentras algo que falta o que podría mejorarse:

1. Crea un issue describiendo la mejora
2. O crea una PR con los cambios propuestos
3. Asegúrate de mantener el formato Markdown consistente

---

## 📞 Soporte

Para preguntas sobre:
- **Base de datos:** Consulta [database-workflow.md](./database-workflow.md)
- **Prisma:** [Documentación oficial de Prisma](https://www.prisma.io/docs)
- **NestJS:** [Documentación oficial de NestJS](https://docs.nestjs.com)

---

**Última actualización:** Octubre 2025
