import { PrismaClient } from '../prisma/generated/index.js';

const prisma = new PrismaClient();

async function testUserRoles() {
  try {
    console.log('🔍 Test des rôles utilisateurs dans la base de données...\n');

    // Récupérer tous les utilisateurs avec leurs rôles
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isOnboarded: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`📊 Total d'utilisateurs trouvés: ${users.length}\n`);

    if (users.length === 0) {
      console.log('❌ Aucun utilisateur trouvé dans la base de données');
      return;
    }

    // Afficher les détails de chaque utilisateur
    users.forEach((user, index) => {
      console.log(`👤 Utilisateur ${index + 1}:`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Nom: ${user.name || 'Non défini'}`);
      console.log(`   Rôle: ${user.role || '❌ Non défini'}`);
      console.log(`   Onboardé: ${user.isOnboarded ? '✅ Oui' : '❌ Non'}`);
      console.log(`   Créé le: ${user.createdAt}`);
      console.log('');
    });

    // Compter les utilisateurs par rôle
    const roleCounts = {};
    users.forEach(user => {
      const role = user.role || 'NON_DEFINI';
      roleCounts[role] = (roleCounts[role] || 0) + 1;
    });

    console.log('📈 Répartition par rôle:');
    Object.entries(roleCounts).forEach(([role, count]) => {
      console.log(`   ${role}: ${count} utilisateur(s)`);
    });

    // Vérifier s'il y a des utilisateurs ADMIN ou COACH
    const adminUsers = users.filter(user => user.role === 'ADMIN');
    const coachUsers = users.filter(user => user.role === 'COACH');

    console.log('\n🔑 Utilisateurs avec accès admin:');
    if (adminUsers.length > 0) {
      adminUsers.forEach(user => {
        console.log(`   ✅ ADMIN: ${user.email} (${user.name || 'Sans nom'})`);
      });
    } else {
      console.log('   ❌ Aucun utilisateur ADMIN trouvé');
    }

    if (coachUsers.length > 0) {
      coachUsers.forEach(user => {
        console.log(`   ✅ COACH: ${user.email} (${user.name || 'Sans nom'})`);
      });
    } else {
      console.log('   ❌ Aucun utilisateur COACH trouvé');
    }

    // Suggestions
    console.log('\n💡 Suggestions:');
    if (adminUsers.length === 0 && coachUsers.length === 0) {
      console.log('   - Créer au moins un utilisateur ADMIN ou COACH pour tester');
      console.log('   - Vérifier que le champ role est bien défini lors de la création');
    }

    if (users.some(user => !user.role)) {
      console.log('   - Certains utilisateurs n\'ont pas de rôle défini');
      console.log('   - Mettre à jour la base de données pour définir les rôles');
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le test
testUserRoles();
