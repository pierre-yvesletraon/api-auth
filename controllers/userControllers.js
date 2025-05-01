import { User } from "../models/User.js";
import {
  updateUserSchema,
  userIdSchema,
  userQuerySchema,
} from "../schemas/userSchemas.js";

/**
 * Récupère la liste de tous les utilisateurs
 * @async
 * @param {import('express').Request} req - Requête Express
 * @param {import('express').Response} res - Réponse Express
 * @throws {Error} Si l'utilisateur n'est pas admin
 * @returns {Promise<void>}
 */
export async function getAllUsers(req, res) {
  const { error } = userQuerySchema.validate(req.query);
  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = 400;
    throw err;
  }

  const users = await User.findAll({
    attributes: { exclude: ["password", "verificationToken"] },
  });
  res.json(users);
}

/**
 * Récupère les détails d'un utilisateur spécifique
 * @async
 * @param {import('express').Request} req - Requête Express avec l'ID en paramètre
 * @param {import('express').Response} res - Réponse Express
 * @throws {Error} Si l'utilisateur n'existe pas ou si l'accès est non autorisé
 * @returns {Promise<void>}
 */
export async function getUser(req, res) {
  const { error } = userIdSchema.validate(req.params);
  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = 400;
    throw err;
  }

  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ["password", "verificationToken"] },
  });

  if (!user) {
    const error = new Error("Utilisateur non trouvé");
    error.statusCode = 404;
    throw error;
  }

  res.json(user);
}

/**
 * Met à jour les informations d'un utilisateur
 * @async
 * @param {import('express').Request} req - Requête Express
 * @param {import('express').Response} res - Réponse Express
 * @throws {Error} Si l'utilisateur n'existe pas ou si les données sont invalides
 * @returns {Promise<void>}
 */
export async function updateUser(req, res) {
  const { error } = updateUserSchema.validate(req.body);
  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = 400;
    throw err;
  }

  const user = await User.findByPk(req.params.id);
  if (!user) {
    const error = new Error("Utilisateur non trouvé");
    error.statusCode = 404;
    throw error;
  }

  // Mise à jour uniquement des champs fournis
  const updates = {};
  const { firstName, lastName, email, role, isEmailVerified } = req.body;
  if (firstName !== undefined) updates.firstName = firstName;
  if (lastName !== undefined) updates.lastName = lastName;
  if (email !== undefined) {
    if (email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        const error = new Error("Cette adresse email est déjà utilisée");
        error.statusCode = 409;
        throw error;
      }
      updates.email = email;
    }
  }
  if (role !== undefined) updates.role = role;
  if (isEmailVerified !== undefined) updates.isEmailVerified = isEmailVerified;

  await user.update(updates);

  res.json({
    status: 200,
    message: "Utilisateur mis à jour avec succès",
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    },
  });
}

/**
 * Supprime un utilisateur
 * @async
 * @param {import('express').Request} req - Requête Express
 * @param {import('express').Response} res - Réponse Express
 * @throws {Error} Si l'utilisateur n'existe pas ou si l'accès est non autorisé
 * @returns {Promise<void>}
 */
export async function deleteUser(req, res) {
  const { error } = userIdSchema.validate(req.params);
  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = 400;
    throw err;
  }

  const user = await User.findByPk(req.params.id);

  if (!user) {
    const error = new Error("Utilisateur non trouvé");
    error.statusCode = 404;
    throw error;
  }

  await user.destroy();
  res.json({
    status: 200,
    message: "Utilisateur supprimé avec succès",
  });
}
