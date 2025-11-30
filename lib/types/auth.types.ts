import { type User as BetterAuthUser } from "better-auth";

// Étendre le type User de Better-Auth pour inclure nos champs personnalisés
export interface ExtendedUser extends BetterAuthUser {
  role: string;
  isOnboarded: boolean;
  lastName?: string;
  phone?: string;
  bio?: string;
  height?: number;
  weight?: number;
  birthYear?: number;
  gender?: string;
  goal?: string;
  selectedOfferId?: string;
}

// Étendre le type Session pour inclure notre utilisateur étendu
export interface ExtendedSession {
  user: ExtendedUser;
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    token: string;
    createdAt: Date;
    updatedAt: Date;
    ipAddress?: string;
    userAgent?: string;
  };
}

// Hook personnalisé pour la session étendue
export interface UseExtendedSession {
  data: ExtendedSession | null;
  isPending: boolean;
  error: Error | null;
}
