# Guía de Estilos Globales - ComiYa Mobile App

## 🎨 Paleta de Colores

Esta aplicación utiliza una paleta moderna con enfoque en sostenibilidad y alimentos.

### Colores Principales

| Color               | Hex       | Uso                                                         |
| ------------------- | --------- | ----------------------------------------------------------- |
| **Primary**         | `#3CA55C` | Color principal, botones, encabezados, elementos destacados |
| **Secondary**       | `#A7D46F` | Fondos de tarjetas, hover o íconos secundarios              |
| **Accent**          | `#F9A825` | Íconos de alerta, resaltado de alimentos próximos a vencer  |
| **Gradient Top**    | `#B4EC51` | Parte superior del fondo o splash screen                    |
| **Gradient Bottom** | `#429321` | Parte inferior del fondo o áreas de profundidad             |
| **Background**      | `#F8FDF5` | Fondo general de la aplicación                              |
| **Surface**         | `#FFFFFF` | Íconos, tarjetas, contraste con los verdes                  |
| **Text Primary**    | `#2E2E2E` | Texto general                                               |
| **Text Secondary**  | `#6B6B6B` | Descripciones o texto menos relevante                       |
| **Text Light**      | `#FFFFFF` | Texto sobre fondos oscuros                                  |

### Estados

- **Success**: `#3CA55C` - Operaciones exitosas (usa Primary)
- **Error**: `#F44336` - Errores y validaciones
- **Warning**: `#F9A825` - Advertencias (usa Accent)
- **Info**: `#2196F3` - Información general

---

## 📐 Sistema de Espaciado

Usamos un sistema consistente de espaciado:

```typescript
Spacing.xs   = 4px
Spacing.sm   = 8px
Spacing.md   = 16px  // Default
Spacing.lg   = 24px
Spacing.xl   = 32px
Spacing.xxl  = 48px
```

---

## 🔤 Tipografía

### Tamaños de Fuente

```typescript
FontSizes.xs   = 12px  // Textos muy pequeños
FontSizes.sm   = 14px  // Captions
FontSizes.md   = 16px  // Cuerpo de texto (default)
FontSizes.lg   = 18px  // Subtítulos
FontSizes.xl   = 24px  // Títulos de sección
FontSizes.xxl  = 32px  // Títulos principales
FontSizes.xxxl = 42px  // Títulos hero
```

### Pesos de Fuente

```typescript
FontWeights.regular = '400';
FontWeights.medium = '500';
FontWeights.semibold = '600';
FontWeights.bold = '700';
```

---

## 📦 Estilos Globales Pre-definidos

### Contenedores

```typescript
// Contenedor básico sin padding
GlobalStyles.container;

// Contenedor con padding
GlobalStyles.containerPadded;

// Scroll container
GlobalStyles.scrollContainer;
```

### Cards

```typescript
// Card estándar
GlobalStyles.card;

// Card compacto
GlobalStyles.cardCompact;
```

### Headers

```typescript
// Header con color primario
GlobalStyles.header;
GlobalStyles.headerTitle;
GlobalStyles.headerSubtitle;
```

### Textos

```typescript
GlobalStyles.title; // Títulos principales
GlobalStyles.subtitle; // Subtítulos
GlobalStyles.body; // Cuerpo de texto
GlobalStyles.caption; // Textos pequeños
```

### Formularios

```typescript
GlobalStyles.form;
GlobalStyles.inputGroup;
GlobalStyles.label;
GlobalStyles.input;
GlobalStyles.inputFocused;
GlobalStyles.inputError;
GlobalStyles.errorText;
```

### Botones

```typescript
// Botón primario (verde principal)
GlobalStyles.buttonPrimary;
GlobalStyles.buttonTextPrimary;

// Botón secundario (verde oscuro)
GlobalStyles.buttonSecondary;
GlobalStyles.buttonTextSecondary;

// Botón con acento (naranja)
GlobalStyles.buttonAccent;
GlobalStyles.buttonTextAccent;

// Botón outline
GlobalStyles.buttonOutline;
GlobalStyles.buttonTextOutline;

// Botón transparente
GlobalStyles.buttonText;
GlobalStyles.buttonTextGhost;

// Estado deshabilitado
GlobalStyles.buttonDisabled;
```

---

## 🚀 Cómo Usar los Estilos Globales

### Opción 1: Usar directamente los estilos globales

