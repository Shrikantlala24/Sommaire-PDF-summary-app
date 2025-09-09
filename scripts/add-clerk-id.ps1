# Add clerk_id column to users table
Write-Host "Adding clerk_id column to users table..." -ForegroundColor Cyan

# Change to the project directory
Set-Location $PSScriptRoot\..

# Run the migration using node
try {
    node db/add-clerk-id.js
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ clerk_id column added successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed with exit code $LASTEXITCODE" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
}
