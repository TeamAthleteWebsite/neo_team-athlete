# Affichage des Informations du Contrat

## Vue d'ensemble

Cette implémentation permet d'afficher les informations du contrat dans la section Abonnement de la page Dashboard/Admin/Client/[id], en respectant les règles de priorité suivantes :

1. **Contrat en cours** : Priorité maximale
2. **Contrat futur** : Priorité secondaire (date de début la plus proche)
3. **Aucun contrat** : Affichage du message par défaut

## Composants

### ContractInfo.tsx

Composant principal qui gère l'affichage des informations du contrat.

#### Props
- `clientId: string` - ID du client
- `onContractUpdate?: (hasContractData: boolean) => void` - Callback pour notifier le parent
- `onOpenOfferPopup?: () => void` - Callback pour ouvrir la popup de sélection

#### États
- `contractData: ContractData | null` - Données du contrat
- `contractType: "active" | "future" | null` - Type de contrat
- `isLoading: boolean` - État de chargement
- `error: string | null` - Message d'erreur

### ClientDetails.tsx

Composant parent qui intègre le composant ContractInfo.

#### Modifications apportées
- Ajout de l'état `hasContract` pour gérer l'état du contrat
- Intégration du composant `ContractInfo`
- Gestion des callbacks de mise à jour

## Actions

### getClientContractsAction

Fonction serveur qui récupère les contrats d'un client avec la logique de priorité.

#### Logique de priorité

```typescript
// 1. Contrat en cours : date de début <= aujourd'hui ET date de fin >= aujourd'hui
const activeContract = contracts.find(contract => {
  const startDate = new Date(contract.startDate);
  const endDate = new Date(contract.endDate);
  return startDate <= today && endDate >= today;
});

// 2. Contrat futur : date de début > aujourd'hui (trié par date la plus proche)
const futureContracts = contracts.filter(contract => {
  const startDate = new Date(contract.startDate);
  return startDate > today;
});

// 3. Aucun contrat : retourne null
```

## Informations affichées

### Pour un contrat existant

1. **Type de programme** - Avec icône Package
2. **Nombre de sessions** - Avec icône Users
3. **Date de début** - Avec icône Calendar
4. **Date de fin** - Avec icône Calendar
5. **Durée du contrat** - Calculée automatiquement avec icône Clock
6. **Prix par mois** - Avec icône DollarSign
7. **Prix total** - Affiché en évidence

### Pour aucun contrat

- Message "Aucun abonnement en cours..."
- Instruction "Veuillez sélectionner un programme"
- Bouton "Sélection" pour ouvrir la popup

## Gestion des états

### Loading
- Affichage d'un skeleton animé
- Titre "Abonnement" visible

### Error
- Affichage du message d'erreur en rouge
- Titre "Abonnement" visible

### Success avec contrat
- Affichage complet des informations
- Badge de statut (Contrat en cours / Contrat futur)
- Grille responsive des informations

### Success sans contrat
- Affichage du message par défaut
- Bouton de sélection

## Styles

- Utilisation de Tailwind CSS
- Thème sombre cohérent avec l'application
- Icônes Lucide React pour chaque type d'information
- Grille responsive (1 colonne sur mobile, 2 sur desktop)
- Badges colorés pour les statuts de contrat

## Responsive Design

- Grille adaptative selon la taille d'écran
- Espacement cohérent sur tous les appareils
- Icônes et textes optimisés pour la lisibilité mobile

## Intégration

Le composant s'intègre parfaitement dans la section Abonnement existante et remplace l'affichage statique précédent tout en conservant la fonctionnalité du bouton de sélection.
