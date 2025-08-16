# 🔧 Guide de Résolution - Problème d'Accès Admin

## 🚨 Problème Identifié

L'utilisateur ne peut pas accéder aux pages admin malgré un compte avec le rôle ADMIN ou COACH.

## 🔍 Diagnostic

### 1. Vérification de la Base de Données ✅
- ✅ La base de données contient bien des utilisateurs ADMIN et COACH
- ✅ Les rôles sont correctement définis dans la base de données
- ✅ Structure des utilisateurs conforme au schéma Prisma

### 2. Problème Identifié ❌
**Better-Auth ne retourne pas le champ `role` personnalisé dans la session par défaut.**

## 🛠️ Solutions Implémentées

### 1. Configuration Better-Auth Étendue
```typescript
// lib/auth.ts
session: {
  transform: async (user) => {
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,        // ← Rôle inclus
        isOnboarded: true,
        image: true,
      },
    });
    
    return {
      ...user,
      ...fullUser,
    };
  },
},
```

### 2. Composants de Débogage
- `SessionTest` - Test de session Better-Auth
- `SessionDebug` - Débogage complet de la session
- `SimpleRoleTest` - Test simple du rôle
- `AccessControl` - Protection d'accès avec logs

## 🔄 Étapes de Résolution

### Étape 1: Redémarrer le Serveur
```bash
# Arrêter le serveur (Ctrl+C)
# Puis redémarrer
npm run dev
# ou
bun dev
```

**Important:** Les changements de configuration Better-Auth nécessitent un redémarrage complet.

### Étape 2: Vérifier la Console
Ouvrir la console du navigateur et vérifier les logs :
```
=== SESSION DEBUG ===
Status: authenticated
Session: [object Object]
User: [object Object]
User Role: ADMIN  ← Doit afficher le rôle
====================
```

### Étape 3: Vérifier les Composants de Test
Sur le dashboard, vérifier que :
- ✅ `SessionTest` affiche "SUCCÈS: Rôle récupéré: ADMIN"
- ✅ `SimpleRoleTest` affiche le rôle en vert
- ✅ `SessionDebug` montre toutes les informations de session

## 🧪 Tests de Validation

### Test 1: Connexion avec Compte Admin
1. Se connecter avec `team.athlete.website@gmail.com` (Bak - ADMIN)
2. Vérifier que le rôle "ADMIN" s'affiche
3. Vérifier que le lien "Admin" apparaît
4. Tester l'accès à `/dashboard/admin`

### Test 2: Connexion avec Compte Coach
1. Se connecter avec `dawei@outlook.fr` (Dawei - COACH)
2. Vérifier que le rôle "COACH" s'affiche
3. Vérifier que le lien "Admin" apparaît
4. Tester l'accès à `/dashboard/admin`

### Test 3: Connexion avec Compte Client
1. Se connecter avec `ela@example.com` (Ela - CLIENT)
2. Vérifier que le rôle "CLIENT" s'affiche
3. Vérifier que le lien "Admin" n'apparaît PAS
4. Tester l'accès à `/dashboard/admin` → Doit rediriger

## 🚨 Problèmes Courants

### Problème 1: Rôle "Non défini"
**Cause:** Better-Auth n'a pas été redémarré après les changements
**Solution:** Redémarrer complètement le serveur de développement

### Problème 2: Session vide
**Cause:** Problème de cookies ou de session
**Solution:** 
- Vider le cache du navigateur
- Se déconnecter et se reconnecter
- Vérifier les cookies dans les DevTools

### Problème 3: Erreur Prisma
**Cause:** Client Prisma non généré
**Solution:** 
```bash
npx prisma generate
```

## 📋 Checklist de Résolution

- [ ] Serveur redémarré après modification de `lib/auth.ts`
- [ ] Console du navigateur affiche le rôle utilisateur
- [ ] Composant `SessionTest` affiche "SUCCÈS"
- [ ] Lien "Admin" visible pour les utilisateurs ADMIN/COACH
- [ ] Accès à `/dashboard/admin` fonctionne
- [ ] Redirection pour les utilisateurs non autorisés

## 🔗 Fichiers Modifiés

1. `lib/auth.ts` - Configuration Better-Auth étendue
2. `components/features/AccessControl.tsx` - Protection d'accès avec logs
3. `app/(web)/(private)/(main)/dashboard/page.tsx` - Dashboard avec tests
4. `components/features/SessionTest.tsx` - Test de session
5. `components/features/SessionDebug.tsx` - Débogage complet

## 📞 Support

Si le problème persiste après avoir suivi ce guide :

1. Vérifier les logs de la console du navigateur
2. Vérifier les logs du serveur de développement
3. Tester avec différents comptes utilisateur
4. Vérifier que la base de données est accessible

## 🎯 Résultat Attendu

Après résolution, les utilisateurs ADMIN et COACH devraient :
- ✅ Voir leur rôle affiché sur le dashboard
- ✅ Voir le lien "Admin" dans la navigation
- ✅ Pouvoir accéder à toutes les pages admin
- ✅ Voir les composants de protection fonctionner correctement
