import { Gender, PrismaClient, UserRole } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function seedUsers() {
  // Vérifier si l'utilisateur admin existe déjà
  const existingUser = await prisma.user.findUnique({
    where: { id: "bak" },
  });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        id: "bak",
        email: "bak@team-athlete.com",
        emailVerified: true,
        name: "Coach",
        lastName: "Bak",
        role: UserRole.ADMIN,
        isOnboarded: true,
        gender: Gender.MALE,
        bio: "Coach professionnel avec plus de 10 ans d'expérience",
        phone: "0606060606",
        createdAt: new Date(),
        updatedAt: new Date(),
        accounts: {
          create: {
            id: "44b1ffe7-2f27-4653-99e1-12ab294666de",
            accountId: "bak",
            providerId: "credentials",
            password: await bcrypt.hash("Co0.ach123!", 10),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      },
    });
    console.log("Utilisateur 'bak' créé avec succès");
  } else {
    console.log("L'utilisateur 'bak' existe déjà");
  }

  // Vérifier si les coaches factices existent déjà
  const existingCoaches = await prisma.user.findMany({
    where: {
      role: {
        equals: UserRole.COACH,
      },
      NOT: {
        id: "bak",
      },
    },
  });

  if (existingCoaches.length === 0) {
    const coaches = [
      {
        id: "coach1",
        email: "thomas@team-athlete.com",
        emailVerified: true,
        name: "Thomas",
        lastName: "Dubois",
        role: UserRole.COACH,
        isOnboarded: true,
        gender: Gender.MALE,
        bio: "Coach certifié avec plus de 10 ans d'expérience dans l'entraînement de haut niveau. Spécialisé dans le développement de la force et la préparation physique.",
        image:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000&auto=format&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const coach of coaches) {
      await prisma.user.create({
        data: {
          ...coach,
          accounts: {
            create: {
              id: `account-${coach.id}`,
              accountId: coach.id,
              providerId: "credentials",
              password: await bcrypt.hash("Co0.ach123!", 10),
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        },
      });
    }
    console.log("Coaches factices créés avec succès");
  } else {
    console.log("Les coaches factices existent déjà");
  }
}
