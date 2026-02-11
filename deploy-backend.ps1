# 🚀 Script de Despliegue Automatizado para Aliado AI Backend
# Autor: GitHub Copilot
# Fecha: $(Get-Date)

param(
    [Parameter(Mandatory=$false)]
    [string]$ResourceGroupName = "aliadoai-rg",
    
    [Parameter(Mandatory=$false)]
    [string]$AppServiceName = "aliado-ai-backend",
    
    [Parameter(Mandatory=$false)]
    [string]$AppServicePlan = "aliado-plan"
)

Write-Host "🤖 Iniciando despliegue de Aliado AI Backend..." -ForegroundColor Green

# Verificar si Azure CLI está instalado
try {
    az --version | Out-Null
    Write-Host "✅ Azure CLI detectado" -ForegroundColor Green
}
catch {
    Write-Host "❌ Azure CLI no encontrado. Por favor instala Azure CLI primero." -ForegroundColor Red
    Write-Host "💡 Descarga desde: https://learn.microsoft.com/en-us/cli/azure/install-azure-cli" -ForegroundColor Yellow
    exit 1
}

# Verificar login de Azure
try {
    $account = az account show --query "name" -o tsv
    Write-Host "✅ Logueado en Azure como: $account" -ForegroundColor Green
}
catch {
    Write-Host "❌ No estás logueado en Azure. Ejecutando 'az login'..." -ForegroundColor Red
    az login
}

# Navegar al directorio del backend
$backendPath = "C:\Repositorios\Aliado-AI\backend"
if (-not (Test-Path $backendPath)) {
    Write-Host "❌ Directorio backend no encontrado: $backendPath" -ForegroundColor Red
    exit 1
}

Set-Location $backendPath
Write-Host "📁 Trabajando en directorio: $backendPath" -ForegroundColor Blue

# Verificar si el resource group existe
$rgExists = az group exists --name $ResourceGroupName
if ($rgExists -eq "false") {
    Write-Host "📦 Creando Resource Group: $ResourceGroupName" -ForegroundColor Yellow
    az group create --name $ResourceGroupName --location "East US"
}

# Verificar si el App Service Plan existe
$planExists = az appservice plan show --name $AppServicePlan --resource-group $ResourceGroupName --query "name" -o tsv 2>$null
if (-not $planExists) {
    Write-Host "🏗️ Creando App Service Plan: $AppServicePlan" -ForegroundColor Yellow
    az appservice plan create --name $AppServicePlan --resource-group $ResourceGroupName --sku F1 --is-linux
}

# Verificar si la Web App existe
$appExists = az webapp show --name $AppServiceName --resource-group $ResourceGroupName --query "name" -o tsv 2>$null
if (-not $appExists) {
    Write-Host "🌐 Creando Web App: $AppServiceName" -ForegroundColor Yellow
    az webapp create --name $AppServiceName --resource-group $ResourceGroupName --plan $AppServicePlan --runtime "DOTNET:9.0"
}

# Construir la aplicación
Write-Host "🔨 Construyendo aplicación .NET..." -ForegroundColor Blue
dotnet clean
dotnet restore
dotnet publish -c Release -o ./bin/Release/net9.0/publish/

# Verificar que la publicación fue exitosa
if (-not (Test-Path "./bin/Release/net9.0/publish")) {
    Write-Host "❌ Error en la publicación de .NET" -ForegroundColor Red
    exit 1
}

# Comprimir archivos para despliegue
Write-Host "📦 Comprimiendo archivos..." -ForegroundColor Blue
$publishPath = "./bin/Release/net9.0/publish/*"
$zipPath = "./bin/Release/net9.0/publish.zip"

# Remover zip anterior si existe
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

# Crear nuevo zip
Compress-Archive -Path $publishPath -DestinationPath $zipPath -Force

# Desplegar a Azure
Write-Host "🚀 Desplegando a Azure App Service..." -ForegroundColor Green
az webapp deployment source config-zip --resource-group $ResourceGroupName --name $AppServiceName --src $zipPath

# Configurar variables de entorno requeridas
Write-Host "⚙️ Configurando variables de entorno..." -ForegroundColor Blue

# Variables predeterminadas seguras
$defaultSettings = @{
    "WhatsApp__VerifyToken" = "aliado_webhook_verify_token_2024"
    "Azure__Storage__ContainerName" = "aliado-data"
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "false"
    "WEBSITE_ENABLE_SYNC_UPDATE_SITE" = "true"
}

foreach ($setting in $defaultSettings.GetEnumerator()) {
    Write-Host "  Setting: $($setting.Key)" -ForegroundColor DarkGray
    az webapp config appsettings set --name $AppServiceName --resource-group $ResourceGroupName --settings "$($setting.Key)=$($setting.Value)" | Out-Null
}

# Obtener URL del webhook
$webhookUrl = "https://$AppServiceName.azurewebsites.net/api/whatsapp/webhook"

Write-Host ""
Write-Host "✅ ¡Despliegue completado exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "🔗 URLs importantes:" -ForegroundColor Cyan
Write-Host "   Web App: https://$AppServiceName.azurewebsites.net" -ForegroundColor White
Write-Host "   Webhook URL: $webhookUrl" -ForegroundColor White
Write-Host "   Azure Portal: https://portal.azure.com/#@/resource/subscriptions/.../resourceGroups/$ResourceGroupName/providers/Microsoft.Web/sites/$AppServiceName" -ForegroundColor White
Write-Host ""
Write-Host "⚠️ Variables de entorno pendientes de configurar:" -ForegroundColor Yellow
Write-Host "   1. WhatsApp__AccessToken=<tu_access_token>" -ForegroundColor Red
Write-Host "   2. WhatsApp__PhoneNumberId=<tu_phone_number_id>" -ForegroundColor Red  
Write-Host "   3. Gemini__ApiKey=<tu_gemini_api_key>" -ForegroundColor Red
Write-Host "   4. Azure__Storage__ConnectionString=<tu_connection_string>" -ForegroundColor Red
Write-Host ""
Write-Host "💡 Para configurar estas variables:" -ForegroundColor Cyan
Write-Host "az webapp config appsettings set --name $AppServiceName --resource-group $ResourceGroupName --settings \\"
Write-Host "    `"WhatsApp__AccessToken=TU_TOKEN`" \\"
Write-Host "    `"WhatsApp__PhoneNumberId=TU_PHONE_ID`" \\"
Write-Host "    `"Gemini__ApiKey=TU_GEMINI_KEY`" \\"
Write-Host "    `"Azure__Storage__ConnectionString=TU_CONNECTION_STRING`""
Write-Host ""
Write-Host "🔧 Configuración de Meta Webhook:" -ForegroundColor Magenta
Write-Host "   Callback URL: $webhookUrl"
Write-Host "   Verify Token: aliado_webhook_verify_token_2024"
Write-Host "   Subscriptions: messages, message_status"
Write-Host ""
Write-Host "📖 Documentación completa en: WEBHOOK_SETUP.md" -ForegroundColor Blue

# Limpiar archivos temporales
Remove-Item $zipPath -Force -ErrorAction SilentlyContinue
Write-Host "🧹 Archivos temporales limpiados" -ForegroundColor DarkGray