# Aliado AI - WhatsApp Backend

Backend server para integración real con WhatsApp Business API.

## 🚀 Instalación Rápida

1. **Instalar dependencias:**
```bash
cd backend
npm install
```

2. **Configurar variables de entorno:**
   - Copiar `.env.example` a `.env`
   - Obtener tokens de Meta Business (ver sección Meta Setup)

3. **Ejecutar servidor:**
```bash
npm run dev  # Desarrollo con auto-reload
npm start   # Producción
```

## 📱 Meta WhatsApp Business Setup

### Paso 1: Crear App en Meta
1. Ir a [Meta for Developers](https://developers.facebook.com/)
2. Crear nueva app → Business → WhatsApp
3. Obtener `Access Token` y `Phone Number ID`

### Paso 2: Configurar Webhook
1. En Meta Business, ir a WhatsApp → Configuration
2. Webhook URL: `tu-dominio.com/api/whatsapp/webhook/TU-BOT-ID`
3. Verify Token: `aliado_webhook_verify_token_2024`
4. Suscribirse a `messages` events

### Paso 3: Exponer servidor local (desarrollo)
```bash
# Instalar ngrok
npm install -g ngrok

# Exponer puerto local
ngrok http 3001

# Usar la URL https de ngrok en Meta
https://abc123.ngrok.io/api/whatsapp/webhook/TU-BOT-ID
```

## 🔧 API Endpoints

### Webhooks
- `GET/POST /api/whatsapp/webhook/:botId` - Webhook para bot específico

### Bot Management  
- `POST /api/bots/:botId/config` - Guardar configuración de bot
- `GET /api/bots/:botId/config` - Obtener configuración de bot
- `GET /api/bots` - Listar todos los bots

### Testing
- `POST /api/test/send` - Enviar mensaje de prueba
- `GET /health` - Health check

## 📝 Variables de Entorno (.env)

```env
# Gemini AI
GEMINI_API_KEY=tu-gemini-api-key

# Meta WhatsApp Business
WHATSAPP_ACCESS_TOKEN=tu-token-de-acceso-meta
WHATSAPP_PHONE_NUMBER_ID=tu-phone-number-id
WHATSAPP_VERIFY_TOKEN=aliado_webhook_verify_token_2024

# Server
PORT=3001
WEBHOOK_BASE_URL=https://tu-servidor.ngrok.io

# Frontend
FRONTEND_URL=http://localhost:3000
```

## 🧪 Testing

### Probar webhook validation
```bash
curl "http://localhost:3001/api/whatsapp/webhook/test-bot?hub.mode=subscribe&hub.verify_token=aliado_webhook_verify_token_2024&hub.challenge=CHALLENGE_ACCEPTED"
```

### Enviar mensaje de prueba
```bash
curl -X POST http://localhost:3001/api/test/send \
  -H "Content-Type: application/json" \
  -d '{"to":"5491234567890","message":"Hola desde Aliado AI!"}'
```

## 🔄 Flujo de Integración

1. **Usuario envía WhatsApp** → Meta recibe mensaje
2. **Meta envía webhook** → Tu servidor (`/api/whatsapp/webhook/botId`)
3. **Servidor procesa** → Gemini genera respuesta
4. **Servidor responde** → Meta envía respuesta a usuario
5. **Usuario recibe** → Respuesta automática del bot

## 🚨 Troubleshooting

### Error de verificación de webhook
- Verificar que `WHATSAPP_VERIFY_TOKEN` coincida en .env y Meta
- URL debe ser accesible públicamente (usar ngrok para desarrollo)

### Mensajes no llegan
- Verificar `WHATSAPP_ACCESS_TOKEN` válido
- Confirmar `PHONE_NUMBER_ID` correcto
- Revisar logs del servidor para errores

### Bot no responde
- Verificar `GEMINI_API_KEY` funcional
- Revisar configuración del bot está guardada
- Confirmar webhook recibe mensajes (check logs)

## 📚 Documentación

- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)
- [Meta Webhooks](https://developers.facebook.com/docs/graph-api/webhooks)
- [Gemini AI](https://ai.google.dev/)

## 🛡️ Seguridad

- Nunca commitear archivos `.env`
- Usar HTTPS en producción
- Validar todos los webhooks entrantes
- Implementar rate limiting para producción