import { seedNotifications } from "./notifications";
import { seedPrograms } from "./programs";
import { seedUsers } from "./users";

export async function runSeeds() {
  console.log("Démarrage des seeds...");

  // Exécuter les seeds dans l'ordre
  await seedUsers();
  await seedPrograms();
  await seedNotifications();

  console.log("Tous les seeds ont été exécutés avec succès !");
}
