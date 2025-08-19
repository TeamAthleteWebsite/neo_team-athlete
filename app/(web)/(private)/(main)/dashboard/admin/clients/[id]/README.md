# Popup de Sélection d'Offres - Page Client

## Vue d'ensemble

Cette page permet aux coachs de visualiser les détails d'un client et de sélectionner une offre pour lui. Lorsque le coach clique sur le bouton "Sélection", une popup s'affiche avec le tableau des offres correspondant à son ID.

## Composants

### ClientDetails.tsx
- Composant principal affichant les informations du client
- Intègre la popup de sélection d'offres
- Gère l'état de la popup (ouverte/fermée)

### OfferSelectionPopup.tsx
- Popup modale pour la sélection d'offres
- Affiche les offres du coach connecté
- Permet de switcher entre les types d'offres (Avec/Sans engagement)
- Affiche les offres regroupées par type de programme
- **Nouveau** : Section pour définir les informations du contrat

## Fonctionnalités

### 1. Affichage des Offres
- **Type d'offres** : Toggle entre "Avec engagement" et "Sans engagement"
  - **Avec engagement** : Offres avec une durée > 0 mois (ex: 6 mois, 12 mois)
  - **Sans engagement** : Offres avec une durée = 0 mois (prix unique)
- **Types de programmes** : Personal Training, Programmation, Small Group
- **Tableau des tarifs** : Affichage dynamique selon les durées et séances disponibles

### 2. Logique de Filtrage
- **Filtrage par engagement** :
  - `showCommitmentOffers = true` → `duration > 0` (avec engagement)
  - `showCommitmentOffers = false` → `duration === 0` (sans engagement)
- **Filtrage par type de programme** : `program.type === activeProgramType`
- **Combinaison des filtres** : Les deux filtres sont appliqués simultanément

### 3. Sélection d'Offre
- Sélection visuelle avec mise en surbrillance
- Bouton de confirmation désactivé tant qu'aucune offre n'est sélectionnée
- Gestion des erreurs de chargement

### 4. Informations du Contrat
- **Layout optimisé** : Champs disposés sur 3 colonnes pour une utilisation optimale de l'espace
- **Date de début de contrat** : Champ de sélection de date avec validation
  - **Dates autorisées** : Toutes les dates (passées, présentes et futures)
  - **Format d'affichage** : DD/MM/YYYY (format français)
  - **Icône calendrier** : Indication visuelle du type de champ
  - **Taille optimisée** : Padding réduit (px-3 py-2) et icône plus petite (w-4 h-4)
- **Nombre de séances personnalisé** : Champ numérique avec valeur par défaut
  - **Valeur par défaut** : Nombre de séances de l'offre sélectionnée
  - **Personnalisation** : Modification possible du nombre de séances
  - **Validation** : Minimum 1 séance, champ désactivé sans offre sélectionnée
  - **Indicateurs visuels** : Affichage de la valeur par défaut et du total
  - **Taille optimisée** : Padding réduit (px-3 py-2) et texte d'unité plus petit (text-xs)
- **Prix personnalisé** : Champ numérique avec valeur par défaut
  - **Valeur par défaut** : Prix de l'offre sélectionnée
  - **Personnalisation** : Modification possible du prix
  - **Validation** : Minimum 0€, champ désactivé sans offre sélectionnée
  - **Indicateurs visuels** : Affichage de la valeur par défaut avec symbole €
  - **Taille optimisée** : Padding réduit (px-3 py-2) et symbole € plus petit (text-xs)

### 5. Interface Utilisateur
- Design cohérent avec le thème de l'application
- Responsive et accessible
- Animations et transitions fluides

## Utilisation

1. **Accès** : Naviguer vers `/dashboard/admin/clients/[id]`
2. **Ouverture** : Cliquer sur le bouton "Sélection" dans la section Abonnement
3. **Sélection** : 
   - Choisir le type d'offre (Avec/Sans engagement)
   - Sélectionner le type de programme
   - Choisir l'offre dans le tableau des tarifs
4. **Contrat** : 
   - Définir la date de début de contrat
   - Personnaliser le nombre de séances (optionnel)
   - Personnaliser le prix du contrat (optionnel)
5. **Confirmation** : Cliquer sur "Confirmer la sélection"

## Structure des Données

### Interface Offer
```typescript
interface Offer {
  id: string;
  sessions: number;
  price: number;
  duration: number;  // 0 = sans engagement, >0 = avec engagement
  program: {
    name: string;
    type: string;
  };
}
```

### Props de la Popup
```typescript
interface OfferSelectionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  coachId: string;
  onOfferSelect: (offerId: string) => void;
}
```

### Nouveaux États
```typescript
const [contractStartDate, setContractStartDate] = useState<string>("");
const [customSessions, setCustomSessions] = useState<number>(0);
const [customPrice, setCustomPrice] = useState<number>(0);
```

