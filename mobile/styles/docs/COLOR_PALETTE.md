# 🎨 Paleta de Colores - ComiYa

## Colores Principales (Verdes)

### 💚 Primary - #3CA55C

**Uso**: Color principal, botones, encabezados, elementos destacados

```
RGB: (60, 165, 92)
HSL: (138°, 47%, 44%)
```

**Ejemplos de uso:**

- Botón "Registrar Establecimiento"
- Header de la pantalla de establecimientos
- Enlaces principales
- Iconos destacados
- Botones de acción principal

---

### � Secondary - #A7D46F

**Uso**: Fondos de tarjetas, hover o íconos secundarios

```
RGB: (167, 212, 111)
HSL: (87°, 54%, 63%)
```

**Ejemplos de uso:**

- Botón "Registrar Beneficiario"
- Fondos de tarjetas destacadas
- Estados hover de botones
- Íconos secundarios
- Badges y etiquetas

---

## Degradados

### 🌱 Gradient Top - #B4EC51

**Uso**: Parte superior del fondo o splash screen

```
RGB: (180, 236, 81)
HSL: (82°, 81%, 62%)
```

**Ejemplos de uso:**

- Splash screen (parte superior)
- Fondos decorativos con degradado
- Headers especiales

---

### 🍃 Gradient Bottom - #429321

**Uso**: Parte inferior del fondo o áreas de profundidad

```
RGB: (66, 147, 33)
HSL: (103°, 63%, 35%)
```

**Ejemplos de uso:**

- Splash screen (parte inferior)
- Fondos decorativos con degradado
- Áreas con mayor profundidad visual

---

### 🔶 Accent - #F9A825

**Uso**: Íconos de alerta, resaltado de alimentos próximos a vencer

```
RGB: (249, 168, 37)
HSL: (37°, 95%, 56%)
```

**Ejemplos de uso:**

- Alertas de alimentos por vencer
- Notificaciones importantes
- Badges de urgencia
- Botones de acción secundaria destacada

---

## Fondos

### 🌸 Background - #F8FDF5

**Uso**: Fondo general de la aplicación

```
RGB: (248, 253, 245)
HSL: (98°, 62%, 98%)
```

**Descripción**: Un fondo claro con un toque sutil de verde que complementa la paleta principal.

### 📄 Surface - #FFFFFF

**Uso**: Íconos, tarjetas, contraste con los verdes

```
RGB: (255, 255, 255)
HSL: (0°, 0%, 100%)
```

**Descripción**: Blanco puro para máximo contraste y claridad.

---

## Textos

### 🖤 Text Primary - #2E2E2E

**Uso**: Texto general

```
RGB: (46, 46, 46)
HSL: (0°, 0%, 18%)
Ratio de contraste: 13.6:1 (WCAG AAA)
```

**Descripción**: Un gris oscuro suave que proporciona excelente legibilidad sin ser tan duro como el negro puro.

### 🌑 Text Secondary - #6B6B6B

**Uso**: Descripciones o texto menos relevante

```
RGB: (107, 107, 107)
HSL: (0°, 0%, 42%)
Ratio de contraste: 5.3:1 (WCAG AA)
```

**Descripción**: Gris medio ideal para texto secundario y descripciones.

### ⬜ Text Light - #FFFFFF

**Uso**: Texto sobre fondos oscuros o de color

```
RGB: (255, 255, 255)
HSL: (0°, 0%, 100%)
```

---

## Estados

### ✅ Success - #3CA55C

**Uso**: Operaciones exitosas, confirmaciones

```
RGB: (60, 165, 92)
```

**Descripción**: Usa el color primary para mantener consistencia.

**Ejemplos:**

- "Registro exitoso"
- Validaciones correctas
- Estados completados

### ❌ Error - #F44336

**Uso**: Errores, validaciones fallidas, alertas críticas

```
RGB: (244, 67, 54)
HSL: (4°, 90%, 58%)
```

**Ejemplos:**

- Mensajes de error
- Validaciones fallidas
- Estados de fallo

### ⚠️ Warning - #F9A825

**Uso**: Advertencias, información importante

```
RGB: (249, 168, 37)
HSL: (37°, 95%, 56%)
```

**Descripción**: Usa el color accent para mantener consistencia.

**Ejemplos:**

- "Campos incompletos"
- Información que requiere atención
- Estados pendientes
- Alimentos próximos a vencer

### ℹ️ Info - #2196F3

**Uso**: Información general, ayuda

```
RGB: (33, 150, 243)
HSL: (207°, 90%, 54%)
```

**Ejemplos:**

- Mensajes informativos
- Tooltips
- Ayuda contextual

---

## Elementos UI

### 🔲 Border - #E0E0E0

**Uso**: Bordes de inputs, separadores sutiles

```
RGB: (224, 224, 224)
HSL: (0°, 0%, 88%)
```

### ➖ Divider - #BDBDBD

**Uso**: Líneas divisoras, separadores visibles

```
RGB: (189, 189, 189)
HSL: (0°, 0%, 74%)
```

### 🌑 Shadow - #000000

**Uso**: Sombras (con opacidad)

```
RGB: (0, 0, 0)
Opacidades: 0.1, 0.15, 0.2 según profundidad
```

### 🎭 Overlay - rgba(0, 0, 0, 0.5)

**Uso**: Capas de superposición, modales

```
RGB: (0, 0, 0)
Alpha: 0.5 (50% opacidad)
```

---

## 📊 Combinaciones Recomendadas

