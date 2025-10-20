# Guía de Migración a Estilos Globales

Este documento explica cómo migrar pantallas existentes para usar el nuevo sistema de estilos globales.

## 📝 Ejemplo: Migración Completada

### ❌ Antes (Estilos hardcodeados)

```tsx
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5', // ❌ Color hardcodeado
		padding: 20, // ❌ Padding arbitrario
	},
	title: {
		fontSize: 28, // ❌ Tamaño inconsistente
		fontWeight: 'bold',
		color: '#333',
		marginBottom: 5, // ❌ Espaciado inconsistente
	},
	button: {
		backgroundColor: '#2e7d32', // ❌ Color diferente al resto
		padding: 18,
		borderRadius: 8,
		alignItems: 'center',
		shadowColor: '#000', // ❌ Sombras hardcodeadas
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.15,
		shadowRadius: 4,
		elevation: 4,
	},
});
```

### ✅ Después (Estilos globales)

```tsx
import { StyleSheet } from 'react-native';
import { Colors, Spacing, GlobalStyles } from './global';

export const styles = StyleSheet.create({
	container: {
		...GlobalStyles.containerPadded, // ✅ Usa estilo global
	},
	title: {
		...GlobalStyles.headerTitle, // ✅ Usa estilo global
	},
	button: {
		...GlobalStyles.buttonPrimary, // ✅ Usa estilo global
	},
});
```

## 🔄 Pasos de Migración

### 1. Importar las constantes globales

```tsx
import { Colors, Spacing, FontSizes, FontWeights, GlobalStyles } from '../styles/global';
```

### 2. Identificar patrones comunes

| Patrón Antiguo               | Usar Global                          |
| ---------------------------- | ------------------------------------ |
| `backgroundColor: '#f5f5f5'` | `backgroundColor: Colors.background` |
| `backgroundColor: 'white'`   | `backgroundColor: Colors.surface`    |
| `color: '#333'`              | `color: Colors.textPrimary`          |
| `color: '#666'`              | `color: Colors.textSecondary`        |
| `padding: 20`                | `padding: Spacing.md`                |
| `fontSize: 16`               | `fontSize: FontSizes.md`             |
| `fontWeight: '600'`          | `fontWeight: FontWeights.semibold`   |

### 3. Reemplazar estilos de contenedor

**Antes:**

```tsx
container: {
  flex: 1,
  backgroundColor: '#f5f5f5',
},
```

**Después:**

```tsx
container: {
  ...GlobalStyles.container,
},
```

### 4. Reemplazar estilos de formulario

**Antes:**

```tsx
form: {
  padding: 20,
  maxWidth: 500,
  width: '100%',
  alignSelf: 'center',
},
inputGroup: {
  marginBottom: 20,
},
label: {
  fontSize: 16,
  fontWeight: '600',
  color: '#333',
  marginBottom: 8,
},
input: {
  backgroundColor: 'white',
  padding: 15,
  borderRadius: 8,
  fontSize: 16,
  borderWidth: 1,
  borderColor: '#ddd',
},
```

**Después:**

```tsx
form: {
  ...GlobalStyles.form,
},
inputGroup: {
  ...GlobalStyles.inputGroup,
},
label: {
  ...GlobalStyles.label,
},
input: {
  ...GlobalStyles.input,
},
```

### 5. Reemplazar estilos de botones

**Antes:**

```tsx
submitButton: {
  backgroundColor: '#2e7d32',
  padding: 18,
  borderRadius: 8,
  alignItems: 'center',
  marginTop: 10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 4,
  elevation: 4,
},
submitButtonText: {
  color: 'white',
  fontSize: 18,
  fontWeight: '600',
},
```

**Después:**

```tsx
submitButton: {
  ...GlobalStyles.buttonPrimary,
  marginTop: Spacing.sm,  // Mantén solo personalizaciones únicas
},
submitButtonText: {
  ...GlobalStyles.buttonTextPrimary,
},
```

### 6. Reemplazar headers personalizados

**Antes:**

```tsx
header: {
  backgroundColor: '#2e7d32',
  padding: 30,
  paddingTop: 60,
},
title: {
  fontSize: 28,
  fontWeight: 'bold',
  color: 'white',
  marginBottom: 5,
},
subtitle: {
  fontSize: 16,
  color: '#e8f5e9',
},
```

**Después:**

```tsx
header: {
  ...GlobalStyles.header,
  backgroundColor: Colors.primary,  // Personaliza solo el color
},
title: {
  ...GlobalStyles.headerTitle,
},
subtitle: {
  ...GlobalStyles.headerSubtitle,
},
```

## 🎯 Beneficios de la Migración

### ✅ Consistencia Visual

Todos los botones, inputs y textos se ven iguales en toda la app.

### ✅ Mantenimiento Fácil

Cambiar un color o tamaño en un solo lugar actualiza toda la app.

### ✅ Menos Código

Reduce duplicación y facilita lectura del código.

### ✅ Mejor Performance

Los estilos globales se crean una vez y se reutilizan.

### ✅ Escalabilidad

Agregar nuevas pantallas es más rápido usando componentes pre-existentes.

## 📋 Checklist de Migración

Al migrar una pantalla, verifica:

- [ ] Importar constantes globales (`Colors`, `Spacing`, `GlobalStyles`)
- [ ] Reemplazar colores hardcodeados por `Colors.*`
- [ ] Reemplazar espaciado por `Spacing.*`
- [ ] Reemplazar tamaños de fuente por `FontSizes.*`
- [ ] Usar `GlobalStyles.*` para patrones comunes
- [ ] Mantener solo estilos únicos específicos de la pantalla
- [ ] Probar en dispositivo/emulador
- [ ] Verificar que no hay errores de lint

## 🆘 Problemas Comunes

### "No puedo encontrar el estilo que necesito"

Si necesitas un estilo que no existe en `GlobalStyles`, tienes dos opciones:

1. **Agrégalo al archivo `global.tsx`** si es un patrón que se repetirá en múltiples pantallas
2. **Defínelo localmente** si es específico de una sola pantalla

### "Mi diseño se ve diferente después de migrar"

Compara los valores antes y después:

- Verifica que los colores coincidan
- Revisa el espaciado (pueden haber diferencias de 1-2px)
- Asegúrate de incluir personalizaciones únicas después del spread (`...`)

### "Necesito combinar múltiples estilos"

Usa array de estilos:

```tsx
<View style={[GlobalStyles.card, GlobalStyles.mb_md, styles.customCard]}>
```

## 💡 Tips Pro

1. **Usa los helpers de espaciado**: `GlobalStyles.mb_md`, `GlobalStyles.mt_lg`, etc.
2. **Combina estilos globales con personalizaciones**:
   ```tsx
   button: {
     ...GlobalStyles.buttonPrimary,
     width: '100%',  // Personalización específica
   }
   ```
3. **Importa solo lo que necesitas**:
   ```tsx
   import { Colors, Spacing } from '../styles/global';
   ```
4. **Usa constantes en lugar de valores mágicos**:

   ```tsx
   // ❌ No hagas esto
   padding: 16,

   // ✅ Haz esto
   padding: Spacing.md,
   ```

## 📚 Recursos

- [Guía de Estilos](./styles/README.md)
- [Componentes Reutilizables](./components/README.md)
- [Ejemplo de Pantalla Migrada](./screens/HomeScreen.tsx)

---

¿Dudas sobre la migración? Revisa los ejemplos en las pantallas ya migradas:

- `HomeScreen.tsx`
- `EstablishmentRegistrationScreen.tsx`
- `BeneficiaryRegistrationScreen.tsx`
