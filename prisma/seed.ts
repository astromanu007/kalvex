// prisma/seed.ts
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

// Simple helper to create a user with a hashed password
async function createUser({
  name,
  email,
  plainPassword,
  role,
}: {
  name: string;
  email: string;
  plainPassword: string;
  role: Role;
}) {
  const hashed = await bcrypt.hash(plainPassword, 10);
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role,
      // required fields without defaults – generate simple placeholders
      referralCode: randomUUID(),
      // other optional fields can stay undefined
    },
  });
}

async function main() {
  console.log("Seeding users...");
  await createUser({
    name: "Admin User",
    email: "admin@example.com",
    plainPassword: "AdminPass123!",
    role: Role.ADMIN,
  });
  await createUser({
    name: "Student User",
    email: "student@example.com",
    plainPassword: "StudentPass123!",
    role: Role.STUDENT,
  });
  await createUser({
    name: "Developer User",
    email: "developer@example.com",
    plainPassword: "DevPass123!",
    role: Role.DEVELOPER,
  });
  await createUser({
    name: "Writer User",
    email: "writer@example.com",
    plainPassword: "WriterPass123!",
    role: Role.WRITER,
  });
  console.log("✅ Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
