import { addDays, subHours } from "date-fns";
import { NotificationType, PrismaClient } from "../generated";

const prisma = new PrismaClient();

export async function seedNotifications() {
  const notifications = [
    {
      title: "Bienvenue sur Team Athlete !",
      message:
        "Nous sommes ravis de vous accueillir. Commencez votre parcours d'entraînement dès maintenant.",
      type: NotificationType.SYSTEM_MESSAGE,
      isRead: false,
      createdAt: new Date(),
    },
    {
      title: "Nouveau programme disponible",
      message:
        "Un nouveau programme d'entraînement personnalisé est disponible pour vous. Découvrez-le maintenant !",
      type: NotificationType.PROGRAM_UPDATE,
      isRead: true,
      createdAt: subHours(new Date(), 1),
    },
    {
      title: "Rappel d'entraînement",
      message:
        "N'oubliez pas votre séance d'entraînement d'aujourd'hui. Elle est prévue dans 2 heures.",
      type: NotificationType.SESSION_REMINDER,
      isRead: false,
      createdAt: subHours(new Date(), 2),
    },
    {
      title: "Objectif atteint !",
      message:
        "Félicitations ! Vous avez atteint votre objectif de 10 000 pas aujourd'hui.",
      type: NotificationType.ACHIEVEMENT,
      isRead: true,
      createdAt: addDays(new Date(), -1),
    },
    {
      title: "Mise à jour du profil requise",
      message:
        "Veuillez compléter votre profil pour une expérience personnalisée.",
      type: NotificationType.SYSTEM_MESSAGE,
      isRead: false,
      createdAt: addDays(new Date(), -2),
    },
    {
      title: "Nouveau coach disponible",
      message:
        "Un nouveau coach spécialisé en musculation est disponible pour vous accompagner.",
      type: NotificationType.PROGRAM_UPDATE,
      isRead: true,
      createdAt: addDays(new Date(), -3),
    },
    {
      title: "Problème de synchronisation",
      message:
        "Impossible de synchroniser vos données d'entraînement. Veuillez réessayer.",
      type: NotificationType.SYSTEM_MESSAGE,
      isRead: false,
      createdAt: addDays(new Date(), -4),
    },
    {
      title: "Rappel de paiement",
      message: "Votre abonnement mensuel arrive à échéance dans 3 jours.",
      type: NotificationType.SYSTEM_MESSAGE,
      isRead: true,
      createdAt: addDays(new Date(), -5),
    },
    {
      title: "Nouvelle fonctionnalité",
      message:
        "Découvrez notre nouvelle fonctionnalité de suivi nutritionnel !",
      type: NotificationType.PROGRAM_UPDATE,
      isRead: false,
      createdAt: addDays(new Date(), -6),
    },
    {
      title: "Challenge hebdomadaire",
      message:
        "Participez à notre challenge hebdomadaire et gagnez des récompenses !",
      type: NotificationType.ACHIEVEMENT,
      isRead: true,
      createdAt: addDays(new Date(), -7),
    },
  ];

  // Créer les notifications pour chaque utilisateur
  const users = await prisma.user.findMany();

  for (const user of users) {
    for (const notification of notifications) {
      await prisma.notification.create({
        data: {
          ...notification,
          userId: user.id,
        },
      });
    }
  }

  console.log("✅ Notifications seeded successfully");
}
