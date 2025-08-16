# Système de Protection d'Accès Basé sur les Rôles

## Vue d'ensemble

Ce système permet de contrôler l'accès aux différentes pages de l'application en fonction du rôle de l'utilisateur connecté.

## Rôles disponibles

- **ADMIN** : Accès complet à toutes les fonctionnalités
- **COACH** : Accès aux fonctionnalités d'administration et de gestion des clients
- **CLIENT** : Accès limité aux fonctionnalités client
- **PROSPECT** : Accès limité aux fonctionnalités de base

## Composant AccessControl

### Utilisation de base

```tsx
import { AccessControl } from "@/components/features/AccessControl";

export default function MaPage() {
  return (
    <AccessControl allowedRoles={["ADMIN", "COACH"]}>
      <div>Contenu protégé</div>
    </AccessControl>
  );
}
```

### Options disponibles

- `allowedRoles` : Tableau des rôles autorisés
- `fallbackRoute` : Route de redirection si accès refusé (défaut: "/dashboard")
- `showFallback` : Afficher un message d'erreur au lieu de rediriger

### Exemple avec fallback

```tsx
<AccessControl 
  allowedRoles={["ADMIN"]} 
  showFallback={true}
>
  <div>Contenu réservé aux administrateurs</div>
</AccessControl>
```

## Protection des pages

### Page simple

```tsx
export default function PageAdmin() {
  return (
    <AccessControl allowedRoles={["ADMIN", "COACH"]}>
      <div>Contenu de la page admin</div>
    </AccessControl>
  );
}
```

### Page avec composants

```tsx
export default function PageComplexe() {
  return (
    <AccessControl allowedRoles={["ADMIN", "COACH"]}>
      <div>
        <Header />
        <MainContent />
        <Footer />
      </div>
    </AccessControl>
  );
}
```

## Navigation conditionnelle

### Dans le dashboard

```tsx
const { data: session } = useSession();
const hasAdminAccess = session?.user?.role === "ADMIN" || session?.user?.role === "COACH";

return (
  <div>
    {hasAdminAccess && (
      <DashboardNavItem
        iconName="ShieldEllipsis"
        title="Admin"
        route="/dashboard/admin"
      />
    )}
  </div>
);
```

## Sécurité

- Toutes les vérifications se font côté client ET serveur
- Redirection automatique si accès non autorisé
- Gestion des états de chargement
- Protection contre l'accès direct aux URLs

## Bonnes pratiques

1. **Toujours utiliser AccessControl** pour les pages sensibles
2. **Vérifier les rôles** dans la navigation
3. **Utiliser des rôles multiples** quand c'est logique
4. **Tester** avec différents rôles d'utilisateur
5. **Documenter** les permissions requises

## Exemples d'utilisation

### Page accessible aux coaches et admins

```tsx
<AccessControl allowedRoles={["ADMIN", "COACH"]}>
  <GestionClients />
</AccessControl>
```

### Page réservée aux administrateurs

```tsx
<AccessControl allowedRoles={["ADMIN"]}>
  <GestionSysteme />
</AccessControl>
```

### Page avec message d'erreur personnalisé

```tsx
<AccessControl 
  allowedRoles={["ADMIN"]} 
  showFallback={true}
  fallbackRoute="/dashboard"
>
  <GestionAvancee />
</AccessControl>
```
