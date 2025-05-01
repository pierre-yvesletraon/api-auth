import { User } from "../models/User.js";
import { updateProfileSchema } from "../schemas/profileSchemas.js";

// Récupère le profil de l'utilisateur connecté
export async function getProfile(req, res) {
  const user = await User.findByPk(req.user.userId, {
    attributes: { exclude: ["password", "verificationToken"] },
  });

  if (!user) {
    const error = new Error("Utilisateur non trouvé");
    error.statusCode = 404;
    throw error;
  }

  res.json(user);
}

// Met à jour le profil de l'utilisateur connecté
export async function updateProfile(req, res) {
  // Validation des données par rapport au schéma du profil
  const { error } = updateProfileSchema.validate(req.body);
  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = 400;
    throw err;
  }

  // Récupération de l'utilisateur avec userId du token
  const user = await User.findByPk(req.user.userId);

  if (!user) {
    const error = new Error("Utilisateur non trouvé");
    error.statusCode = 404;
    throw error;
  }

  // Mise à jour uniquement des champs fournis
  const { firstName, lastName, email } = req.body;
  const updates = {};
  if (firstName !== undefined) updates.firstName = firstName;
  if (lastName !== undefined) updates.lastName = lastName;
  if (email !== undefined) {
    // Vérifier si l'email n'est pas déjà utilisé
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

  // Sauvegarde des modifications
  await user.update(updates);

  // Réponse en cas de succès
  res.json({
    status: 200,
    message: "Profil mis à jour avec succès",
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  });
}
