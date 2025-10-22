# Configuración para Despliegue en Vercel

## Problema Resuelto

El frontend estaba configurado para usar `http://localhost:8000` como URL del backend, lo cual no funciona cuando la aplicación está desplegada en Vercel.

## Solución Implementada

1. **Servicio de Configuración**: Se creó `ConfigService` que detecta automáticamente si la aplicación está en producción o desarrollo.

2. **URLs Dinámicas**: Todos los servicios ahora usan URLs dinámicas basadas en el entorno:
   - **Desarrollo**: `http://localhost:8000`
   - **Producción**: `https://tu-backend-url.com` (debes cambiar esta URL)

## Configuración Requerida

### 1. Cambiar la URL del Backend

En el archivo `src/app/services/config.service.ts`, línea 13, cambia:

```typescript
return 'https://tu-backend-url.com'; // ⚠️ CAMBIA ESTA URL POR LA REAL
```

Por la URL real de tu backend en producción, por ejemplo:

```typescript
return 'https://mi-backend.herokuapp.com';
// o
return 'https://api.mi-dominio.com';
// o cualquier otra URL donde esté desplegado tu backend
```

### 2. Configurar CORS en tu Backend

Asegúrate de que tu backend tenga configurado CORS para permitir peticiones desde tu dominio de Vercel:

```python
# Ejemplo para FastAPI
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://tu-frontend.vercel.app",  # Tu dominio de Vercel
        "http://localhost:4200"  # Para desarrollo local
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 3. Variables de Entorno (Opcional)

Si quieres usar variables de entorno en Vercel, puedes configurar:

1. En el dashboard de Vercel, ve a tu proyecto
2. Ve a Settings > Environment Variables
3. Agrega una variable llamada `API_URL` con la URL de tu backend
4. Luego modifica `config.service.ts` para usar esta variable:

```typescript
get apiUrl(): string {
  if (this.isProduction) {
    // Usar variable de entorno si está disponible
    const envUrl = globalThis.process?.env?.['API_URL'];
    return envUrl || 'https://tu-backend-url.com';
  } else {
    return 'http://localhost:8000';
  }
}
```

## Servicios Actualizados

Los siguientes servicios fueron actualizados para usar URLs dinámicas:

- ✅ `LoginService`
- ✅ `OrdenService`
- ✅ `UserDataService`
- ✅ `ActionsService`
- ✅ `ContractService`
- ✅ `PortfolioService`
- ✅ `CompaniesService`

## Próximos Pasos

1. **Cambia la URL del backend** en `config.service.ts`
2. **Verifica la configuración CORS** en tu backend
3. **Redespliega** tu aplicación en Vercel
4. **Prueba** que las peticiones funcionen correctamente

## Verificación

Después de hacer los cambios, puedes verificar que funciona:

1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña Network
3. Intenta hacer login
4. Verifica que las peticiones van a la URL correcta de tu backend
5. No deberías ver más errores `ERR_BLOCKED_BY_CLIENT` o `status: 0`
