import { Gender, UserRole } from "../../prisma/generated";

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
  role: UserRole;
  createdAt: Date;
  isOnboarded: boolean;
}
