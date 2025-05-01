import "dotenv/config"; // Pour charger les variables locales via .env
import { Sequelize } from "sequelize";

/**
 * Configuration et initialisation de la base de données PostgreSQL
 * @module database
 */

let sequelize; // Déclarer la variable sans l'initialiser tout de suite

/**
 * Instance Sequelize configurée.
 * Elle utilise DATABASE_URL si disponible (production/Railway),
 * sinon elle utilise les variables d'environnement séparées (développement local).
 * @type {import('sequelize').Sequelize}
 */
if (process.env.DATABASE_URL) {
  // CAS 1: DATABASE_URL est définie (environnement de production comme Railway)
  // On initialise Sequelize en utilisant directement cette URL complète.
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false, // Désactiver les logs SQL en production par défaut
    dialectOptions: {
      // Options spécifiques à PostgreSQL si nécessaire, par exemple pour SSL.
      // Railway gère souvent SSL via l'URL, mais si vous avez des problèmes :
      // ssl: {
      //   require: true,
      //   rejectUnauthorized: false // Attention: à utiliser avec précaution
      // }
    }
  });
  console.log("✅ Connexion via DATABASE_URL (Production/Railway)");

} else {
  // CAS 2: DATABASE_URL n'est PAS définie (environnement de développement local)
  // On initialise Sequelize en utilisant les variables séparées de votre fichier .env local.
  console.log("🔧 Connexion via variables d'environnement séparées (Local)");
  if (!process.env.DATABASE_HOST || !process.env.DATABASE_NAME || !process.env.DATABASE_USER) {
      console.warn("⚠️ Variables d'environnement locales (DATABASE_HOST, DATABASE_NAME, DATABASE_USER, etc.) semblent manquantes. Vérifiez votre fichier .env local.");
  }
  sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT || 5432, // Port par défaut si non spécifié
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    logging: console.log, // Activer les logs SQL (affiche les requêtes) en local pour le débogage
  });
}

// Exporter l'instance sequelize configurée
export { sequelize };

// Fonction pour tester la connexion à la bdd (reste inchangée)
export async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ Test de connexion à la base de données réussi !");
  } catch (error) {
    console.error("❌ Impossible de se connecter à la base de données lors du test:", error);
    // Il est crucial de relancer l'erreur pour que le démarrage de l'app échoue si la BDD n'est pas joignable
    throw error;
  }
}