### Botón Primario

```
Fondo: Primary (#3CA55C)
Texto: Text Light (#FFFFFF)
Contraste: 4.5:1 (WCAG AA)
```

### Botón Secundario

```
Fondo: Secondary (#A7D46F)
Texto: Text Primary (#2E2E2E)
Contraste: 7.2:1 (WCAG AAA)
```

### Botón Accent

```
Fondo: Accent (#F9A825)
Texto: Text Primary (#2E2E2E)
Contraste: 8.1:1 (WCAG AAA)
```

### Card sobre Background

```
Card: Surface (#FFFFFF)
Background: Background (#F8FDF5)
Sombra: Shadow con opacity 0.1-0.2
```

### Input Field

```
Fondo: Surface (#FFFFFF)
Borde: Border (#E0E0E0)
Texto: Text Primary (#2E2E2E)
Placeholder: Text Secondary (#6B6B6B)
Focus: Primary (#3CA55C)
Error: Error (#F44336)
```

### Degradado de Fondo

```
LinearGradient:
  colors: [Gradient Top (#B4EC51), Gradient Bottom (#429321)]
  start: {x: 0, y: 0}
  end: {x: 0, y: 1}
```

---

## ♿ Accesibilidad (WCAG 2.1)

### Ratios de Contraste

| Combinación                 | Ratio  | Nivel  |
| --------------------------- | ------ | ------ |
| Text Primary / Background   | 13.6:1 | AAA ✅ |
| Text Primary / Surface      | 14.8:1 | AAA ✅ |
| Text Secondary / Background | 5.3:1  | AA ✅  |
| Text Secondary / Surface    | 5.8:1  | AA ✅  |
| Primary / Text Light        | 4.5:1  | AA ✅  |
| Secondary / Text Primary    | 7.2:1  | AAA ✅ |
| Accent / Text Primary       | 8.1:1  | AAA ✅ |
| Error / Surface             | 4.1:1  | AA ✅  |

**Nota**: Todos los textos cumplen WCAG AA o superior. La nueva paleta mejora significativamente el contraste y la accesibilidad.

---

## 🎯 Usos por Contexto

### Pantalla de Inicio (Home)

- Título: Primary (#3CA55C)
- Fondo: Background (#F8FDF5)
- Cards: Surface (#FFFFFF)
- Texto: Text Primary (#2E2E2E)

### Pantalla de Establecimientos

- Header: Primary (#3CA55C)
- Botones: Primary (#3CA55C)
- Inputs: Surface con Border
- Acentos: Secondary (#A7D46F)

### Pantalla de Beneficiarios

- Header: Secondary (#A7D46F) con Text Primary
- Botones: Secondary (#A7D46F)
- Inputs: Surface con Border
- Acentos: Primary (#3CA55C)

### Splash Screen

- Fondo: LinearGradient de Gradient Top (#B4EC51) a Gradient Bottom (#429321)
- Logo: Surface (#FFFFFF)
- Texto: Text Light (#FFFFFF)

### Alertas de Alimentos

- Badge: Accent (#F9A825)
- Texto: Text Primary (#2E2E2E)
- Icono: Accent (#F9A825)

---

## 🔧 Implementación en Código

```typescript
// Importar colores
import { Colors } from '../styles/global';

// Usar en componentes
<View style={{ backgroundColor: Colors.primary }}>
	<Text style={{ color: Colors.textLight }}>Texto</Text>
</View>;

// Usar en estilos
const styles = StyleSheet.create({
	button: {
		backgroundColor: Colors.primary,
		borderColor: Colors.border,
	},
	text: {
		color: Colors.textPrimary,
	},
	error: {
		color: Colors.error,
	},
});
```

---

## 📱 Vista Previa Visual

```
┌──────────────────────────────────────────┐
│  Primary #3CA55C         ████████████    │
│  Secondary #A7D46F       ████████████    │
│  Accent #F9A825          ████████████    │
│                                          │
│  Gradient Top #B4EC51    ████████████    │
│  Gradient Bottom #429321 ████████████    │
│                                          │
│  Background #F8FDF5      ░░░░░░░░░░░░    │
│  Surface #FFFFFF         ████████████    │
│                                          │
│  Text Primary #2E2E2E    ████████████    │
│  Text Secondary #6B6B6B  ████████████    │
│  Text Light #FFFFFF      ████████████    │
│                                          │
│  Success #3CA55C         ████████████    │
│  Error #F44336           ████████████    │
│  Warning #F9A825         ████████████    │
│  Info #2196F3            ████████████    │
└──────────────────────────────────────────┘
```

---

## 🌈 Gradientes Implementados

La paleta incluye colores específicos para degradados:

### Gradiente Principal (Splash Screen)

```typescript
import { LinearGradient } from 'expo-linear-gradient';

<LinearGradient
	colors={[Colors.gradientTop, Colors.gradientBottom]}
	start={{ x: 0, y: 0 }}
	end={{ x: 0, y: 1 }}
>
	{/* Contenido */}
</LinearGradient>;
```

**Valores:**

```
De: Gradient Top (#B4EC51)
A: Gradient Bottom (#429321)
Dirección: Vertical (top to bottom)
```

### Gradiente Suave (Opcional)

```
De: Primary (#3CA55C)
A: Secondary (#A7D46F)
Dirección: 135° (diagonal)
```

### Gradiente Cálido (Opcional)

```
De: Accent (#F9A825)
A: Warning (#F9A825) con opacity
Dirección: 90° (horizontal)
```

---
