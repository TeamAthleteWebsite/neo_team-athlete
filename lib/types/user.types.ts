import { Gender } from "@prisma/client";

export const genderLabels: Record<Gender, string> = {
  MALE: "Homme",
  FEMALE: "Femme",
};
