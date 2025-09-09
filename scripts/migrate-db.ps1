# Run database migration for Sommaire
Write-Host "Running database migration..." -ForegroundColor Cyan

# Change to the project directory
Set-Location $PSScriptRoot\..

# Run the migration using ts-node
try {
    npx ts-node db/migrate.ts
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database migration completed successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Migration failed with exit code $LASTEXITCODE" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
}
