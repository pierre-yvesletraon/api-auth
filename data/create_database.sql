BEGIN;

-- Suppression de la table Users si elle existe
DROP TABLE IF EXISTS "Users";

-- Suppression du type user_role si il existe
DROP TYPE IF EXISTS user_role;

-- Création de l'enum pour les rôles
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Création de la table Users
CREATE TABLE "Users" (
    id SERIAL PRIMARY KEY,
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'user',
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" VARCHAR(255) UNIQUE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Création d'un index sur l'email pour optimiser les recherches
CREATE INDEX IF NOT EXISTS users_email_idx ON "Users"(email);

COMMIT;