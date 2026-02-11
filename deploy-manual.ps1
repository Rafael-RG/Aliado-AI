# Deploy Manual del Backend
# Como Azure CLI tiene problemas, haremos deploy manual

# 1. Construir la aplicación
cd C:\Repositorios\Aliado-AI\backend
dotnet clean
dotnet publish -c Release -o ./bin/Release/net9.0/publish/

# 2. Comprimir archivos
$publishPath = "./bin/Release/net9.0/publish/*"
$zipPath = "./backend-deploy.zip"

if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

Compress-Archive -Path $publishPath -DestinationPath $zipPath -Force

Write-Host "✅ Archivo creado: backend-deploy.zip" -ForegroundColor Green
Write-Host ""
Write-Host "📋 PASOS MANUALES:" -ForegroundColor Yellow
Write-Host "1. Ve a Azure Portal: https://portal.azure.com" -ForegroundColor White
Write-Host "2. Busca tu App Service en el resource group: RGDEVRAFA" -ForegroundColor White
Write-Host "3. En tu App Service > Deployment Center > More Tools > Kudu" -ForegroundColor White
Write-Host "4. Sube el archivo: backend-deploy.zip" -ForegroundColor White
Write-Host "5. Extrae en: /home/site/wwwroot/" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Tu webhook URL será:" -ForegroundColor Cyan
Write-Host "https://TU_APP_NAME.azurewebsites.net/api/whatsapp/webhook" -ForegroundColor Green
Write-Host ""
Write-Host "🔑 Token de verificación:" -ForegroundColor Cyan
Write-Host "aliado_webhook_verify_token_2024" -ForegroundColor Green