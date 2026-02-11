# 🚀 INSTRUCCIONES DE DEPLOY MANUAL

## 📁 Archivo preparado:
✅ `C:\Repositorios\Aliado-AI\backend\deploy-manual.zip`

## 🔧 Pasos para desplegar:

### 1. Ve a Azure Portal
https://portal.azure.com

### 2. Busca tu App Service
- Nombre: **testarauco**
- Resource Group: **RGDEVRAFA**

### 3. Deploy Manual (Opción A - Kudu):
1. En tu App Service → **Development Tools** → **Advanced Tools (Kudu)** → **Go**
2. En Kudu → **Debug console** → **CMD**
3. Navega a: `/home/site/wwwroot/`
4. **Elimina** todos los archivos existentes en wwwroot (seleccionar todo y Delete)
5. **Arrastra** el archivo `deploy-manual.zip` al navegador
6. En la consola ejecuta: `unzip deploy-manual.zip`
7. **Restart** la app desde Azure Portal

### 4. Deploy Manual (Opción B - Visual Studio Code):
1. Instala extensión: **Azure App Service**
2. Conecta a tu cuenta de Azure
3. Busca **testarauco** en RGDEVRAFA
4. **Right-click** → **Deploy to Web App**
5. Selecciona carpeta: `C:\Repositorios\Aliado-AI\backend\bin\Release\net9.0\publish`

### 5. Deploy Manual (Opción C - ZIP Deploy):
1. En Azure Portal → tu App Service **testarauco**
2. **Deployment Center** → **Local Git** → **External Git**
3. O usa PowerShell:
```powershell
$resourceGroup = "RGDEVRAFA"
$webAppName = "testarauco"
$zipFile = "C:\Repositorios\Aliado-AI\backend\deploy-manual.zip"

# Opción con REST API (si Azure CLI falla)
Invoke-RestMethod -Uri "https://$webAppName.scm.azurewebsites.net/api/zipdeploy" -Method Post -Headers @{Authorization = "Bearer (tu-token)"} -InFile $zipFile
```

## ✅ URLs Finales para Meta:

### 📱 Callback URL:
```
https://testarauco-htfzbfacbcf3fcfs.eastus2-01.azurewebsites.net/api/whatsapp/webhook
```

### 🔑 Verify Token:
```
aliado_webhook_verify_token_2024
```

### 🧪 URL de prueba:
Después del deploy, prueba:
```
https://testarauco-htfzbfacbcf3fcfs.eastus2-01.azurewebsites.net/api/whatsapp/webhook?hub.mode=subscribe&hub.challenge=test&hub.verify_token=aliado_webhook_verify_token_2024
```
Debe devolver: `test`

## ⚙️ Variables de entorno pendientes:

En Azure Portal → App Service → **Configuration** → **Application settings**:

```
WhatsApp__AccessToken = [Tu Access Token de Meta]
WhatsApp__PhoneNumberId = [Tu Phone Number ID de Meta]
Gemini__ApiKey = [Tu API Key de Google Gemini]
Azure__Storage__ConnectionString = [Tu Connection String]
```

## 🎯 Configuración en Meta Business Manager:

1. **Ve a:** https://business.facebook.com/
2. **Tu App** → **WhatsApp** → **Configuration** → **Webhooks**
3. **Callback URL:** `https://testarauco-htfzbfacbcf3fcfs.eastus2-01.azurewebsites.net/api/whatsapp/webhook`
4. **Verify Token:** `aliado_webhook_verify_token_2024`
5. **Subscribe to:** `messages` y `message_status`

---
💡 **Tip:** La opción más fácil es la **Opción A con Kudu** - es directo desde el navegador.