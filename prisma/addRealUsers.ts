// prisma/addRealUsers.ts
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

async function upsertUser({ email, name, plainPassword, role }: { email: string; name: string; plainPassword: string; role: Role }) {
  const hashed = await bcrypt.hash(plainPassword, 10);
  await prisma.user.upsert({
    where: { email },
    update: { password: hashed, name },
    create: {
      name,
      email,
      password: hashed,
      role,
      referralCode: randomUUID(),
    },
  });
  console.log(`✅ ${role} user upserted: ${email}`);
}

async function main() {
  await upsertUser({
    email: "manish@gmail.com",
    name: "Manish Developer",
    plainPassword: "ManishDev123!",
    role: Role.DEVELOPER,
  });
  await upsertUser({
    email: "cosmo@gmail.com",
    name: "Cosmo Writer",
    plainPassword: "CosmoWriter123!",
    role: Role.WRITER,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
