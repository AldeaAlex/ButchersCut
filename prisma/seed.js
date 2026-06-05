import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@barber.local";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin12345";

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  // Creează adminul dacă nu există.
  // Dacă există deja, îi actualizează parola ca să nu rămână o parolă veche.
  await prisma.admin.upsert({
    where: {
      email: adminEmail,
    },
    update: {
      passwordHash,
    },
    create: {
      email: adminEmail,
      passwordHash,
    },
  });

  const services = [
    {
      name: "Tuns bărbați",
      description: "Tuns clasic sau modern.",
      durationMinutes: 30,
      price: 50,
    },
    {
      name: "Tuns + barbă",
      description: "Tuns complet și aranjat barbă.",
      durationMinutes: 45,
      price: 80,
    },
    {
      name: "Aranjat barbă",
      description: "Contur și finisare barbă.",
      durationMinutes: 20,
      price: 35,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: {
        id: services.indexOf(service) + 1,
      },
      update: service,
      create: service,
    });
  }

  console.log("Seed complet: admin și servicii inițiale create/actualizate.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });