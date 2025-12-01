# 🔍 Filtrage des Prospects par Rôle

## Vue d'ensemble

Cette page implémente un **filtrage automatique des prospects** selon le rôle de l'utilisateur connecté (coach ou admin).

## 🎯 Logique de Filtrage

### Pour les COACH
- **Filtrage actif** : Seuls les prospects ayant sélectionné une offre du coach connecté sont affichés
- **Requête Prisma** : `selectedOffer.coachId = currentUser.id`
- **Résultat** : Prospects avec des offres associées au coach

### Pour les ADMIN
- **Aucun filtre** : Tous les prospects ayant sélectionné une offre sont affichés
- **Requête Prisma** : Pas de filtre supplémentaire sur `coachId`
- **Résultat** : Tous les prospects avec des offres

## 🏗️ Architecture

### 1. Page Serveur (`page.tsx`)
```typescript
async function getProspects() {
  // Récupération de la session utilisateur
  const session = await auth.api.getSession({ headers: await headers() });
  
  // Détermination du rôle et application du filtre
  if (currentUser.role === UserRole.COACH) {
    whereClause.selectedOffer = { coachId: currentUser.id };
  }
  
  // Requête Prisma avec filtre conditionnel
  const prospects = await prisma.user.findMany({ where: whereClause, ... });
}
```

### 2. Composants Client
- `ProspectsClient` : Gestion de l'état local
- `ProspectsList` : Affichage de la liste filtrée
- `ProspectDetailsPopup` : Détails avec informations du coach

## 📊 Structure des Données

### Prospect avec Offre
```typescript
interface Prospect {
  // ... autres champs
  selectedOffer?: {
    id: string;
    price: number;
    sessions: number;
    duration: number;
    program: { /* ... */ };
    coach: {
      id: string;
      name: string;
      email: string;
    };
  } | null;
}
```

## 🚀 Utilisation

### Accès à la Page
1. Se connecter avec un compte COACH ou ADMIN
2. Naviguer vers `/dashboard/admin/prospects`
3. Le filtrage s'applique automatiquement

### Vérification du Filtrage
- **COACH** : Seuls les prospects avec vos offres sont affichés
- **ADMIN** : Tous les prospects avec des offres sont affichés
- Le nombre de prospects affichés correspond au filtrage appliqué

## 🔒 Sécurité

- **Authentification requise** : Seuls les utilisateurs connectés peuvent accéder
- **Contrôle d'accès** : Seuls les rôles COACH et ADMIN sont autorisés
- **Filtrage serveur** : La logique de filtrage s'exécute côté serveur
- **Validation des données** : Vérification de l'existence de l'utilisateur

## ✅ Statut de Production

**READY FOR PRODUCTION** ✅

- ✅ Filtrage automatique implémenté
- ✅ Interface utilisateur propre
- ✅ Composants de test retirés
- ✅ Code optimisé et sécurisé
- ✅ Documentation complète

## 📝 Notes Techniques

- **Performance** : Utilisation d'indexes Prisma pour optimiser les requêtes
- **Scalabilité** : Filtrage au niveau de la base de données
- **Maintenance** : Code modulaire et réutilisable
- **Production** : Interface épurée sans éléments de débogage
