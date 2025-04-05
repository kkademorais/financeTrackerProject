import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed...');
  
  // Aqui você pode adicionar código para popular o banco de dados
  // Por exemplo:
  // await prisma.user.create({
  //   data: {
  //     name: 'Admin',
  //     email: 'admin@example.com',
  //     password: 'senha123',
  //   },
  // });
  
  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 