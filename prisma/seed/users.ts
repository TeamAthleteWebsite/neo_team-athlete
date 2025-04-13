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
        roles: [UserRole.COACH, UserRole.ADMIN],
        isOnboarded: true,
        gender: Gender.MALE,
        bio: "Coach professionnel avec plus de 10 ans d'expérience",
        specialty: "Force et conditionnement",
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
      roles: {
        has: UserRole.COACH,
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
        roles: [UserRole.COACH],
        isOnboarded: true,
        gender: Gender.MALE,
        bio: "Coach certifié avec plus de 10 ans d'expérience dans l'entraînement de haut niveau. Spécialisé dans le développement de la force et la préparation physique.",
        specialty: "Force et conditionnement",
        image:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000&auto=format&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "coach2",
        email: "sophie@team-athlete.com",
        emailVerified: true,
        name: "Sophie",
        lastName: "Martin",
        roles: [UserRole.COACH],
        isOnboarded: true,
        gender: Gender.FEMALE,
        bio: "Nutritionniste diplômée et ancienne athlète. Elle accompagne les sportifs dans l'optimisation de leur alimentation pour maximiser leurs performances.",
        specialty: "Nutrition sportive",
        image:
          "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000&auto=format&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "coach3",
        email: "lucas@team-athlete.com",
        emailVerified: true,
        name: "Lucas",
        lastName: "Bernard",
        roles: [UserRole.COACH],
        isOnboarded: true,
        gender: Gender.MALE,
        bio: "Expert en récupération et prévention des blessures. Il utilise des techniques avancées pour améliorer la mobilité et réduire les risques de blessures.",
        specialty: "Récupération et mobilité",
        image:
          "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?q=80&w=1000&auto=format&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "coach4",
        email: "emma@team-athlete.com",
        emailVerified: true,
        name: "Emma",
        lastName: "Petit",
        roles: [UserRole.COACH],
        isOnboarded: true,
        gender: Gender.FEMALE,
        bio: "Marathonienne et triathlète, elle guide les athlètes vers l'amélioration de leur endurance et de leur performance cardiovasculaire.",
        specialty: "Endurance et cardio",
        image:
          "https://images.unsplash.com/photo-1571019613576-2b22c76fd955?q=80&w=1000&auto=format&fit=crop",
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
