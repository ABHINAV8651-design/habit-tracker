@echo off
cd /d "%~dp0"
echo 1. Installing dependencies...
call npm install
if errorlevel 1 goto err

echo.
echo 2. Ensuring .env exists...
if not exist .env (
    copy .env.example .env
    echo    Created .env - please edit .env and set DATABASE_URL.
) else (
    echo    .env already exists.
)

echo.
echo 3. Generating Prisma client...
call npx prisma generate
if errorlevel 1 goto err

echo.
echo 4. Pushing database schema...
call npx prisma db push
if errorlevel 1 (
    echo    DB push failed. Set DATABASE_URL in .env to a PostgreSQL URL.
    set /p cont=Continue to start dev server anyway? (y/n): 
    if /i not "%cont%"=="y" goto err
)

echo.
echo 5. Starting dev server...
echo    Open http://localhost:3000 when ready. Press Ctrl+C to stop.
echo.
call npm run dev
goto end

:err
echo Setup failed.
exit /b 1

:end
