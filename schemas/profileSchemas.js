import Joi from "joi";

// Schéma de validation pour la mise à jour du profil utilisateur
export const updateProfileSchema = Joi.object({
  firstName: Joi.string().min(2).max(50),
  lastName: Joi.string().min(2).max(50),
  email: Joi.string().email(),
}).min(1); // Au moins un champ doit être fourni
