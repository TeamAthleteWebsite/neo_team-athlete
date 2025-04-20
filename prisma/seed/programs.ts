import { PrismaClient, ProgramType } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedPrograms() {
  // Vérifier si les programmes existent déjà
  const existingPrograms = await prisma.program.findMany();

  if (existingPrograms.length === 0) {
    const programs = [
      {
        title: "PERSONAL TRAINING",
        type: ProgramType.PERSONAL,
        description:
          "Vous souhaitez développer au maximum vos capacités physiques ? Être accompagné à 100% dans votre objectif et obtenir des résultats plus rapidement ? Ce format de coaching est fait pour vous !",
        imageUrl:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80",
        price: 89.99,
        duration: 60,
        active: true,
      },
      {
        title: "SMALL GROUP TRAINING",
        type: ProgramType.SMALL_GROUP,
        description:
          "Vous voulez perdre du gras en vous musclant dans une ambiance motivante et ludique en groupe ? Rejoignez nous !",
        imageUrl:
          "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&q=80",
        price: 49.99,
        duration: 60,
        active: true,
      },
      {
        title: "PROGRAMMATION",
        type: ProgramType.PROGRAMMING,
        description:
          "Vous ne savez pas comment vous exercer ? Vous avez besoin d'un guide pour faire des entraînements plus efficaces ? La solution est ici !",
        imageUrl:
          "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?auto=format&fit=crop&q=80",
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
    console.log("✅ Programs created successfully");
  } else {
    console.log("✅ Programs already exist");
  }
}
