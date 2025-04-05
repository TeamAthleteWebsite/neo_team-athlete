import { exec } from "child_process";
import { promises as fs } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

console.log(
  "🔍 Vérification de la configuration des métadonnées et des icônes...\n"
);

// Vérification des fichiers
const requiredFiles = [
  "public/icon-192x192.png",
  "public/icon-512x512.png",
  "public/apple-icon.png",
  "public/favicon.ico",
  "public/manifest.json",
  "public/logo.svg",
];

console.log("📁 Vérification des fichiers requis...");
for (const file of requiredFiles) {
  try {
    await fs.access(join(projectRoot, file));
    console.log(`✅ ${file} existe`);
  } catch {
    console.log(`❌ ${file} est manquant`);
  }
}

// Vérification du manifest.json
console.log("\n📋 Vérification du manifest.json...");
try {
  const manifestContent = await fs.readFile(
    join(projectRoot, "public/manifest.json"),
    "utf8"
  );
  const manifest = JSON.parse(manifestContent);
  const requiredManifestFields = [
    "name",
    "short_name",
    "description",
    "start_url",
    "display",
    "background_color",
    "theme_color",
    "icons",
  ];

  for (const field of requiredManifestFields) {
    if (manifest[field]) {
      console.log(`✅ Le champ ${field} est présent`);
    } else {
      console.log(`❌ Le champ ${field} est manquant`);
    }
  }
} catch (error) {
  console.log("❌ Erreur lors de la lecture du manifest.json:", error.message);
}

// Vérification des tailles d'images
console.log("\n🖼️ Vérification des dimensions des images...");
const execPromise = (command) =>
  new Promise((resolve, reject) => {
    exec(command, (error, stdout) => {
      if (error) reject(error);
      else resolve(stdout.trim());
    });
  });

try {
  const icon192Info = await execPromise("identify public/icon-192x192.png");
  console.log("✅ icon-192x192.png:", icon192Info);
} catch {
  console.log("❌ Impossible de vérifier icon-192x192.png");
}

try {
  const icon512Info = await execPromise("identify public/icon-512x512.png");
  console.log("✅ icon-512x512.png:", icon512Info);
} catch {
  console.log("❌ Impossible de vérifier icon-512x512.png");
}

// Vérification du layout.tsx
console.log("\n📱 Vérification des métadonnées dans layout.tsx...");
try {
  const layoutContent = await fs.readFile(
    join(projectRoot, "app/(home)/layout.tsx"),
    "utf8"
  );
  const requiredMetadata = [
    "title",
    "description",
    "openGraph",
    "twitter",
    "icons",
    "manifest",
  ];

  for (const field of requiredMetadata) {
    if (layoutContent.includes(field)) {
      console.log(`✅ Le champ ${field} est présent dans les métadonnées`);
    } else {
      console.log(`❌ Le champ ${field} est manquant dans les métadonnées`);
    }
  }
} catch (error) {
  console.log("❌ Impossible de lire layout.tsx:", error.message);
}

console.log("\n💡 Recommandations pour les tests manuels :");
console.log(
  "1. Ouvrir le site dans Chrome et vérifier que le favicon s'affiche"
);
console.log(
  "2. Utiliser Chrome DevTools > Application > Manifest pour vérifier la PWA"
);
console.log(
  "3. Partager l'URL sur Twitter/Facebook pour vérifier les métadonnées sociales"
);
console.log("4. Tester sur un appareil iOS pour vérifier l'icône Apple");
console.log("5. Vérifier l'installation PWA sur Android et iOS");
