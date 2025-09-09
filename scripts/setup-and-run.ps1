#!/bin/powershell
# Install ts-node if not already installed
Write-Host "Installing ts-node..." -ForegroundColor Cyan
npm install -D ts-node typescript
Write-Host "Running db:add-clerk-id script..." -ForegroundColor Cyan
npm run db:add-clerk-id
