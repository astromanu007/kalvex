// prisma/seed.js
const { PrismaClient, Role } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');

const prisma = new PrismaClient();

async function createUser({ name, email, plainPassword, role }) {
  const hashed = await bcrypt.hash(plainPassword, 10);
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role,
      referralCode: randomUUID(),
    },
  });
}

async function main() {
  console.log('Seeding users...');
  await createUser({ name: 'Admin User', email: 'admin@example.com', plainPassword: 'AdminPass123!', role: Role.ADMIN });
  await createUser({ name: 'Student User', email: 'student@example.com', plainPassword: 'StudentPass123!', role: Role.STUDENT });
  await createUser({ name: 'Developer User', email: 'developer@example.com', plainPassword: 'DevPass123!', role: Role.DEVELOPER });
  await createUser({ name: 'Writer User', email: 'writer@example.com', plainPassword: 'WriterPass123!', role: Role.WRITER });
  console.log('✅ Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
