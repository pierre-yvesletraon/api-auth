# API d'Authentification Qualiextra

API REST pour la gestion des utilisateurs, l'authentification (inscription, connexion, vérification email, réinitialisation de mot de passe) construite avec Node.js, Express, Sequelize et PostgreSQL.

## Prérequis

- Node.js (v22 ou supérieur recommandé)
- npm (généralement inclus avec Node.js)
- PostgreSQL (une instance locale est nécessaire pour le développement)

## Installation

1. Clonez le dépôt (si ce n'est pas déjà fait) :
   <https://github.com/pierre-yvesletraon/api-auth>

2. Installez les dépendances du projet :
   npm install

## Configuration

L'application utilise des variables d'environnement pour sa configuration.

1. Créez un fichier `.env` à la racine du projet en copiant l'exemple.

2. Modifiez le fichier `.env` nouvellement créé pour y mettre vos propres valeurs :

- **`DATABASE_URL`** : L'URL de connexion complète à votre base de données PostgreSQL.
  - *Pour le développement local* : Utilisez les informations de votre instance PostgreSQL locale (ex : `postgresql://VOTRE_USER:VOTRE_PASS@localhost:5432/qualiextra_dev`). Assurez-vous que la base de données existe.
  - *Pour la production (par exmple avec Railway)* : Cette variable est généralement fournie par la plateforme d'hébergement et pointe vers la base de données de production.

- **`JWT_SECRET`** : Une chaîne de caractères secrète, longue et aléatoire. Elle est **cruciale** pour la sécurité de l'authentification JWT.

- **`SMTP_HOST`** : L'adresse de votre serveur d'envoi d'emails (SMTP). (ex : `smtp.gmail.com`, `smtp.sendgrid.net`)
- **`SMTP_PORT`** : Le port utilisé par votre serveur SMTP (ex : `587` pour TLS, `465` pour SSL)
- **`SMTP_USER`** : Le nom d'utilisateur pour vous connecter à votre serveur SMTP (souvent votre adresse email)
- **`SMTP_PASSWORD`** : Le mot de passe associé à votre utilisateur SMTP.
  - *Attention* : Si vous utilisez Gmail avec l'authentification à deux facteurs (2FA), vous devrez générer un "Mot de passe d'application" spécifique pour cette application. N'utilisez pas votre mot de passe Gmail principal ici.
- **`SMTP_FROM`** : L'adresse email qui apparaîtra comme expéditeur des emails envoyés par l'application (ex : `noreply@votredomaine.com`). Elle doit souvent être une adresse vérifiée ou correspondre à `SMTP_USER`.

- **`API_URL`** : L'URL de base publique où votre API sera accessible.
  - *Pour le développement local* : `http://localhost:3000` (ou le port configuré)
  - *Pour la production* : L'URL fournie par votre hébergeur (ex : `https://api-auth-production-xxxx.up.railway.app`)
  - Cette URL est utilisée par Swagger UI et peut être utilisée pour construire des liens dans les emails (vérification, réinitialisation de mot de passe).

- **`ALLOWED_ORIGINS`** : L'URL de l'application frontend qui est autorisée à envoyer des requêtes à cette API (configuration CORS).
  - *Pour le développement local (si test via Swagger UI uniquement)* : `http://localhost:3000`
  - *Pour la production (si test via Swagger UI uniquement)* : La même valeur que `API_URL`
  - *Si vous avez un frontend séparé* : L'URL de ce frontend (ex : `https://mon-frontend.com`)

- **`NODE_ENV`** : Définit l'environnement d'exécution. Mettre `development` pour le développement local et `production` lors du déploiement.

## Configuration de la Base de Données (Développement Local)

1. Assurez-vous que votre serveur PostgreSQL local est démarré.
2. Créez manuellement la base de données spécifiée dans `DATABASE_URL` si elle n'existe pas.
3. Exécutez la commande suivante pour supprimer les tables existantes (si elles existent), les recréer et insérer les données initiales (seed) :
npm run db:reset

Cette commande utilise les scripts SQL situés dans le dossier `data`.

## Lancer l'Application

- **Mode Développement**  
Utilise `node --watch index.js` pour redémarrer automatiquement le serveur lors de modifications de fichiers:
npm run dev

Le serveur écoutera généralement sur le port 3000 ([http://localhost:3000](http://localhost:3000)).

- **Mode Production**  
Lance l'application avec Node.js directement. Assurez-vous que `NODE_ENV=production` est défini:
npm start

Le port d'écoute en production est souvent défini par la variable d'environnement `PORT` fournie par la plateforme d'hébergement.

## Documentation de l'API (Swagger UI)

Une fois l'application lancée, vous pouvez accéder à la documentation interactive de l'API via Swagger UI :

- **En local** : [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- **En production** : Accédez à `<API_URL>/api-docs` (où `<API_URL>` est l'URL de base de votre API déployée).

Swagger UI vous permet de visualiser tous les endpoints, leurs paramètres, et de les tester directement depuis votre navigateur.

## Déploiement (Exemple avec Railway)

1. **Ne commitez jamais votre fichier `.env` contenant des secrets.** Utilisez le fichier `.env.example` comme référence.
2. Configurez toutes les variables d'environnement requises (listées dans la section Configuration) directement dans l'interface "Variables" de votre service sur Railway.

- Railway fournira automatiquement la variable `DATABASE_URL` si vous avez lié un service de base de données PostgreSQL à votre application.
- Assurez-vous de définir `JWT_SECRET` avec une clé forte.
- Configurez les variables `SMTP_*` avec vos identifiants de production.
- Définissez `API_URL` et `ALLOWED_ORIGINS` avec l'URL publique générée par Railway pour votre service (ex : `https://api-auth-production-xxxx.up.railway.app`).
- Assurez-vous que `NODE_ENV` est défini sur `production`.

Railway détectera votre `package.json` et exécutera `npm install` (ou équivalent) suivi de `npm start` pour lancer votre application.

---
