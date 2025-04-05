#!/bin/bash

# Vérifier si ImageMagick est installé
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick n'est pas installé. Installation nécessaire pour continuer."
    echo "Installez-le avec : brew install imagemagick"
    exit 1
fi

# Vérifier si le logo source existe
if [ ! -f "public/logo.svg" ]; then
    echo "❌ Le fichier public/logo.svg n'existe pas"
    exit 1
fi

echo "🎨 Génération des icônes pour Team Athlete..."

# Créer les icônes PWA
echo "📱 Génération des icônes PWA..."
convert -background none public/logo.svg -resize 192x192 public/icon-192x192.png
convert -background none public/logo.svg -resize 512x512 public/icon-512x512.png

# Créer l'icône Apple
echo "🍎 Génération de l'icône Apple..."
convert -background none public/logo.svg -resize 180x180 public/apple-icon.png

# Créer le favicon multi-taille
echo "🌐 Génération du favicon..."
convert -background none public/logo.svg -resize 16x16 favicon-16.png
convert -background none public/logo.svg -resize 32x32 favicon-32.png
convert -background none public/logo.svg -resize 48x48 favicon-48.png
convert favicon-16.png favicon-32.png favicon-48.png public/favicon.ico
rm favicon-16.png favicon-32.png favicon-48.png

echo "✅ Génération des icônes terminée !"
echo "
Icônes générées :
- public/icon-192x192.png
- public/icon-512x512.png
- public/apple-icon.png
- public/favicon.ico
"

# Vérifier que tous les fichiers ont été créés
missing_files=false
for file in "public/icon-192x192.png" "public/icon-512x512.png" "public/apple-icon.png" "public/favicon.ico"; do
    if [ ! -f "$file" ]; then
        echo "❌ Erreur : $file n'a pas été généré"
        missing_files=true
    fi
done

if [ "$missing_files" = true ]; then
    echo "⚠️ Certains fichiers n'ont pas été générés correctement"
    exit 1
else
    echo "🎉 Toutes les icônes ont été générées avec succès !"
fi 