# Integración de API Backend — ESG Gestión Empresarial

## Estructura de Servicios

La aplicación incluye una arquitectura organizada para la comunicación con el backend:

### 📁 `src/services/api/`

#### `apiConfig.ts`

- **Configuración base** para todas las llamadas a la API
- **Cliente HTTP** reutilizable con manejo automático de tokens
- **Tipos de respuesta** estándar de la API
- **URL base**: Configurada en `apiConfig.ts` según el entorno

#### `authService.ts`

- **Servicio de autenticación** completo
- **Manejo de tokens JWT** con localStorage
- **Decodificación y validación** de tokens
- **Gestión de permisos** por roles

#### `index.ts`

- **Punto de entrada** para todos los servicios de API
- **Exportación centralizada** de tipos y servicios

## 🔐 Autenticación

### Login

```typescript
import { authService } from '@/services/api'

const response = await authService.login({
  email: 'user@example.com',
  password: 'password123',
})
```

### Verificación de Estado

```typescript
// Verificar si está autenticado
const isAuth = authService.isAuthenticated()

// Obtener usuario actual
const user = authService.getCurrentUser()

// Verificar roles
const isAdmin = authService.isAdmin()
const role = authService.getUserRole()
```

### Logout

```typescript
authService.logout() // Limpia token y datos del usuario
```

## 🛡️ Protección de Rutas

Las rutas incluyen guards de autenticación:

```typescript
// Ruta protegida (requiere autenticación)
{
  path: '/admin',
  meta: {
    requiresAuth: true,
    requiredRole: 'admin'
  }
}

// Ruta de invitado (solo no autenticados)
{
  path: '/login',
  meta: {
    requiresGuest: true
  }
}
```

## 📱 Composable de Autenticación

### `useAuth()` - Hook reactivo para autenticación

```typescript
import { useAuth } from '@/composables/useAuth'

const { isAuthenticated, currentUser, isAdmin, userRole, userName, login, logout, initAuth } =
  useAuth()
```

## 🗄️ Almacenamiento

- **Token JWT**: Guardado en `localStorage` como `authToken`
- **Información del usuario**: Guardada en `localStorage` como `userInfo`
- **Persistencia**: Los datos persisten entre sesiones del navegador

## 🔧 Migración desde Mock

### Cambios Realizados:

1. **Eliminado código mock** de `utils/auth.ts`
2. **Integración real** con el backend en `Login.vue`
3. **Actualización de guards** en el router
4. **Gestión reactiva** del estado de autenticación en `App.vue`

### Compatibilidad:

- Las funciones existentes en `utils/auth.ts` mantienen la misma interfaz
- El código existente sigue funcionando sin cambios
- Migración transparente desde autenticación mock a real

## 🚀 Próximos Pasos

Para extender la integración del backend:

1. **Crear servicios adicionales** en `src/services/api/`
2. **Implementar llamadas CRUD** para entidades del dominio ESG
3. **Añadir manejo de errores** global
4. **Implementar refresh de tokens** automático
5. **Añadir interceptors** para manejo de respuestas

## 📋 Ejemplo de Uso Completo

```typescript
// En un componente Vue
<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';
import { onMounted } from 'vue';

const { isAuthenticated, currentUser, login, logout, initAuth } = useAuth();

onMounted(() => {
  initAuth(); // Inicializar estado de autenticación
});

const handleLogin = async () => {
  const result = await login({
    email: 'user@example.com',
    password: 'password123'
  });

  if (result.success) {
    console.log('Login exitoso:', currentUser.value);
  } else {
    console.error('Error:', result.message);
  }
};
</script>
```
