"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/src/actions/user.actions";
import { Gender } from "../../../../prisma/generated";

type OnboardingData = {
  gender?: Gender;
  height?: number;
  weight?: number;
  age?: number;
  goal?: string;
  isOnboarded?: boolean;
};

export const saveOnboarding = async ({ data }: { data: OnboardingData }) => {
  const currentUser = await getCurrentUser();

  const user = await prisma.user.update({
    where: { id: currentUser.id },
    data,
  });

  return user;
};
