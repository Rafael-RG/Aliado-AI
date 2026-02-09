# Aliado AI - Azure Storage Setup
# Este script configura el emulador de Azure Storage (Azurite) para desarrollo local

Write-Host "🚀 Configurando Azure Storage Emulator (Azurite)" -ForegroundColor Green

# Verificar si npm está instalado
if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js/NPM no está instalado. Por favor instala Node.js primero." -ForegroundColor Red
    exit 1
}

# Instalar Azurite globalmente
Write-Host "📦 Instalando Azurite..." -ForegroundColor Yellow
npm install -g azurite

# Crear directorio para datos del emulador
$azuriteData = "$PSScriptRoot\azurite-data"
if (!(Test-Path $azuriteData)) {
    New-Item -ItemType Directory -Path $azuriteData | Out-Null
    Write-Host "📁 Directorio creado: $azuriteData" -ForegroundColor Green
}

# Verificar si Azurite ya está corriendo
$azuriteProcess = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.ProcessName -eq "node" }

if ($azuriteProcess) {
    Write-Host "✅ Proceso Node.js encontrado - verificando si es Azurite..." -ForegroundColor Yellow
} else {
    Write-Host "🏃‍♂️ Iniciando Azurite..." -ForegroundColor Yellow
    Start-Process -FilePath "azurite" -ArgumentList "--silent", "--location", $azuriteData, "--debug", "$azuriteData\debug.log" -WindowStyle Hidden
    Start-Sleep -Seconds 3
    Write-Host "✅ Azurite iniciado en segundo plano" -ForegroundColor Green
}

Write-Host "" -ForegroundColor Green
Write-Host "🔗 ENDPOINTS DISPONIBLES:" -ForegroundColor Cyan
Write-Host "   Blob Service:  http://127.0.0.1:10000" -ForegroundColor White
Write-Host "   Queue Service: http://127.0.0.1:10001" -ForegroundColor White
Write-Host "   Table Service: http://127.0.0.1:10002" -ForegroundColor White
Write-Host "" -ForegroundColor Green
Write-Host "📊 Connection String para desarrollo:" -ForegroundColor Cyan
Write-Host "   UseDevelopmentStorage=true" -ForegroundColor White
Write-Host "" -ForegroundColor Green
Write-Host "🛠️ Para detener Azurite:" -ForegroundColor Cyan
Write-Host "   Get-Process -Name 'node' | Stop-Process" -ForegroundColor White
Write-Host "" -ForegroundColor Green
Write-Host "✨ Azure Storage Emulator configurado exitosamente!" -ForegroundColor Green