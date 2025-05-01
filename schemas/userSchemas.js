import Joi from "joi";

/**
 * Schémas de validation Joi pour les utilisateurs
 * @module userSchemas
 */

/**
 * Schéma de validation pour la mise à jour d'un utilisateur
 * @type {import('joi').ObjectSchema}
 * @property {string} [firstName] - Prénom (2-50 caractères)
 * @property {string} [lastName] - Nom (2-50 caractères)
 * @property {string} [email] - Email valide
 * @property {string} [role] - Rôle (user ou admin)
 * @property {boolean} [isEmailVerified] - Statut de vérification email
 */
export const updateUserSchema = Joi.object({
  firstName: Joi.string().min(2).max(50),
  lastName: Joi.string().min(2).max(50),
  email: Joi.string().email(),
  // NOTE: Modification du rôle autorisée pour les tests
  // En production, cette fonctionnalité devrait être sécurisée davantage
  role: Joi.string().valid("user", "admin"),
  isEmailVerified: Joi.boolean(),
}).min(1); // Au moins un champ doit être fourni

/**
 * Schéma de validation pour l'ID utilisateur
 * @type {import('joi').ObjectSchema}
 * @property {number} id - ID utilisateur (entier positif)
 */
export const userIdSchema = Joi.object({
  id: Joi.number().integer().required(),
});

// schéma de validation pour la récupération des utilisateurs
export const userQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});
