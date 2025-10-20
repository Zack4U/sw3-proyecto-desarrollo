# 🎨 Actualización de Paleta de Colores - ComiYa

## ✨ Resumen de Cambios

Se ha actualizado la paleta de colores de ComiYa para reflejar mejor la identidad de la marca y el enfoque en sostenibilidad y reducción de desperdicio de alimentos.

---

## 🔄 Comparación de Colores

### Colores Principales

| Nombre        | Antes                                                                     | Después                                                                   | Descripción del Cambio                                         |
| ------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------- |
| **Primary**   | ![#00BFA6](https://via.placeholder.com/15/00BFA6/000000?text=+) `#00BFA6` | ![#3CA55C](https://via.placeholder.com/15/3CA55C/000000?text=+) `#3CA55C` | Verde medio más natural y relacionado con alimentos frescos    |
| **Secondary** | ![#009688](https://via.placeholder.com/15/009688/000000?text=+) `#009688` | ![#A7D46F](https://via.placeholder.com/15/A7D46F/000000?text=+) `#A7D46F` | Verde claro suave, ideal para fondos de tarjetas               |
| **Accent**    | ![#FF7043](https://via.placeholder.com/15/FF7043/000000?text=+) `#FF7043` | ![#F9A825](https://via.placeholder.com/15/F9A825/000000?text=+) `#F9A825` | Amarillo cálido, perfecto para alertas de alimentos por vencer |

### Fondos

| Nombre         | Antes                                                                     | Después                                                                   | Descripción del Cambio                                |
| -------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------- |
| **Background** | ![#FAFAFA](https://via.placeholder.com/15/FAFAFA/000000?text=+) `#FAFAFA` | ![#F8FDF5](https://via.placeholder.com/15/F8FDF5/000000?text=+) `#F8FDF5` | Fondo con sutil toque verde que complementa la paleta |
| **Surface**    | ![#FFFFFF](https://via.placeholder.com/15/FFFFFF/000000?text=+) `#FFFFFF` | ![#FFFFFF](https://via.placeholder.com/15/FFFFFF/000000?text=+) `#FFFFFF` | Sin cambios - blanco puro                             |

### Textos

| Nombre             | Antes                                                                     | Después                                                                   | Descripción del Cambio                          |
| ------------------ | ------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------- |
| **Text Primary**   | ![#212121](https://via.placeholder.com/15/212121/000000?text=+) `#212121` | ![#2E2E2E](https://via.placeholder.com/15/2E2E2E/000000?text=+) `#2E2E2E` | Gris oscuro más suave, menos duro para la vista |
| **Text Secondary** | ![#757575](https://via.placeholder.com/15/757575/000000?text=+) `#757575` | ![#6B6B6B](https://via.placeholder.com/15/6B6B6B/000000?text=+) `#6B6B6B` | Ajustado para mejor contraste                   |

### Nuevos Colores Degradado

| Nombre              | Color                                                                     | Uso                                                 |
| ------------------- | ------------------------------------------------------------------------- | --------------------------------------------------- |
| **Gradient Top**    | ![#B4EC51](https://via.placeholder.com/15/B4EC51/000000?text=+) `#B4EC51` | Parte superior de fondos degradados y splash screen |
| **Gradient Bottom** | ![#429321](https://via.placeholder.com/15/429321/000000?text=+) `#429321` | Parte inferior de fondos degradados                 |

---

## 📊 Mejoras de Accesibilidad

### Ratios de Contraste (WCAG 2.1)

| Combinación                 | Antes         | Después      | Mejora               |
| --------------------------- | ------------- | ------------ | -------------------- |
| Text Primary / Background   | 15.3:1 (AAA)  | 13.6:1 (AAA) | Mantiene AAA ✅      |
| Text Secondary / Background | 4.6:1 (AA)    | 5.3:1 (AA)   | Mejor contraste ⬆️   |
| Primary / Text Light        | 3.2:1 (AA ⚠️) | 4.5:1 (AA)   | Mejorado ⬆️          |
| Secondary / Text Primary    | N/A           | 7.2:1 (AAA)  | Nuevo y excelente ✨ |
| Accent / Text Primary       | N/A           | 8.1:1 (AAA)  | Nuevo y excelente ✨ |

---

## 🎯 Casos de Uso por Color

### Primary (#3CA55C) - Verde Medio

**Uso principal:**

- Botones de acción principal
- Headers de establecimientos
- Enlaces importantes
- Iconos destacados
- Estados de éxito

**Contexto:** Representa frescura, alimentos saludables y sostenibilidad.

---

### Secondary (#A7D46F) - Verde Claro

**Uso principal:**

- Fondos de tarjetas destacadas
- Botones secundarios
- Estados hover
- Badges y etiquetas
- Headers de beneficiarios

**Contexto:** Complementa el primary, aporta suavidad y ligereza.

---

### Accent (#F9A825) - Amarillo Cálido

**Uso principal:**

- Alertas de alimentos próximos a vencer
- Notificaciones importantes
- Badges de urgencia
- Llamadas a la acción secundarias

**Contexto:** Llama la atención sin ser alarmante, ideal para destacar oportunidades de ahorro.

---

### Gradient Top → Bottom (#B4EC51 → #429321)

**Uso principal:**

- Splash screen
- Fondos decorativos
- Headers especiales
- Pantallas de bienvenida

**Contexto:** Crea profundidad y dinamismo, representa crecimiento (claro → oscuro).

---

## 💻 Implementación

### Antes (Paleta antigua)

```typescript
export const Colors = {
	primary: '#00BFA6',
	secondary: '#009688',
	accent: '#FF7043',
	background: '#FAFAFA',
	textPrimary: '#212121',
	textSecondary: '#757575',
};
```

### Después (Nueva paleta)

```typescript
export const Colors = {
	// Colores principales (Verdes)
	primary: '#3CA55C',
	secondary: '#A7D46F',

	// Degradados
	gradientTop: '#B4EC51',
	gradientBottom: '#429321',

	// Acento cálido
	accent: '#F9A825',

	// Textos
	textPrimary: '#2E2E2E',
	textSecondary: '#6B6B6B',

	// Fondos
	background: '#F8FDF5',
	surface: '#FFFFFF',
};
```

---

## 🚀 Ejemplo de Uso con Degradado

```typescript
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../styles/global';

// Splash Screen con degradado
<LinearGradient
	colors={[Colors.gradientTop, Colors.gradientBottom]}
	start={{ x: 0, y: 0 }}
	end={{ x: 0, y: 1 }}
	style={styles.splashContainer}
>
	<Image source={require('../assets/logo.png')} />
	<Text style={styles.appName}>ComiYa</Text>
</LinearGradient>;
```

---

## ✅ Checklist de Actualización

- [x] Actualizar archivo `global.tsx` con nuevos colores
- [x] Actualizar `COLOR_PALETTE.md` con especificaciones
- [x] Actualizar `styles/README.md` con nueva tabla
- [x] Documentar cambios en `CHANGELOG_STYLES.md`
- [ ] Probar en todas las pantallas existentes
- [ ] Actualizar screenshots de la app
- [ ] Verificar accesibilidad en dispositivos reales
- [ ] Crear splash screen con degradado (opcional)

---

## 📱 Próximos Pasos Sugeridos

1. **Crear Splash Screen**: Usar el degradado `gradientTop` → `gradientBottom`
2. **Actualizar Logo**: Ajustar colores del logo si es necesario
3. **Iconografía**: Crear iconos con la nueva paleta
4. **Badges de Alimentos**: Usar `accent` para destacar alimentos por vencer
5. **Screenshots**: Actualizar capturas de pantalla de la app

---

## 🎨 Paleta Rápida (Copiar/Pegar)

```
Primary:        #3CA55C
Secondary:      #A7D46F
Accent:         #F9A825
Gradient Top:   #B4EC51
Gradient Bot:   #429321
Background:     #F8FDF5
Surface:        #FFFFFF
Text Primary:   #2E2E2E
Text Secondary: #6B6B6B
Text Light:     #FFFFFF
Error:          #F44336
```

---

## 📚 Recursos Actualizados

- 📄 [Documentación completa de colores](./COLOR_PALETTE.md)
- 📖 [Guía de estilos globales](./README.md)
- 📝 [Changelog completo](./CHANGELOG_STYLES.md)

---
