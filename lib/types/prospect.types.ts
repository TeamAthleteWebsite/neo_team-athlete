import { Gender, UserRole } from "@prisma/client";

export interface Prospect {
  id: string;
  email: string;
  name: string;
  lastName?: string | null;
  phone?: string | null;
  height?: number | null;
  weight?: number | null;
  birthYear?: number | null;
  gender?: Gender | null;
  goal?: string | null;
  roles: UserRole[];
  createdAt: Date;
  isOnboarded: boolean;
}
