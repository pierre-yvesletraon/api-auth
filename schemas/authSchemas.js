import Joi from "joi";

/**
 * Schémas de validation Joi pour l'authentification
 * @module authSchemas
 */

/**
 * Schéma de validation pour l'inscription
 * @type {import('joi').ObjectSchema}
 * @property {string} firstName - Prénom (2-50 caractères)
 * @property {string} lastName - Nom (2-50 caractères)
 * @property {string} email - Email valide
 * @property {string} password - Mot de passe (min 8 caractères)
 */
export const registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  // NOTE: Role "admin" autorisé uniquement pour faciliter les tests
  // En production, le role devrait être fixé à "user" par défaut
  role: Joi.string().valid("user", "admin").default("user"),
});

/**
 * Schéma de validation pour la connexion
 * @type {import('joi').ObjectSchema}
 * @property {string} email - Email valide
 * @property {string} password - Mot de passe
 */
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

/**
 * Schéma de validation pour le token de vérification d'email
 * @type {import('joi').ObjectSchema}
 * @property {string} token - Token hexadécimal de 64 caractères
 */
export const verifyEmailSchema = Joi.object({
  token: Joi.string().required(),
});
