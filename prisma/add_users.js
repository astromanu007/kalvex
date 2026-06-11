// prisma/add_users.js
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');

// Load environment variables from .env manually
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const firstEquals = trimmed.indexOf('=');
    if (firstEquals === -1) return;
    const key = trimmed.substring(0, firstEquals).trim();
    let val = trimmed.substring(firstEquals + 1).trim();
    // Remove enclosing quotes if any
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  });
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("Error: DATABASE_URL not found in .env");
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function upsertUser({ email, name, plainPassword, role }) {
  const hashed = await bcrypt.hash(plainPassword, 10);
  const referralCode = randomUUID().substring(0, 8); // nice and clean code
  
  const user = await prisma.user.upsert({
    where: { email },
    update: { 
      password: hashed, 
      name, 
      role 
    },
    create: {
      name,
      email,
      password: hashed,
      role,
      referralCode,
    },
  });
  console.log(`✅ Upserted ${role}: ${email} (Name: ${name})`);
  return user;
}

async function main() {
  console.log("Connecting to database and upserting users...");
  
  await upsertUser({
    email: "manish@gmail.com",
    name: "Manish Developer",
    plainPassword: "ManishDev123!",
    role: "DEVELOPER",
  });

  await upsertUser({
    email: "cosmo@gmail.com",
    name: "Cosmo Writer",
    plainPassword: "CosmoWriter123!",
    role: "WRITER",
  });

  await upsertUser({
    email: "admin@example.com",
    name: "Admin User",
    plainPassword: "AdminPass123!",
    role: "ADMIN",
  });

  await upsertUser({
    email: "student@example.com",
    name: "Student User",
    plainPassword: "StudentPass123!",
    role: "STUDENT",
  });

  console.log("All accounts successfully set up.");
}

main()
  .catch((e) => {
    console.error("Database operation failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