## Actions

### getOffersByCoachAction
- Récupère les offres publiées d'un coach spécifique
- Trie par durée et nombre de séances
- Inclut les informations du programme

## État de la Popup

- `isOpen` : Contrôle l'affichage de la popup
- `showCommitmentOffers` : Type d'offres affiché (engagement ou non)
- `activeProgramType` : Type de programme sélectionné
- `selectedOfferId` : ID de l'offre sélectionnée
- **`contractStartDate`** : Date de début de contrat sélectionnée
- **`customSessions`** : Nombre de séances personnalisé (par défaut : sessions de l'offre)
- **`customPrice`** : Prix personnalisé du contrat (par défaut : prix de l'offre)

## Logique de Filtrage

### Filtrage par Engagement
```typescript
const matchesCommitment = showCommitmentOffers 
  ? offer.duration > 0   // Avec engagement : durée > 0 mois
  : offer.duration === 0; // Sans engagement : durée = 0 mois
```

### Filtrage par Type de Programme
```typescript
const matchesProgramType = offer.program.type === activeProgramType;
```

### Filtrage Combiné
```typescript
const filteredOffers = offers.filter(offer => 
  matchesProgramType && matchesCommitment
);
```

## Gestion du Nombre de Séances

### Logique de Personnalisation
```typescript
const handleOfferSelection = (offerId: string) => {
  setSelectedOfferId(offerId);
  
  // Mettre à jour le nombre de séances par défaut avec celui de l'offre sélectionnée
  const selectedOffer = offers.find(offer => offer.id === offerId);
  if (selectedOffer) {
    setCustomSessions(selectedOffer.sessions);
  }
};

const handleSessionsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const value = parseInt(event.target.value) || 0;
  setCustomSessions(Math.max(0, value)); // Empêcher les valeurs négatives
};
```

### Validation et Affichage
- **Champ désactivé** tant qu'aucune offre n'est sélectionnée
- **Valeur par défaut** automatiquement remplie avec le nombre de séances de l'offre
- **Validation** : Minimum 1 séance pour confirmer la sélection
- **Indicateurs visuels** : Affichage de la valeur par défaut et du total final

## Gestion du Prix Personnalisé

### Logique de Personnalisation
```typescript
const [customPrice, setCustomPrice] = useState<number>(0);

const handleOfferSelection = (offerId: string) => {
  setSelectedOfferId(offerId);
  
  // Mettre à jour le nombre de séances et le prix par défaut avec ceux de l'offre sélectionnée
  const selectedOffer = offers.find(offer => offer.id === offerId);
  if (selectedOffer) {
    setCustomSessions(selectedOffer.sessions);
    setCustomPrice(selectedOffer.price);
  }
};

const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const value = parseFloat(event.target.value) || 0;
  setCustomPrice(Math.max(0, value)); // Empêcher les valeurs négatives
};
```

### Validation et Affichage
- **Champ désactivé** tant qu'aucune offre n'est sélectionnée
- **Valeur par défaut** automatiquement remplie avec le prix de l'offre
- **Validation** : Minimum 0€ pour confirmer la sélection
- **Indicateurs visuels** : Affichage de la valeur par défaut avec symbole €
- **Précision** : Step de 0.01€ pour les prix décimaux

## Gestion des Dates

### Validation des Dates
```typescript
// Suppression de la restriction de date minimale pour permettre les dates rétroactives
// const getMinDate = () => {
//   const today = new Date();
//   return today.toISOString().split('T')[0];
// };
```

### Formatage des Dates
```typescript
const formatDisplayDate = (dateString: string) => {
  if (!dateString) return "Sélectionner une date";
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
```

## Affichage des Tarifs

### Avec Engagement (durée > 0)
- Prix affiché "par mois"
- Calcul du prix par séance : `(prix / sessions).toFixed(2)€ / séance`

### Sans Engagement (durée = 0)
- Prix affiché comme "prix unique"
- Pas de calcul du prix par séance

## Styles

- Utilise Tailwind CSS pour le styling
- Thème sombre cohérent avec l'application
- Composants Shadcn UI pour les éléments d'interface
- Responsive design mobile-first
- **Nouveau** : Icône Calendar de Lucide React pour le champ date

## Prochaines Étapes

1. **Implémentation de la logique de sélection** : Associer l'offre sélectionnée au client
2. **Persistance des données** : Sauvegarder la sélection et la date de début en base de données
3. **Notifications** : Informer l'utilisateur du succès de la sélection
4. **Validation** : Vérifier que le client peut recevoir cette offre
5. **Historique** : Garder une trace des sélections précédentes
6. **Champs supplémentaires** : Ajouter d'autres informations du contrat (durée, conditions, etc.)
