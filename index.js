import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import { router } from "./router.js";
import { sequelize, testDatabaseConnection } from "./config/database.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundMiddleware } from "./middlewares/notFoundMiddleware.js";
import { xss } from "express-xss-sanitizer";
import { globalLimiter } from "./middlewares/rateLimiter.js";
import swaggerUi from 'swagger-ui-express';
import { specs } from './docs/swagger.js';

// Chargement des variables d'environnement
dotenv.config();

// Express app
const app = express();

// Sécurité des en-têtes HTTP
app.use(helmet());

// Rate Limiter global
app.use(globalLimiter);

/**
 * Configuration CORS
 * Autorise les requêtes depuis des origines spécifiques en fonction de l'environnement (développement ou production)
 */
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGINS 
    : /^(http:\/\/localhost:\d+|http:\/\/127\.0\.0\.1:\d+)$/,
  credentials: true
}));

// Body parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Protection contre les attaques XSS
app.use(xss());

// Route Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// API routes
app.use("/api", router);

// Middleware de gestion des routes non trouvées
app.use(notFoundMiddleware);

// Middleware de gestion des erreurs
app.use(errorHandler);

// Tester la connexion au démarrage
await testDatabaseConnection();

// Synchroniser les modèles avec la base de données
await sequelize.sync();

// Serveur HTTP
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:3000`);
});
