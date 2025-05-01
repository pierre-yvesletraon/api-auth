import { User } from "../models/User.js";

// Renvoie un message de bienvenue avec le prénom de l'utilisateur
export async function getPrivateHello(req, res) {
  const user = await User.findByPk(req.user.userId);

  if (!user) {
    const error = new Error("Utilisateur non trouvé");
    error.statusCode = 404;
    throw error;
  }

  res.json({ message: `Hello ${user.firstName}` });
}
