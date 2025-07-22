"use server";

import { ProgramRepository } from "@/src/repositories/program.repository";
import { revalidatePath } from "next/cache";

const programRepository = new ProgramRepository();

export async function getPrograms() {
  try {
    return await programRepository.findAll();
  } catch (error) {
    console.error("Error fetching programs:", error);
    throw new Error("Impossible de récupérer les programmes");
  }
}

export async function getProgramById(id: string) {
  try {
    const program = await programRepository.findById(id);
    if (!program) {
      throw new Error("Programme non trouvé");
    }
    return program;
  } catch (error) {
    console.error("Error fetching program:", error);
    throw new Error("Impossible de récupérer le programme");
  }
}

export async function getProgramsByType(
  type: "PERSONAL" | "SMALL_GROUP" | "PROGRAMMING",
) {
  try {
    return await programRepository.findByType(type);
  } catch (error) {
    console.error("Error fetching programs by type:", error);
    throw new Error("Impossible de récupérer les programmes par type");
  }
}

export async function createProgram(data: {
  name: string;
  description: string;
  type: "PERSONAL" | "SMALL_GROUP" | "PROGRAMMING";
  imageUrl?: string;
}) {
  try {
    const program = await programRepository.create(data);
    revalidatePath("/dashboard/admin");
    return program;
  } catch (error) {
    console.error("Error creating program:", error);
    throw new Error("Impossible de créer le programme");
  }
}

export async function updateProgram(
  id: string,
  data: {
    name?: string;
    description?: string;
    type?: "PERSONAL" | "SMALL_GROUP" | "PROGRAMMING";
    imageUrl?: string;
  },
) {
  try {
    const program = await programRepository.update(id, data);
    revalidatePath("/dashboard/admin");
    return program;
  } catch (error) {
    console.error("Error updating program:", error);
    throw new Error("Impossible de mettre à jour le programme");
  }
}

export async function deleteProgram(id: string) {
  try {
    await programRepository.delete(id);
    revalidatePath("/dashboard/admin");
  } catch (error) {
    console.error("Error deleting program:", error);
    throw new Error("Impossible de supprimer le programme");
  }
}
