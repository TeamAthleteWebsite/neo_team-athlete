# 🔍 Filtrage des Clients par Rôle

## Vue d'ensemble

Cette page implémente un **filtrage automatique des clients** selon le rôle de l'utilisateur connecté (coach ou admin).

## 🎯 Logique de Filtrage

### Pour les COACH
- **Filtrage actif** : Seuls les clients ayant une offre sélectionnée du coach connecté sont affichés
- **Requête Prisma** : `selectedOffer.coachId = currentUser.id`
- **Résultat** : Clients avec une offre sélectionnée du coach

### Pour les ADMIN
- **Aucun filtre** : Tous les clients ayant une offre sélectionnée sont affichés
- **Requête Prisma** : Pas de filtre supplémentaire sur `coachId`
- **Résultat** : Tous les clients avec une offre sélectionnée

## 🏗️ Architecture

### 1. Page Serveur (`page.tsx`)
```typescript
async function getClientsFiltered() {
  // Récupération de la session utilisateur
  const session = await auth.api.getSession({ headers: await headers() });
  
  // Détermination du rôle et application du filtre
  if (currentUser.role === UserRole.COACH) {
    whereClause.selectedOffer = {
      coachId: currentUser.id
    };
  }
  
  // Requête Prisma avec filtre conditionnel
  const clients = await prisma.user.findMany({ where: whereClause, ... });
}
```

### 2. Composants Client
- `ClientsClient` : Gestion de l'état local et recherche
- `ClientsList` : Affichage de la liste filtrée
- `ClientItem` : Élément individuel avec informations du coach

## 📊 Structure des Données

### Client avec Coach
```typescript
interface Client {
  id: string;
  name: string;
  image: string | null;
  email: string;
  phone: string | null;
  height: number | null;
  weight: number | null;
  goal: string | null;
  trainingType: string;
  coach?: {
    id: string;
    name: string;
    email: string;
  } | null;
}
```

## 🚀 Utilisation

### Accès à la Page
1. Se connecter avec un compte COACH ou ADMIN
2. Naviguer vers `/dashboard/admin/clients`
3. Le filtrage s'applique automatiquement

### Vérification du Filtrage
- **COACH** : Seuls les clients avec votre offre sélectionnée sont affichés
- **ADMIN** : Tous les clients avec une offre sélectionnée sont affichés
- Le nombre de clients affichés correspond au filtrage appliqué

## 🔒 Sécurité

- **Authentification requise** : Seuls les utilisateurs connectés peuvent accéder
- **Contrôle d'accès** : Seuls les rôles COACH et ADMIN sont autorisés
- **Filtrage serveur** : La logique de filtrage s'exécute côté serveur
- **Validation des données** : Vérification de l'existence de l'utilisateur

## ✅ Statut de Production

**READY FOR PRODUCTION** ✅

- ✅ Filtrage automatique implémenté
- ✅ Interface utilisateur propre
- ✅ Affichage des informations du coach
- ✅ Code optimisé et sécurisé
- ✅ Documentation complète

## 📝 Notes Techniques

- **Performance** : Utilisation d'indexes Prisma pour optimiser les requêtes
- **Scalabilité** : Filtrage au niveau de la base de données
- **Maintenance** : Code modulaire et réutilisable
- **Production** : Interface épurée avec filtrage automatique

## 🔄 Différences avec les Prospects

| Aspect | Prospects | Clients |
|--------|-----------|---------|
| **Filtrage** | `selectedOffer.coachId` | `selectedOffer.coachId` |
| **Relation** | Offre sélectionnée | Offre sélectionnée |
| **Statut** | En attente de conversion | Client actif |
| **Affichage** | Coach de l'offre | Coach de l'offre |

## 🎯 Logique Unifiée

**Même principe de filtrage** pour les prospects et les clients :
- **COACH** : Voir uniquement les utilisateurs avec une offre sélectionnée de ce coach
- **ADMIN** : Voir tous les utilisateurs avec une offre sélectionnée
- **Relation** : `selectedOffer.coachId` pour les deux types d'utilisateurs 