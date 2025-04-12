import { PrismaClient, ProgramType, UserRole } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Création de l'utilisateur coach
  const coach = await prisma.user.create({
    data: {
      id: "bak",
      email: "bak@team-athlete.com",
      emailVerified: true,
      name: "John",
      lastName: "Doe",
      roles: [UserRole.COACH],
      isOnboarded: true,
      bio: "Coach professionnel avec plus de 10 ans d'expérience",
      createdAt: new Date(),
      updatedAt: new Date(),
      accounts: {
        create: {
          id: "44b1ffe7-2f27-4653-99e1-12ab294666de",
          accountId: "bak",
          providerId: "credentials",
          password: await bcrypt.hash("Coach123!", 10),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    },
  });

  console.log("Coach créé:", coach);

  const programs = [
    {
      title: "PERSONAL TRAINING",
      type: ProgramType.PERSONAL,
      description:
        "Vous souhaitez développer au maximum vos capacités physiques ? Être accompagné à 100% dans votre objectif et obtenir des résultats plus rapidement ? Ce format de coaching est fait pour vous !",
      imageUrl: "/images/personal-training.jpg",
      price: 89.99,
      duration: 60,
      active: true,
    },
    {
      title: "SMALL GROUP TRAINING",
      type: ProgramType.SMALL_GROUP,
      description:
        "Vous voulez perdre du gras en vous musclant dans une ambiance motivante et ludique en groupe ? Rejoignez nous !",
      imageUrl: "/images/group-training.jpg",
      price: 49.99,
      duration: 60,
      active: true,
    },
    {
      title: "PROGRAMMATION",
      type: ProgramType.PROGRAMMING,
      description:
        "Vous ne savez pas comment vous exercer ? Vous avez besoin d'un guide pour faire des entraînements plus efficaces ? La solution est ici !",
      imageUrl: "/images/programming.jpg",
      price: 29.99,
      duration: 45,
      active: true,
    },
  ];

  for (const program of programs) {
    await prisma.program.create({
      data: program,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
