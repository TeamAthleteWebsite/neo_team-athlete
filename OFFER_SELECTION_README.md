# Fonctionnalité d'Enregistrement d'Offre

## Vue d'ensemble

Cette fonctionnalité permet aux utilisateurs de sélectionner et d'enregistrer une offre de coaching dans leur profil. Une fois sélectionnée, l'offre est sauvegardée dans la base de données et affichée dans le profil de l'utilisateur.

## Modifications de la Base de Données

### Schéma Prisma

Le modèle `User` a été étendu avec :
- `selectedOfferId`: Clé étrangère vers l'offre sélectionnée
- `selectedOffer`: Relation vers l'offre sélectionnée

Le modèle `Offer` a été étendu avec :
- `selectedByUsers`: Relation inverse vers les utilisateurs qui ont sélectionné cette offre

### Migration

La migration `20250814195927_add_selected_offer_to_user` a été appliquée pour :
- Ajouter le champ `selectedOfferId` à la table `user`
- Créer la contrainte de clé étrangère vers la table `Offer`
- Permettre la suppression en cascade (SET NULL)

### Correction du Schéma

**Note importante** : Le schéma source Prisma (`prisma/schema.prisma`) a été mis à jour pour inclure :
- Le champ `selectedOfferId` dans le modèle `User`
- La relation `selectedOffer` avec la contrainte appropriée
- La relation inverse `selectedByUsers` dans le modèle `Offer`

Le client Prisma a été régénéré pour refléter ces changements.

## Modifications du Code

### Actions (src/actions/user.actions.ts)

1. **`updateUserSelectedOffer(offerId: string | null)`**
   - Nouvelle fonction pour mettre à jour uniquement l'offre sélectionnée
   - Vérification d'authentification
   - Mise à jour de la base de données

2. **`updateUserProfile(data)`**
   - Étendue pour inclure `selectedOfferId`
   - Permet la mise à jour de l'offre sélectionnée avec le profil

### Repository (src/repositories/user.repository.ts)

1. **`findById(id: string)`**
   - Étendue pour inclure les données de l'offre sélectionnée
   - Inclut les informations du programme et du coach

### Composants UI

#### ProfileEditForm (app/(web)/(private)/(main)/profile/edit/components/ProfileEditForm.tsx)

1. **Interface utilisateur**
   - Bouton pour ouvrir la popup de sélection d'offre
   - Indication visuelle de l'offre sélectionnée
   - Gestion de la sélection d'offre

2. **Logique de sélection**
   - Sélection du coach
   - Affichage des offres disponibles
   - Sélection de l'offre
   - Confirmation de la sélection

3. **Sauvegarde**
   - L'offre sélectionnée est incluse dans la mise à jour du profil
   - Validation et gestion des erreurs

#### ProfilePage (app/(web)/(private)/(main)/profile/page.tsx)

1. **Affichage de l'offre sélectionnée**
   - Section dédiée à l'offre sélectionnée
   - Informations détaillées (programme, coach, prix, durée)
   - Style visuel cohérent avec le reste de l'interface

## Flux d'Utilisation

1. **Accès à l'édition du profil**
   - L'utilisateur va sur `/profile/edit`

2. **Sélection d'une offre**
   - Clique sur "Sélectionner une offre"
   - Choisit un coach dans la liste
   - Sélectionne une offre parmi celles disponibles
   - Confirme sa sélection

3. **Sauvegarde**
   - Clique sur "Enregistrer les modifications"
   - L'offre sélectionnée est sauvegardée avec le profil

4. **Visualisation**
   - L'offre sélectionnée est affichée sur la page de profil
   - Informations complètes (programme, coach, prix, durée)

## Avantages de cette Approche

1. **Simplicité**
   - Une seule clé étrangère dans la table `user`
   - Pas besoin de table de liaison supplémentaire

2. **Performance**
   - Accès direct à l'offre sélectionnée
   - Requêtes optimisées avec Prisma

3. **Flexibilité**
   - L'utilisateur peut changer d'offre facilement
   - L'offre peut être supprimée sans affecter l'utilisateur

4. **Cohérence**
   - L'ID du coach est accessible via l'offre
   - Pas de duplication d'informations

## Sécurité

- Vérification d'authentification pour toutes les actions
- Validation des données avec Zod
- Gestion appropriée des erreurs
- Protection contre les accès non autorisés

## Tests

Pour tester la fonctionnalité :

1. Allez sur `/profile/edit`
2. Cliquez sur "Sélectionner une offre"
3. Choisissez un coach
4. Sélectionnez une offre
5. Cliquez sur "Confirmer la sélection"
6. Cliquez sur "Enregistrer les modifications"
7. Vérifiez sur `/profile` que l'offre est affichée

## Maintenance

- Le schéma Prisma est automatiquement généré
- Les migrations sont versionnées
- Le code suit les conventions du projet
- Documentation mise à jour avec les changements
