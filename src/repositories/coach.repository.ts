import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export interface Coach {
  id: string;
  name: string;
  lastName: string | null;
  bio: string | null;
  image: string | null;
  email: string;
}

// Données factices pour les coachs
export const coaches: Coach[] = [
  {
    id: "1",
    name: "Thomas Dubois",
    bio: "Coach certifié avec plus de 10 ans d'expérience dans l'entraînement de haut niveau. Spécialisé dans le développement de la force et la préparation physique.",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000&auto=format&fit=crop",
    lastName: null,
    email: "thomas@example.com",
  },
  {
    id: "2",
    name: "Sophie Martin",
    bio: "Nutritionniste diplômée et ancienne athlète. Elle accompagne les sportifs dans l'optimisation de leur alimentation pour maximiser leurs performances.",
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000&auto=format&fit=crop",
    lastName: null,
    email: "sophie@example.com",
  },
  {
    id: "3",
    name: "Lucas Bernard",
    bio: "Expert en récupération et prévention des blessures. Il utilise des techniques avancées pour améliorer la mobilité et réduire les risques de blessures.",
    image:
      "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?q=80&w=1000&auto=format&fit=crop",
    lastName: null,
    email: "lucas@example.com",
  },
  {
    id: "4",
    name: "Emma Petit",
    bio: "Marathonienne et triathlète, elle guide les athlètes vers l'amélioration de leur endurance et de leur performance cardiovasculaire.",
    image:
      "https://images.unsplash.com/photo-1571019613576-2b22c76fd955?q=80&w=1000&auto=format&fit=crop",
    lastName: null,
    email: "emma@example.com",
  },
];

export async function getCoaches(): Promise<Coach[]> {
  const coaches = await prisma.user.findMany({
    where: {
      role: {
        equals: UserRole.COACH,
      },
    },
    select: {
      id: true,
      name: true,
      lastName: true,
      bio: true,
      image: true,
      email: true,
    },
  });

  return coaches.map((coach) => ({
    ...coach,
    name: `${coach.name} ${coach.lastName || ""}`.trim(),
  }));
}

export async function getCoachById(id: string): Promise<Coach | null> {
  const coach = await prisma.user.findFirst({
    where: {
      id,
      role: {
        equals: UserRole.COACH,
      },
    },
    select: {
      id: true,
      name: true,
      lastName: true,
      bio: true,
      image: true,
      email: true,
    },
  });

  if (!coach) return null;

  return {
    ...coach,
    name: `${coach.name} ${coach.lastName || ""}`.trim(),
  };
}
