import { PrismaClient, ProgramType } from "../generated";

const prisma = new PrismaClient();

export async function seedContracts() {
  // Vérifier si les contrats existent déjà
  const existingContracts = await prisma.contract.findMany();

  if (existingContracts.length === 0) {
    // Récupérer les programmes existants
    const programs = await prisma.program.findMany();
    const clients = await prisma.user.findMany({
      where: { role: "CLIENT" },
    });
    const coaches = await prisma.user.findMany({
      where: { role: "COACH" },
    });

    if (programs.length === 0 || clients.length === 0 || coaches.length === 0) {
      console.log("⚠️ Cannot create contracts: missing programs, clients, or coaches");
      return;
    }

    // Créer des offres pour chaque programme
    const offers = [];
    for (const program of programs) {
      for (const coach of coaches) {
        const offer = await prisma.offer.create({
          data: {
            coachId: coach.id,
            programId: program.id,
            sessions: 12,
            price: 299.99,
            duration: 3,
            isPublished: true,
          },
        });
        offers.push(offer);
      }
    }

    // Créer des contrats pour chaque client
    for (let i = 0; i < clients.length; i++) {
      const client = clients[i];
      const programIndex = i % programs.length;
      const offerIndex = i % offers.length;
      
      await prisma.contract.create({
        data: {
          clientId: client.id,
          offerId: offers[offerIndex].id,
          startDate: new Date(),
          endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 jours
          totalSessions: 12,
          isFlexible: true,
          amount: 299.99,
          status: "ACTIVE",
        },
      });
    }

    console.log("✅ Contracts created successfully");
  } else {
    console.log("✅ Contracts already exist");
  }
} 