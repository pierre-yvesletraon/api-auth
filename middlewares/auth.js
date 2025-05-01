import { verifyJwtToken } from "../utils/crypto.js";

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   responses:
 *     UnauthorizedError:
 *       description: Token d'authentification manquant ou invalide
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 */

/**
 * Middleware pour vérifier si l'utilisateur est authentifié
 * @description Vérifie la présence et la validité du JWT dans les headers
 * @async
 * @param {import('express').Request} req - Requête Express
 * @param {import('express').Response} res - Réponse Express
 * @param {import('express').NextFunction} next - Fonction Next Express
 * @throws {Error} 401 - Token d'authentification manquant ou invalide
 * @returns {Promise<void>}
 */
export async function isAuthenticated(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    const error = new Error("Token d'authentification manquant");
    error.statusCode = 401;
    throw error;
  }

  // Vérification du token JWT
  const decoded = verifyJwtToken(token);
  if (!decoded) {
    const error = new Error("Token d'authentification invalide");
    error.statusCode = 401;
    throw error;
  }

  // Ajout des informations de l'utilisateur décodées dans la requête
  req.user = decoded;
  next();
}

/**
 * @swagger
 * components:
 *   responses:
 *     ForbiddenError:
 *       description: Accès non autorisé - Privilèges administrateur requis
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 */

/**
 * Middleware pour vérifier si l'utilisateur est admin
 * @description Vérifie si l'utilisateur authentifié a le rôle admin
 * @async
 * @param {import('express').Request} req - Requête Express
 * @param {import('express').Response} res - Réponse Express
 * @param {import('express').NextFunction} next - Fonction Next Express
 * @throws {Error} 403 - Accès non autorisé - Privilèges administrateur requis
 * @returns {Promise<void>}
 */
export async function isAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    const error = new Error(
      "Accès non autorisé - Privilèges administrateur requis"
    );
    error.statusCode = 403;
    return next(error);
  }
  next();
}
