/**
 * Middleware pour gérer les routes non trouvées (404)
 * @param {import('express').Request} req - Requête Express
 * @param {import('express').Response} res - Réponse Express
 * @returns {void}
 */

export function notFoundMiddleware(_, res) {
  res.status(404).json({
    status: 404,
    message: "Route non trouvée",
  });
}
