import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@tisico.com';
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'Admin123!';
  const name = process.env.SEED_ADMIN_NAME ?? 'Administrador';

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    console.log(`Admin ya existe: ${email}`);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log(`Admin creado: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
