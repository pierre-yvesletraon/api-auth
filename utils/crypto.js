import argon2 from "argon2";
import jwt from "jsonwebtoken";

/**
 * Hache un mot de passe avec Argon2
 * @async
 * @param {string} password - Mot de passe en clair
 * @returns {Promise<string>} Mot de passe haché
 */
export async function hash(password) {
  return await argon2.hash(password);
}

/**
 * Compare un mot de passe en clair avec un hash
 * @async
 * @param {string} password - Mot de passe en clair
 * @param {string} hashedPassword - Hash stocké en base
 * @returns {Promise<boolean>} True si les mots de passe correspondent
 */
export async function compare(plainTextPassword, hashedPassword) {
  return await argon2.verify(hashedPassword, plainTextPassword);
}

/**
 * Génère un token JWT pour l'authentification
 * @param {Object} user - Utilisateur pour lequel générer le token
 * @param {number} user.id - ID de l'utilisateur
 * @param {string} user.role - Rôle de l'utilisateur
 * @returns {string} Token JWT signé
 */
export function generateJwtToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
}

/**
 * Vérifie et décode un token JWT
 * @param {string} token - Token JWT à vérifier
 * @returns {Object} Payload décodé du token
 * @throws {JsonWebTokenError} Si le token est invalide
 * @throws {TokenExpiredError} Si le token a expiré
 * @property {number} payload.userId - ID de l'utilisateur
 * @property {string} payload.role - Rôle de l'utilisateur
 * @property {string} payload.firstName - Prénom de l'utilisateur
 * @property {string} payload.lastName - Nom de l'utilisateur 
 */
export function verifyJwtToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
