# Test the database connection for Sommaire
try {
    Write-Host "Testing database connection..." -ForegroundColor Cyan
    
    # Call the test-db API endpoint
    $response = Invoke-RestMethod -Method GET -Uri "http://localhost:3000/api/test-db" -ErrorAction Stop
    
    if ($response.success) {
        Write-Host "✅ Database connection successful!" -ForegroundColor Green
        Write-Host "   Server time: $($response.time)" -ForegroundColor Green
        Write-Host "   Using driver: $($response.driver)" -ForegroundColor Green
    } else {
        Write-Host "❌ Database connection failed: $($response.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    Write-Host "Make sure the development server is running on http://localhost:3000" -ForegroundColor Yellow
}
