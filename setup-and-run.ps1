# FutureMe AI - Setup and Run (PowerShell)
# Run this in PowerShell from the project folder, or: .\setup-and-run.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "1. Installing dependencies..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) { throw "npm install failed" }

Write-Host "`n2. Ensuring .env exists..." -ForegroundColor Cyan
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "   Created .env from .env.example - please edit .env and set DATABASE_URL (PostgreSQL)." -ForegroundColor Yellow
} else {
    Write-Host "   .env already exists." -ForegroundColor Green
}

Write-Host "`n3. Generating Prisma client..." -ForegroundColor Cyan
npx prisma generate
if ($LASTEXITCODE -ne 0) { throw "prisma generate failed" }

Write-Host "`n4. Pushing database schema (requires valid DATABASE_URL in .env)..." -ForegroundColor Cyan
npx prisma db push
if ($LASTEXITCODE -ne 0) {
    Write-Host "   prisma db push failed. Set DATABASE_URL in .env to a PostgreSQL URL (e.g. Neon.tech free tier)." -ForegroundColor Yellow
    $cont = Read-Host "Continue to start dev server anyway? (y/n)"
    if ($cont -ne "y") { exit 1 }
}

Write-Host "`n5. Starting dev server..." -ForegroundColor Cyan
Write-Host "   Open http://localhost:3000 when ready. Press Ctrl+C to stop.`n" -ForegroundColor Green
npm run dev
