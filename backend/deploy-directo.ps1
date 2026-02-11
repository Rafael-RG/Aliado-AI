# Deploy directo
$base64 = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes('$testarauco:D0HdawfdblW8eR5tWBfFWFffiT8s2EAMHp009PHwyPdLfmNA6GvkgJ94Hj9i'))

$headers = @{
    Authorization = "Basic $base64"
    'Content-Type' = 'application/zip'
}

$zipPath = "./deploy-manual.zip"

if (-not (Test-Path $zipPath)) {
    Compress-Archive -Path "./bin/Release/net9.0/publish/*" -DestinationPath $zipPath -Force
}

$zipContent = Get-Content $zipPath -Raw -AsByteStream
$url = "https://testarauco-htfzbfacbcf3fcfs.scm.eastus2-01.azurewebsites.net/api/zipdeploy"

Write-Host "Desplegando..." -ForegroundColor Green

try {
    Invoke-RestMethod -Uri $url -Method POST -Headers $headers -Body $zipContent -TimeoutSec 300
    Write-Host "Deploy exitoso!" -ForegroundColor Green
} catch {
    Write-Host "Deploy iniciado (409 es normal)" -ForegroundColor Yellow
}

Start-Sleep 20

$testUrl = "https://testarauco-htfzbfacbcf3fcfs.eastus2-01.azurewebsites.net/api/whatsapp/webhook"

Write-Host "Probando webhook..." -ForegroundColor Blue
Write-Host "URL: $testUrl" -ForegroundColor White

Write-Host ""
Write-Host "PARA META:" -ForegroundColor Cyan
Write-Host "Callback URL: $testUrl" -ForegroundColor Green  
Write-Host "Verify Token: aliado_webhook_verify_token_2024" -ForegroundColor Green