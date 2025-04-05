@echo off
echo Inicializando banco de dados local...
echo Certifique-se de que o PostgreSQL esta instalado e rodando na porta 5432
echo e que o usuario 'postgres' com senha 'postgres' existe.

echo.
echo Gerando cliente Prisma...
call npm run postinstall

echo.
echo Aplicando migracoes ao banco de dados...
call npm run db:push

echo.
echo Banco de dados inicializado com sucesso!
echo Para visualizar o banco de dados, execute: npm run db:studio 