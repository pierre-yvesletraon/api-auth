/**
 * Middleware de gestion centralisée des erreurs
 * @module errorHandler
 */

/**
 * Gère les erreurs de l'application de manière centralisée
 * Convertit les erreurs en réponses JSON cohérentes pour un affichage personnalisé des erreurs
 * 
 * @param {Error} err - L'erreur à traiter
 * @param {import('express').Request} req - Requête Express
 * @param {import('express').Response} res - Réponse Express
 * @param {import('express').NextFunction} next - Fonction suivante
 * @returns {void}
 */

export const errorHandler = (error, req, res, next) => {
  const status = error.statusCode || 500;
  let message = error.message || "Une erreur est survenue";

  if (error.details) {
    message = `${message} ${error.details.join(" ")}`;
  }

  return res.status(status).json({ status, message });
};
