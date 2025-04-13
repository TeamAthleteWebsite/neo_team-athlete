"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/src/actions/user.actions";
import { Gender } from "@prisma/client";

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

  console.log({ data });

  const user = await prisma.user.update({
    where: { id: currentUser.id },
    data: {
      gender: "MALE",
    },
  });

  return user;
};
