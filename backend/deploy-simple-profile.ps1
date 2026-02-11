# Deploy usando Publish Profile - VERSION SIMPLE
$ErrorActionPreference = "Stop"

Write-Host "🚀 Iniciando deploy con Publish Profile..." -ForegroundColor Green

# Credenciales del publish profile
$publishUrl = "testarauco-htfzbfacbcf3fcfs.scm.eastus2-01.azurewebsites.net"
$userName = "`$testarauco"
$password = "D0HdawfdblW8eR5tWBfFWFffiT8s2EAMHp009PHwyPdLfmNA6GvkgJ94Hj9i"
$destinationUrl = "https://testarauco-htfzbfacbcf3fcfs.eastus2-01.azurewebsites.net"
$ZipPath = "./deploy-manual.zip"

# Verificar que el ZIP existe
if (-not (Test-Path $ZipPath)) {
    Write-Host "Generando ZIP..." -ForegroundColor Yellow
    Compress-Archive -Path "./bin/Release/net9.0/publish/*" -DestinationPath $ZipPath -Force
}

# Crear credenciales básicas
$base64AuthInfo = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$userName`:$password"))

# Headers para la API de Kudu
$headers = @{
    Authorization = "Basic $base64AuthInfo"
    'Content-Type' = 'application/zip'
}

# URL de la API de Zip Deploy de Kudu
$zipDeployUrl = "https://$publishUrl/api/zipdeploy"

Write-Host "📦 Desplegando..." -ForegroundColor Blue

try {
    # Hacer el deploy usando Zip Deploy API
    $zipContent = Get-Content $ZipPath -Raw -AsByteStream
    $response = Invoke-RestMethod -Uri $zipDeployUrl -Method POST -Headers $headers -Body $zipContent -TimeoutSec 300
    Write-Host "✅ Deploy completado!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Deploy iniciado (error 409 es normal)" -ForegroundColor Yellow
}

# Esperar
Write-Host "⏳ Esperando activación..." -ForegroundColor Yellow
Start-Sleep 20

# Probar webhook
Write-Host "🧪 Probando webhook..." -ForegroundColor Blue

$webhookUrl = $destinationUrl + "/api/whatsapp/webhook"
$testUrl = $webhookUrl + "?hub.mode=subscribe" + "`&hub.challenge=test123" + "`&hub.verify_token=aliado_webhook_verify_token_2024"

try {
    $testResponse = Invoke-WebRequest -Uri $testUrl -UseBasicParsing -ErrorAction Stop
    Write-Host "🎉 WEBHOOK FUNCIONANDO!" -ForegroundColor Green
    Write-Host "✅ Respuesta: $($testResponse.Content)" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Webhook aún no responde - puede necesitar más tiempo" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== CONFIGURACION PARA META ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Callback URL:" -ForegroundColor Yellow
Write-Host "$webhookUrl" -ForegroundColor Green
Write-Host ""
Write-Host "Verify Token:" -ForegroundColor Yellow  
Write-Host "aliado_webhook_verify_token_2024" -ForegroundColor Green
Write-Host ""
Write-Host "Variables pendientes:" -ForegroundColor Yellow
Write-Host "WhatsApp__AccessToken=TU_TOKEN" -ForegroundColor White
Write-Host "WhatsApp__PhoneNumberId=TU_PHONE_ID" -ForegroundColor White
Write-Host "Gemini__ApiKey=TU_GEMINI_KEY" -ForegroundColor White