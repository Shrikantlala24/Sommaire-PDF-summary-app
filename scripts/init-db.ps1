# Initialize the database schema for Sommaire
try {
    Write-Host "Initializing database schema..." -ForegroundColor Cyan
    
    # Call the init-db API endpoint
    $response = Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/init-db" -ErrorAction Stop
    
    if ($response.success) {
        Write-Host "✅ Database initialized successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Database initialization failed: $($response.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    Write-Host "Make sure the development server is running on http://localhost:3000" -ForegroundColor Yellow
}
