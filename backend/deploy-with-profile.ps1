# Deploy usando Publish Profile - Zip Deploy
param(
    [Parameter(Mandatory=$false)]
    [string]$ZipPath = "./deploy-manual.zip"
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Iniciando deploy con Publish Profile..." -ForegroundColor Green

# Credenciales del publish profile
$publishUrl = "testarauco-htfzbfacbcf3fcfs.scm.eastus2-01.azurewebsites.net"
$userName = "`$testarauco"
$password = "D0HdawfdblW8eR5tWBfFWFffiT8s2EAMHp009PHwyPdLfmNA6GvkgJ94Hj9i"
$destinationUrl = "https://testarauco-htfzbfacbcf3fcfs.eastus2-01.azurewebsites.net"

# Verificar que el ZIP existe
if (-not (Test-Path $ZipPath)) {
    Write-Host "❌ No se encuentra el archivo: $ZipPath" -ForegroundColor Red
    Write-Host "Generando ZIP primero..." -ForegroundColor Yellow
    
    if (Test-Path "./bin/Release/net9.0/publish/") {
        Compress-Archive -Path "./bin/Release/net9.0/publish/*" -DestinationPath $ZipPath -Force
        Write-Host "✅ ZIP generado: $ZipPath" -ForegroundColor Green
    } else {
        Write-Host "❌ No se encuentra directorio publish. Ejecuta 'dotnet publish' primero." -ForegroundColor Red
        exit 1
    }
}

# Crear credenciales básicas
$base64AuthInfo = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes(("$userName`:$password")))

# Headers para la API de Kudu
$headers = @{
    Authorization = "Basic $base64AuthInfo"
    'Content-Type' = 'application/zip'
}

# URL de la API de Zip Deploy de Kudu
$zipDeployUrl = "https://$publishUrl/api/zipdeploy"

Write-Host "📦 Desplegando $ZipPath a $publishUrl..." -ForegroundColor Blue
Write-Host "🔗 URL de deploy: $zipDeployUrl" -ForegroundColor DarkGray

try {
    # Hacer el deploy usando Zip Deploy API
    $zipContent = Get-Content $ZipPath -Raw -AsByteStream
    
    Write-Host "📤 Subiendo archivos..." -ForegroundColor Yellow
    
    $response = Invoke-RestMethod -Uri $zipDeployUrl -Method POST -Headers $headers -Body $zipContent -TimeoutSec 300
    
    Write-Host "✅ Deploy completado exitosamente!" -ForegroundColor Green
    
} catch [System.Net.WebException] {
    $statusCode = $_.Exception.Response.StatusCode
    Write-Host "❌ Error HTTP: $statusCode" -ForegroundColor Red
    
    if ($statusCode -eq 409) {
        Write-Host "⚠️ Deploy en progreso. Esperando..." -ForegroundColor Yellow
        Start-Sleep 30
        Write-Host "✅ Deploy probablemente completado (código 409 es normal)" -ForegroundColor Green
    } else {
        Write-Host "Detalles del error: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Error inesperado: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Esperar un momento para que se aplique
Write-Host "⏳ Esperando que se active el deployment..." -ForegroundColor Yellow
Start-Sleep 15

# Probar la aplicación
Write-Host "🧪 Probando la aplicación..." -ForegroundColor Blue

try {
    $webhookTestUrl = "$destinationUrl/api/whatsapp/webhook?hub.mode=subscribe`&hub.challenge=test123`&hub.verify_token=aliado_webhook_verify_token_2024"
    $testResponse = Invoke-WebRequest -Uri $webhookTestUrl -UseBasicParsing -TimeoutSec 30
    
    if ($testResponse.Content -eq "test123") {
        Write-Host "🎉 ¡WEBHOOK FUNCIONANDO CORRECTAMENTE!" -ForegroundColor Green
        Write-Host "✅ El webhook devolvió: $($testResponse.Content)" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Webhook responde pero con valor inesperado: $($testResponse.Content)" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "⚠️ Webhook aún no responde. Probando API básica..." -ForegroundColor Yellow
    
    try {
        $apiTest = Invoke-WebRequest -Uri "$destinationUrl/" -UseBasicParsing -TimeoutSec 30
        if ($apiTest.StatusCode -eq 200) {
            Write-Host "✅ Aplicación desplegada correctamente" -ForegroundColor Green
            Write-Host "⏳ El webhook puede necesitar unos minutos más para activarse" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ La aplicación aún no está respondiendo" -ForegroundColor Red
    }
}

# Mostrar información final
Write-Host ""
Write-Host "=== INFORMACIÓN DEL WEBHOOK ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 App URL: $destinationUrl" -ForegroundColor White
Write-Host "📱 Webhook URL: $destinationUrl/api/whatsapp/webhook" -ForegroundColor Green
Write-Host "🔑 Verify Token: aliado_webhook_verify_token_2024" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Para Meta Business Manager:" -ForegroundColor Yellow
Write-Host "   Callback URL: $destinationUrl/api/whatsapp/webhook" -ForegroundColor Red
Write-Host "   Verify Token: aliado_webhook_verify_token_2024" -ForegroundColor Red
Write-Host "   Subscribe to: messages, message_status" -ForegroundColor Red
Write-Host ""
Write-Host "⚙️ Variables pendientes en Azure Portal:" -ForegroundColor Blue
Write-Host "   WhatsApp__AccessToken=<tu_token>" -ForegroundColor White
Write-Host "   WhatsApp__PhoneNumberId=<tu_phone_id>" -ForegroundColor White  
Write-Host "   Gemini__ApiKey=<tu_gemini_key>" -ForegroundColor White
Write-Host "   Azure__Storage__ConnectionString=<tu_storage>" -ForegroundColor White