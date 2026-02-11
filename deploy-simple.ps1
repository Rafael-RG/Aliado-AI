# Script de Despliegue para Aliado AI Backend
param(
    [Parameter(Mandatory=$false)]
    [string]$ResourceGroupName = "aliadoai-rg",
    
    [Parameter(Mandatory=$false)]
    [string]$AppServiceName = "aliado-ai-backend",
    
    [Parameter(Mandatory=$false)]
    [string]$AppServicePlan = "aliado-plan"
)

Write-Host "Iniciando despliegue de Aliado AI Backend..." -ForegroundColor Green

# Verificar si Azure CLI esta instalado
try {
    az --version | Out-Null
    Write-Host "Azure CLI detectado" -ForegroundColor Green
}
catch {
    Write-Host "Azure CLI no encontrado. Por favor instala Azure CLI primero." -ForegroundColor Red
    Write-Host "Descarga desde: https://learn.microsoft.com/en-us/cli/azure/install-azure-cli" -ForegroundColor Yellow
    exit 1
}

# Verificar login de Azure
try {
    $account = az account show --query "name" -o tsv
    Write-Host "Logueado en Azure como: $account" -ForegroundColor Green
}
catch {
    Write-Host "No estas logueado en Azure. Ejecutando 'az login'..." -ForegroundColor Red
    az login
}

# Navegar al directorio del backend
$backendPath = "C:\Repositorios\Aliado-AI\backend"
if (-not (Test-Path $backendPath)) {
    Write-Host "Directorio backend no encontrado: $backendPath" -ForegroundColor Red
    exit 1
}

Set-Location $backendPath
Write-Host "Trabajando en directorio: $backendPath" -ForegroundColor Blue

# Verificar si el resource group existe
$rgExists = az group exists --name $ResourceGroupName
if ($rgExists -eq "false") {
    Write-Host "Creando Resource Group: $ResourceGroupName" -ForegroundColor Yellow
    az group create --name $ResourceGroupName --location "East US"
}

# Verificar si el App Service Plan existe
$planExists = az appservice plan show --name $AppServicePlan --resource-group $ResourceGroupName --query "name" -o tsv 2>$null
if (-not $planExists) {
    Write-Host "Creando App Service Plan: $AppServicePlan" -ForegroundColor Yellow
    az appservice plan create --name $AppServicePlan --resource-group $ResourceGroupName --sku F1 --is-linux
}

# Verificar si la Web App existe
$appExists = az webapp show --name $AppServiceName --resource-group $ResourceGroupName --query "name" -o tsv 2>$null
if (-not $appExists) {
    Write-Host "Creando Web App: $AppServiceName" -ForegroundColor Yellow
    az webapp create --name $AppServiceName --resource-group $ResourceGroupName --plan $AppServicePlan --runtime "DOTNET:9.0"
}

# Construir la aplicacion
Write-Host "Construyendo aplicacion .NET..." -ForegroundColor Blue
dotnet clean
dotnet restore
dotnet publish -c Release -o ./bin/Release/net9.0/publish/

# Comprimir archivos para despliegue
Write-Host "Comprimiendo archivos..." -ForegroundColor Blue
$publishPath = "./bin/Release/net9.0/publish/*"
$zipPath = "./bin/Release/net9.0/publish.zip"

if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

Compress-Archive -Path $publishPath -DestinationPath $zipPath -Force

# Desplegar a Azure
Write-Host "Desplegando a Azure App Service..." -ForegroundColor Green
az webapp deployment source config-zip --resource-group $ResourceGroupName --name $AppServiceName --src $zipPath

# Configurar variables predeterminadas
Write-Host "Configurando variables de entorno..." -ForegroundColor Blue

az webapp config appsettings set --name $AppServiceName --resource-group $ResourceGroupName --settings "WhatsApp__VerifyToken=aliado_webhook_verify_token_2024" | Out-Null
az webapp config appsettings set --name $AppServiceName --resource-group $ResourceGroupName --settings "Azure__Storage__ContainerName=aliado-data" | Out-Null

# Mostrar resultados
$webhookUrl = "https://$AppServiceName.azurewebsites.net/api/whatsapp/webhook"

Write-Host ""
Write-Host "DESPLIEGUE COMPLETADO EXITOSAMENTE!" -ForegroundColor Green
Write-Host ""
Write-Host "URLs importantes:" -ForegroundColor Cyan
Write-Host "   Web App: https://$AppServiceName.azurewebsites.net" -ForegroundColor White
Write-Host "   Webhook URL: $webhookUrl" -ForegroundColor White
Write-Host ""
Write-Host "PARA META BUSINESS MANAGER:" -ForegroundColor Yellow
Write-Host "   Callback URL: $webhookUrl" -ForegroundColor Red
Write-Host "   Verify Token: aliado_webhook_verify_token_2024" -ForegroundColor Red
Write-Host ""

# Limpiar archivos temporales
Remove-Item $zipPath -Force -ErrorAction SilentlyContinue

Write-Host "Para configurar las variables restantes:" -ForegroundColor Blue
Write-Host "az webapp config appsettings set --name $AppServiceName --resource-group $ResourceGroupName --settings" -ForegroundColor White
Write-Host '    "WhatsApp__AccessToken=TU_TOKEN"' -ForegroundColor White
Write-Host '    "WhatsApp__PhoneNumberId=TU_PHONE_ID"' -ForegroundColor White
Write-Host '    "Gemini__ApiKey=TU_GEMINI_KEY"' -ForegroundColor White