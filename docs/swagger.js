import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Qualiextra',
      version: '1.0.0',
      description: 'API de gestion des utilisateurs avec authentification et vérification email',
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000/api',
        description: 'Serveur de développement',
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{
      bearerAuth: [],
    }],
  },
  apis: [
    './middlewares/auth.js',
    './docs/routes.swagger.js',
  ],
};

export const specs = swaggerJsdoc(options);