import * as bcrypt from "bcryptjs";
import { Gender, PrismaClient, UserRole } from "../generated";
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

  // Vérifier si les clients factices existent déjà
  const existingClients = await prisma.user.findMany({
    where: {
      role: {
        equals: UserRole.CLIENT,
      },
    },
  });

  if (existingClients.length === 0) {
    const clients = [
      {
        id: "client1",
        email: "ela@example.com",
        emailVerified: true,
        name: "Ela",
        lastName: "Ahamada",
        role: UserRole.CLIENT,
        isOnboarded: true,
        gender: Gender.FEMALE,
        bio: "Client passionnée de fitness",
        image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=1000&auto=format&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "client2",
        email: "fahar@example.com",
        emailVerified: true,
        name: "Fahar",
        lastName: "Hamada",
        role: UserRole.CLIENT,
        isOnboarded: true,
        gender: Gender.MALE,
        bio: "Client motivé pour atteindre ses objectifs",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "client3",
        email: "zayn@example.com",
        emailVerified: true,
        name: "Zayn",
        lastName: "AHAMADA",
        role: UserRole.CLIENT,
        isOnboarded: true,
        gender: Gender.MALE,
        bio: "Client dédié à son entraînement",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "client4",
        email: "mikail@example.com",
        emailVerified: true,
        name: "Mikail",
        lastName: "Hamada",
        role: UserRole.CLIENT,
        isOnboarded: true,
        gender: Gender.MALE,
        bio: "Client en groupe d'entraînement",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "client5",
        email: "zakia@example.com",
        emailVerified: true,
        name: "Zakia",
        lastName: "Ali",
        role: UserRole.CLIENT,
        isOnboarded: true,
        gender: Gender.FEMALE,
        bio: "Client en groupe d'entraînement",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const client of clients) {
      await prisma.user.create({
        data: {
          ...client,
          accounts: {
            create: {
              id: `account-${client.id}`,
              accountId: client.id,
              providerId: "credentials",
              password: await bcrypt.hash("Client123!", 10),
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        },
      });
    }
    console.log("Clients factices créés avec succès");
  } else {
    console.log("Les clients factices existent déjà");
  }
}
