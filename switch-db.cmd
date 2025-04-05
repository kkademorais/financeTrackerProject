@echo off
echo Alternando entre banco de dados local e Neon...

setlocal enabledelayedexpansion

set "local_db=postgresql://postgres:postgres@localhost:5432/fintracker"
set "neon_db=postgresql://neondb_owner:npg_nIMO0Xs7VABr@ep-long-lake-aco1pyxs-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require"

for /f "tokens=*" %%a in ('type .env ^| findstr /C:"DATABASE_URL="') do (
    set "current_db=%%a"
)

if "!current_db!"=="DATABASE_URL=!local_db!" (
    echo Alternando para banco de dados Neon...
    powershell -Command "(Get-Content .env) -replace 'DATABASE_URL=!local_db!', 'DATABASE_URL=!neon_db!' | Set-Content .env"
) else (
    echo Alternando para banco de dados local...
    powershell -Command "(Get-Content .env) -replace 'DATABASE_URL=!neon_db!', 'DATABASE_URL=!local_db!' | Set-Content .env"
)

echo.
echo Banco de dados alterado com sucesso!
echo Para aplicar as alteracoes, execute: init-db-no-seed.cmd ou init-db-neon.cmd 