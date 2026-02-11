# Deploy a App Service Existente: testarauco
param(
    [Parameter(Mandatory=$false)]
    [string]$ResourceGroupName = "RGDEVRAFA",
    
    [Parameter(Mandatory=$false)]
    [string]$AppServiceName = "testarauco"
)

Write-Host "Desplegando a App Service existente: $AppServiceName" -ForegroundColor Green

# Navegar al directorio del backend
$backendPath = "C:\Repositorios\Aliado-AI\backend"
Set-Location $backendPath
Write-Host "Trabajando en directorio: $backendPath" -ForegroundColor Blue

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

# Desplegar a Azure (intentar con az)
Write-Host "Intentando desplegar a Azure App Service..." -ForegroundColor Green

try {
    az webapp deployment source config-zip --resource-group $ResourceGroupName --name $AppServiceName --src $zipPath
    Write-Host "Deploy con Azure CLI exitoso!" -ForegroundColor Green
}
catch {
    Write-Host "Azure CLI falló, usa deploy manual:" -ForegroundColor Yellow
    Write-Host "1. Ve a https://portal.azure.com" -ForegroundColor White
    Write-Host "2. Busca App Service: $AppServiceName en RG: $ResourceGroupName" -ForegroundColor White
    Write-Host "3. Deployment Center > More Tools > Kudu" -ForegroundColor White
    Write-Host "4. Sube archivo: $zipPath" -ForegroundColor White
    Write-Host "5. Extrae en /home/site/wwwroot/" -ForegroundColor White
}

# Configurar variables predeterminadas
Write-Host "Configurando variables de entorno..." -ForegroundColor Blue

try {
    az webapp config appsettings set --name $AppServiceName --resource-group $ResourceGroupName --settings "WhatsApp__VerifyToken=aliado_webhook_verify_token_2024" | Out-Null
    az webapp config appsettings set --name $AppServiceName --resource-group $ResourceGroupName --settings "Azure__Storage__ContainerName=aliado-data" | Out-Null
    Write-Host "Variables configuradas!" -ForegroundColor Green
}
catch {
    Write-Host "Error configurando variables - hazlo manual en Azure Portal" -ForegroundColor Yellow
}

# Mostrar URLs finales
$webhookUrl = "https://$AppServiceName.azurewebsites.net/api/whatsapp/webhook"

Write-Host ""
Write-Host "=== CONFIGURACION COMPLETA ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "App Service: $AppServiceName" -ForegroundColor White
Write-Host "Resource Group: $ResourceGroupName" -ForegroundColor White
Write-Host "Web App URL: https://$AppServiceName.azurewebsites.net" -ForegroundColor White
Write-Host ""
Write-Host "PARA META BUSINESS MANAGER:" -ForegroundColor Yellow
Write-Host "   Callback URL: $webhookUrl" -ForegroundColor Red
Write-Host "   Verify Token: aliado_webhook_verify_token_2024" -ForegroundColor Red
Write-Host ""
Write-Host "Variables pendientes de configurar:" -ForegroundColor Blue
Write-Host "   WhatsApp__AccessToken=<tu_token_de_whatsapp>" -ForegroundColor White
Write-Host "   WhatsApp__PhoneNumberId=<tu_phone_number_id>" -ForegroundColor White
Write-Host "   Gemini__ApiKey=<tu_gemini_api_key>" -ForegroundColor White
Write-Host "   Azure__Storage__ConnectionString=<tu_connection_string>" -ForegroundColor White

# Limpiar archivos temporales
Remove-Item $zipPath -Force -ErrorAction SilentlyContinue