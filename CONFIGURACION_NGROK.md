# Configuración para Backend Local con Frontend en Vercel

## Problema
Tu frontend está desplegado en Vercel pero tu backend corre localmente en `http://localhost:8000`. Los navegadores no pueden acceder a `localhost` desde internet.

## Solución: Usar ngrok

Ngrok crea un túnel seguro que expone tu servidor local a internet.

### Paso 1: Instalar ngrok

```bash
# Opción 1: Con npm (recomendado)
npm install -g ngrok

# Opción 2: Descargar desde https://ngrok.com/download
```

### Paso 2: Crear cuenta en ngrok (gratis)

1. Ve a https://ngrok.com
2. Regístrate gratis
3. Obtén tu authtoken desde el dashboard

### Paso 3: Configurar ngrok

```bash
# Configurar tu authtoken (solo la primera vez)
ngrok config add-authtoken TU_AUTHTOKEN_AQUI

# Exponer tu backend local
ngrok http 8000
```

### Paso 4: Obtener la URL de ngrok

Después de ejecutar `ngrok http 8000`, verás algo como:

```
Session Status                online
Account                       tu-email@ejemplo.com
Version                       3.x.x
Region                        United States (us)
Latency                       45ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123def456.ngrok.io -> http://localhost:8000
Forwarding                    http://abc123def456.ngrok.io -> http://localhost:8000
```

**Copia la URL HTTPS** (ej: `https://abc123def456.ngrok.io`)

### Paso 5: Actualizar tu frontend

En el archivo `src/app/services/config.service.ts`, línea 15, cambia:

```typescript
return 'https://tu-url-ngrok.ngrok.io'; // ⚠️ CAMBIA ESTA URL POR TU URL DE NGROK
```

Por tu URL real de ngrok:

```typescript
return 'https://abc123def456.ngrok.io'; // Tu URL real de ngrok
```

### Paso 6: Configurar CORS en tu backend

Asegúrate de que tu backend permita peticiones desde tu dominio de Vercel:

```python
# Ejemplo para FastAPI
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://tu-frontend.vercel.app",  # Tu dominio de Vercel
        "http://localhost:4200",           # Para desarrollo local
        "https://abc123def456.ngrok.io"    # Tu URL de ngrok
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Paso 7: Redesplegar en Vercel

1. Haz commit de tus cambios
2. Push a tu repositorio
3. Vercel redesplegará automáticamente

## Flujo de Trabajo Diario

1. **Inicia tu backend local**: `python main.py` (o como inicies tu backend)
2. **Inicia ngrok**: `ngrok http 8000`
3. **Copia la nueva URL de ngrok** (cambia cada vez que reinicias ngrok)
4. **Actualiza la URL en config.service.ts**
5. **Redespliega en Vercel** (opcional, solo si cambió la URL)

## Alternativas a ngrok

### Opción 2: Usar localtunnel
```bash
npm install -g localtunnel
lt --port 8000
```

### Opción 3: Usar serveo
```bash
ssh -R 80:localhost:8000 serveo.net
```

## Notas Importantes

- ⚠️ **La URL de ngrok cambia cada vez que lo reinicias** (a menos que tengas cuenta de pago)
- 🔒 **ngrok es seguro** - usa HTTPS automáticamente
- 💰 **Cuenta gratuita** tiene límites pero es suficiente para desarrollo
- 🚀 **Para producción** considera desplegar tu backend en un servicio como Heroku, Railway, o Render

## Verificación

Después de configurar todo:

1. Abre tu frontend en Vercel
2. Abre las herramientas de desarrollador (F12)
3. Ve a la pestaña Network
4. Intenta hacer login
5. Verifica que las peticiones van a tu URL de ngrok
6. No deberías ver errores `ERR_BLOCKED_BY_CLIENT`
