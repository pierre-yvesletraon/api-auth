import rateLimit from "express-rate-limit";

/**
 * Configuration du rate limiting pour prévenir les attaques par force brute
 * @module rateLimiter
 */

/**
 * Middleware de limitation de requêtes pour les routes d'authentification
 * @type {import('express-rate-limit').RateLimit}
 */

// Limiteur global pour toutes les routes
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limite à 50 requêtes par fenêtre par IP (pou les besoins des tests, sinon limiter à 5 ou 10, par exemple)
  message: {
    status: 429,
    message: "Trop de requêtes, veuillez réessayer dans 15 minutes",
  },
});

// Limiteur spécifique pour les routes d'authentification
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    status: 429,
    message:
      "Trop de tentatives de connexion, veuillez réessayer dans 15 minutes",
  },
});
