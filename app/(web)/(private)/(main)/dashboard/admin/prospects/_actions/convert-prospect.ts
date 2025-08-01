"use server";

import { prisma } from "@/lib/prisma";
import { UserRole } from "@/prisma/generated";

export async function convertProspectToClient(prospectId: string) {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: prospectId,
      },
      data: {
        role: UserRole.CLIENT,
      },
    });

    return { success: true, data: updatedUser };
  } catch (error) {
    console.error("Error converting prospect:", error);
    return { success: false, error: "Failed to convert prospect to client" };
  }
}
