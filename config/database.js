import "dotenv/config";
import { Sequelize } from "sequelize";
/**
 * Configuration et initialisation de la base de données PostgreSQL
 * @module database
 */

/**
 * Instance Sequelize configurée avec les variables d'environnement
 * @type {import('sequelize').Sequelize}
 */
export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  logging: false,
});

// Fonction pour tester la connexion à la bdd
export async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ Connexion à la base de données OK");
  } catch (error) {
    console.error("❌ Impossible de se connecter à la base de données:", error);
    throw error;
  }
}
