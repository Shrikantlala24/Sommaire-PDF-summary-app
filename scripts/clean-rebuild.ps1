# Clean Next.js cache and rebuild
Write-Host "Cleaning Next.js cache..." -ForegroundColor Cyan

# Change to the project directory
Set-Location $PSScriptRoot\..

# Remove .next folder
if (Test-Path .\.next) {
    Remove-Item -Recurse -Force .\.next
    Write-Host "✅ Removed .next folder" -ForegroundColor Green
}

# Clean npm cache for Next.js
npm cache clean --force
Write-Host "✅ Cleaned npm cache" -ForegroundColor Green

# Reinstall dependencies
Write-Host "Reinstalling dependencies..." -ForegroundColor Cyan
npm install

# Rebuild
Write-Host "Rebuilding the project..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build completed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed with exit code $LASTEXITCODE" -ForegroundColor Red
}
