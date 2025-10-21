# Componentes Reutilizables - ComiYa

Esta carpeta contiene componentes reutilizables que usan los estilos globales de la aplicación.

## 📦 Componentes Disponibles

### Button

Botón reutilizable con múltiples variantes y estado de carga.

**Props:**

- `title`: Texto del botón
- `onPress`: Función a ejecutar al presionar
- `variant`: 'primary' | 'secondary' | 'accent' | 'outline' | 'text' (default: 'primary')
- `disabled`: Deshabilitar el botón (default: false)
- `loading`: Mostrar indicador de carga (default: false)
- `fullWidth`: Ocupar todo el ancho (default: false)
- `style`: Estilos adicionales

**Ejemplo:**

```tsx
import { Button } from '../components';

<Button title="Enviar" onPress={handleSubmit} variant="primary" loading={isLoading} />;
```

### Card

Contenedor con sombra y bordes redondeados.

**Props:**

- `children`: Contenido del card
- `compact`: Usar versión compacta (default: false)
- `style`: Estilos adicionales

**Ejemplo:**

```tsx
import { Card } from '../components';

<Card>
	<Text>Contenido del card</Text>
</Card>;
```

### Input

Campo de entrada con label, validación y estados.

**Props:**

- `label`: Etiqueta del input
- `error`: Mensaje de error (opcional)
- `required`: Mostrar asterisco de requerido (default: false)
- `...TextInputProps`: Todas las props de TextInput de React Native

**Ejemplo:**

```tsx
import { Input } from '../components';

<Input
	label="Correo electrónico"
	placeholder="ejemplo@correo.com"
	value={email}
	onChangeText={setEmail}
	error={emailError}
	required
	keyboardType="email-address"
/>;
```

## 🚀 Usar Componentes

### Importar individualmente

```tsx
import Button from '../components/Button';
import Card from '../components/Card';
```

### Importar desde el index

```tsx
import { Button, Card, Input } from '../components';
```

## 💡 Crear Nuevos Componentes

Al crear nuevos componentes:

1. Usa los estilos globales de `../styles/global`
2. Sigue el patrón de props tipado con TypeScript
3. Exporta el componente en `index.ts`
4. Documenta las props en este README

**Ejemplo de nuevo componente:**

```tsx
import React from 'react';
import { View, Text } from 'react-native';
import { GlobalStyles } from '../styles/global';

interface MyComponentProps {
	title: string;
}

export default function MyComponent({ title }: MyComponentProps) {
	return (
		<View style={GlobalStyles.card}>
			<Text style={GlobalStyles.title}>{title}</Text>
		</View>
	);
}
```
