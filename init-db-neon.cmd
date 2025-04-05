@echo off
echo Inicializando banco de dados Neon...
echo Certifique-se de que a URL do banco de dados Neon esta configurada no arquivo .env

echo.
echo Gerando cliente Prisma...
call npm run postinstall

echo.
echo Aplicando migracoes ao banco de dados...
call npm run db:push

echo.
echo Banco de dados inicializado com sucesso!
echo Para visualizar o banco de dados, execute: npm run db:studio 