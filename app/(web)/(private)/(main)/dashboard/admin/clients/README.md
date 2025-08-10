# Page des Clients - Dashboard Admin

## Description
Cette page affiche la liste des clients de l'application avec une interface utilisateur moderne et responsive, respectant le design demandé.

## Fonctionnalités

### 1. Affichage des Clients
- Liste des clients avec photos de profil ou initiales
- Nom complet du client
- Type d'entraînement (Personal Training, Small Group Training, Programming)
- Compteur dynamique du nombre total de clients

### 2. Interface Utilisateur
- **Header** : Titre "Clients (X)" avec icône de tri et de recherche
- **Recherche** : Barre de recherche pour filtrer les clients par nom
- **Tri** : Bouton de tri pour ordonner les clients par nom (A-Z ou Z-A)
- **Liste** : Affichage des clients avec séparateurs visuels
- **Responsive** : Design adaptatif pour mobile et desktop

### 3. Composants

#### `ClientsClient` (Composant principal)
- Gère l'état de la recherche et du tri
- Affiche le header avec titre et boutons d'action
- Intègre la barre de recherche

#### `ClientsList` (Liste des clients)
- Affiche la liste des clients ou un message d'état vide
- Gère l'arrière-plan avec effet de flou
- Responsable de l'affichage conditionnel

#### `ClientItem` (Élément client individuel)
- Affiche les informations d'un client
- Gère les images de profil et les initiales
- Affiche le type d'entraînement
- Séparateurs visuels entre les éléments

#### `LoadingClients` (État de chargement)
- Skeleton loader pendant le chargement des données
- Animation de pulsation pour une meilleure UX

## Structure des Données

### Interface Client
```typescript
interface Client {
  id: string;
  name: string;
  image: string | null;
  trainingType: string;
}
```

### Types d'Entraînement
- `PERSONAL` → "Personal Training"
- `SMALL_GROUP` → "Small Group Training"
- `PROGRAMMING` → "Programming"

## Routes

- **Page principale** : `/dashboard/admin/clients`
- **Retour** : `/dashboard/admin`

## Actions Serveur

### `getClients()`
Récupère tous les clients avec leurs informations de base et types d'entraînement.

### `getClientsCount()`
Compte le nombre total de clients pour l'affichage dans le dashboard admin.

## Gestion des Erreurs

- Affichage d'un message d'erreur en cas d'échec du chargement
- État de chargement avec skeleton loader
- Gestion des cas où aucun client n'est trouvé

## Accessibilité

- Boutons avec attributs `title` pour les tooltips
- Navigation au clavier supportée
- Contraste approprié pour la lisibilité
- Structure sémantique correcte

## Styles

- Utilisation exclusive de Tailwind CSS
- Thème sombre avec transparences
- Effets de hover et transitions
- Design mobile-first responsive 