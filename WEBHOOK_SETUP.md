# 🤖 Configuración del Webhook de Meta WhatsApp Business API

## ✅ Estado Actual

Ya tienes configurado todo lo necesario en el código:
- ✅ Endpoints de webhook implementados
- ✅ Verificación de webhook de Meta lista
- ✅ Procesamiento automático de mensajes con IA
- ✅ Respuestas automáticas vía WhatsApp API

## 🎯 Pasos para completar la configuración

### 1. Desplegar el Backend a Azure App Service

```bash
# En el directorio backend
cd C:\Repositorios\Aliado-AI\backend

# Instalar Azure CLI si no lo tienes
# https://learn.microsoft.com/en-us/cli/azure/install-azure-cli

# Login a Azure
az login

# Crear el App Service
az webapp create --name aliado-ai-backend --resource-group aliadoai-rg --plan aliado-plan --runtime "DOTNET:9.0"

# Configurar las variables de entorno
az webapp config appsettings set --name aliado-ai-backend --resource-group aliadoai-rg --settings \
    "WhatsApp__AccessToken=TU_ACCESS_TOKEN_DE_WHATSAPP" \
    "WhatsApp__PhoneNumberId=TU_PHONE_NUMBER_ID" \
    "WhatsApp__VerifyToken=aliado_webhook_verify_token_2024" \
    "Gemini__ApiKey=TU_GEMINI_API_KEY" \
    "Azure__Storage__ConnectionString=TU_AZURE_STORAGE_CONNECTION_STRING"

# Desplegar el backend
dotnet publish -c Release -o ./publish
az webapp deployment source config-zip --resource-group aliadoai-rg --name aliado-ai-backend --src ./publish.zip

# Tu webhook URL será:
# https://aliado-ai-backend.azurewebsites.net/api/whatsapp/webhook
```

### 2. Configurar en Meta Business Manager

1. **Ve a Meta Business Manager** → https://business.facebook.com/
2. **Selecciona tu app de WhatsApp Business**
3. **Configuración de Webhooks:**
   - **Callback URL:** `https://aliado-ai-backend.azurewebsites.net/api/whatsapp/webhook`
   - **Verify Token:** `aliado_webhook_verify_token_2024`
   - **Suscripciones:** Marca `messages` y `message_status`

### 3. Obtener Credenciales de WhatsApp Business API

En Meta Business Manager:

1. **WhatsApp Business API:**
   - Ve a tu app → WhatsApp → API Setup
   - Copia el **Phone number ID**
   - Genera un **Access Token** permanente

2. **Agregar a Azure App Service:**
```bash
az webapp config appsettings set --name aliado-ai-backend --resource-group aliadoai-rg --settings \
    "WhatsApp__AccessToken=TU_ACCESS_TOKEN_AQUI" \
    "WhatsApp__PhoneNumberId=TU_PHONE_NUMBER_ID_AQUI"
```

### 4. Testing del Webhook

1. **Verificar que el webhook funciona:**
```bash
curl -X GET "https://aliado-ai-backend.azurewebsites.net/api/whatsapp/webhook?hub.mode=subscribe&hub.challenge=test&hub.verify_token=aliado_webhook_verify_token_2024"
```

2. **Enviar mensaje de prueba:**
   - Envía un WhatsApp al número configurado
   - Verifica que recibas respuesta automática del bot

### 5. Configuraciones Adicionales Necesarias

#### Variables de Entorno Requeridas:

```json
{
  "WhatsApp__AccessToken": "Tu access token de WhatsApp Business API",
  "WhatsApp__PhoneNumberId": "Tu phone number ID",
  "WhatsApp__VerifyToken": "aliado_webhook_verify_token_2024",
  "Gemini__ApiKey": "Tu API key de Google Gemini",
  "Azure__Storage__ConnectionString": "Tu connection string de Azure Storage"
}
```

## 🔧 Como Funciona el Webhook

1. **Meta envía webhook** → `POST /api/whatsapp/webhook/{botId}`
2. **Tu backend recibe el mensaje** y lo procesa
3. **Gemini AI genera respuesta** basada en la configuración del bot
4. **WhatsApp API envía respuesta automática** al usuario

## 📝 Endpoints Disponibles

- `GET /api/whatsapp/webhook` - Verificación de Meta (legacy)
- `POST /api/whatsapp/webhook` - Recepción de mensajes (legacy)  
- `GET /api/whatsapp/webhook/{botId}` - Verificación específica por bot
- `POST /api/whatsapp/webhook/{botId}` - Mensajes específicos por bot

## ⚠️ Puntos Importantes

1. **HTTPS Obligatorio:** Meta requiere HTTPS para webhooks
2. **Verify Token:** Debe coincidir exactamente con lo configurado en Meta
3. **Rate Limits:** WhatsApp tiene límites de mensajes por minuto
4. **Logs:** Revisa los logs en Azure Portal para debugging

## 🚀 Comandos de Despliegue Rápido

```bash
# Configuración completa en un comando
cd C:\Repositorios\Aliado-AI\backend

# Publicar y desplegar
dotnet publish -c Release -o ./bin/Release/net9.0/publish/
cd ./bin/Release/net9.0/publish/

# Comprimir para despliegue
Compress-Archive -Path * -DestinationPath ../publish.zip

# Subir a Azure
az webapp deployment source config-zip --resource-group aliadoai-rg --name aliado-ai-backend --src ../publish.zip
```

## 🔍 Debugging

Si no funciona, verifica:
1. **Variables de entorno** en Azure App Service
2. **Logs de aplicación** en Azure Portal
3. **Status del webhook** en Meta Business Manager
4. **CORS configurado** para tu dominio frontend

## 💡 Siguiente Paso

Una vez desplegado, tu flujo será:
1. Usuario envía WhatsApp → 2. Bot procesa con IA → 3. Respuesta automática