```typescript
import { View, Text, TouchableOpacity } from 'react-native';
import { GlobalStyles, Colors, Spacing } from '../styles/global';

export default function MyScreen() {
	return (
		<View style={GlobalStyles.container}>
			<Text style={GlobalStyles.title}>Mi Título</Text>
			<TouchableOpacity style={GlobalStyles.buttonPrimary}>
				<Text style={GlobalStyles.buttonTextPrimary}>Aceptar</Text>
			</TouchableOpacity>
		</View>
	);
}
```

### Opción 2: Extender estilos globales con estilos locales

```typescript
import { StyleSheet } from 'react-native';
import { GlobalStyles, Colors, Spacing } from './global';

export const styles = StyleSheet.create({
	container: {
		...GlobalStyles.container,
		// Añade personalizaciones específicas
	},
	customButton: {
		...GlobalStyles.buttonPrimary,
		width: '100%',
		marginTop: Spacing.lg,
	},
});
```

### Opción 3: Combinar múltiples estilos

```typescript
<View style={[GlobalStyles.card, GlobalStyles.mb_md]}>
	<Text style={GlobalStyles.title}>Título</Text>
	<Text style={GlobalStyles.caption}>Descripción</Text>
</View>
```

---

## 🎯 Ejemplos Prácticos

### Crear un Card con Información

```typescript
<View style={[GlobalStyles.card, GlobalStyles.mb_md]}>
	<Text style={GlobalStyles.subtitle}>Nombre del Restaurante</Text>
	<Text style={GlobalStyles.caption}>Calle 123 #45-67</Text>
	<View style={GlobalStyles.divider} />
	<TouchableOpacity style={GlobalStyles.buttonPrimary}>
		<Text style={GlobalStyles.buttonTextPrimary}>Ver Detalles</Text>
	</TouchableOpacity>
</View>
```

### Formulario Consistente

```typescript
<View style={GlobalStyles.form}>
	<View style={GlobalStyles.inputGroup}>
		<Text style={GlobalStyles.label}>Nombre *</Text>
		<TextInput style={GlobalStyles.input} placeholder="Ingresa tu nombre" />
	</View>

	<TouchableOpacity style={GlobalStyles.buttonPrimary}>
		<Text style={GlobalStyles.buttonTextPrimary}>Enviar</Text>
	</TouchableOpacity>
</View>
```

### Header Personalizado

```typescript
<View style={[GlobalStyles.header, { backgroundColor: Colors.secondary }]}>
	<Text style={GlobalStyles.headerTitle}>Mi Pantalla</Text>
	<Text style={GlobalStyles.headerSubtitle}>Descripción</Text>
</View>
```

---

## 📝 Buenas Prácticas

1. **Siempre usa los colores del sistema**: En lugar de hardcodear colores (`#00BFA6`), usa `Colors.primary`
2. **Usa el sistema de espaciado**: En lugar de valores arbitrarios (`padding: 17`), usa `padding: Spacing.md`
3. **Extiende, no reemplaces**: Usa `...GlobalStyles.button` y luego agrega personalizaciones
4. **Mantén la consistencia**: Si un botón es primario en una pantalla, debería serlo en toda la app
5. **Documenta variaciones**: Si necesitas un estilo único, documéntalo en el archivo de estilo local

---

## 🔄 Actualizar la Paleta

Si necesitas cambiar los colores en toda la app, solo modifica el archivo `global.tsx`:

```typescript
export const Colors = {
	primary: '#NUEVO_COLOR',
	// ...
};
```

Todos los componentes se actualizarán automáticamente.

---

## 📱 Estructura de Archivos de Estilos

```
styles/
├── global.tsx                                    // Estilos globales y constantes
├── HomeScreenStyle.tsx                           // Estilos específicos de Home
├── BeneficiaryRegistrationScreenStyle.tsx        // Estilos de Beneficiarios
├── EstablishmentRegistrationScreenStyle.tsx      // Estilos de Establecimientos
└── README.md                                     // Esta guía
```

---

## 💡 Tips

- Los estilos globales están optimizados para performance usando `StyleSheet.create()`
- Las sombras se adaptan automáticamente a iOS y Android usando `elevation`
- Los tamaños de fuente son escalables y se adaptan bien en diferentes dispositivos
- Usa `GlobalStyles.mb_md`, `GlobalStyles.mt_lg`, etc. para espaciado rápido

---

¿Preguntas? Consulta el archivo `global.tsx` para ver todas las constantes disponibles.
