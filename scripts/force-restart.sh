#!/bin/bash

echo "🔄 Force Restart - Nettoyage et redémarrage complet"
echo "=================================================="

# Arrêter tous les processus Node.js en cours
echo "🛑 Arrêt des processus Node.js..."
pkill -f "node"
pkill -f "next"
pkill -f "bun"

# Attendre un peu
sleep 2

# Nettoyer les caches
echo "🧹 Nettoyage des caches..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf .turbo

# Régénérer Prisma
echo "🔧 Régénération du client Prisma..."
npx prisma generate

# Nettoyer les modules si nécessaire
echo "📦 Nettoyage des modules..."
rm -rf node_modules
npm install

# Redémarrer le serveur
echo "🚀 Redémarrage du serveur..."
echo ""
echo "✅ Redémarrage terminé !"
echo "📝 Maintenant, lancez votre serveur avec:"
echo "   npm run dev"
echo "   ou"
echo "   bun dev"
echo ""
echo "🔍 Vérifiez que le rôle s'affiche maintenant dans les tests !"
