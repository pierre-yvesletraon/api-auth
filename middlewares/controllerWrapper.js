/**
 * Wrapper pour la gestion des erreurs asynchrones dans les contrôleurs
 * @module controllerWrapper
 */

/**
 * Enveloppe une fonction middleware pour gérer les erreurs asynchrones
 * Évite d'utiliser try/catch dans chaque contrôleur
 * 
 * @param {Function} middlewareFunction - Fonction middleware/contrôleur à envelopper
 * @returns {import('express').RequestHandler} Middleware avec gestion d'erreurs
 * @example
 * router.post('/users', controllerWrapper(createUser));
 */

export default function controllerWrapper(middlewareFunction) {
  return async (req, res, next) => {
    try {
      await middlewareFunction(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
}
