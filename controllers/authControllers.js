import { User } from "../models/User.js";
import { hash, compare, generateJwtToken } from "../utils/crypto.js";
import { sendVerificationEmail } from "../utils/emailService.js";
import { isDisposableEmail } from "../utils/emailValidator.js";
import { registerSchema, loginSchema, verifyEmailSchema } from "../schemas/authSchemas.js";
import crypto from "crypto";

/**
 * Inscription d'un nouvel utilisateur
 * @async
 * @param {import('express').Request} req - Requête Express
 * @param {Response} res - Réponse Express
 * @throws {Error} Si l'email existe déjà ou est invalide
 * @returns {Promise<void>}
 */
export async function register(req, res) {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: 400,
      message: error.details[0].message,
    });
  }

  const { firstName, lastName, email, password, role } = req.body;

  // Vérification des emails jetables/temporaires
  if (isDisposableEmail(email)) {
    return res.status(400).json({
      status: 400,
      message: "Les adresses email temporaires ne sont pas autorisées",
    });
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res.status(409).json({
      status: 409,
      message: "Cette adresse email est déjà utilisée",
    });
  }

  // Génère un token de vérification unique et crée un nouvel utilisateur avec les informations fournies, en attendant le hachage du mot de passe.
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: await hash(password),
    verificationToken,
    isEmailVerified: false,
    role,
  });

  // Envoi de l'email de vérification du nouvel utilisateur
  await sendVerificationEmail(email, verificationToken);

  res.status(201).json({
    status: 201,
    userId: user.id,
    message: "Un email de vérification a été envoyé à votre adresse",
  });
}

/**
 * Connexion d'un utilisateur
 * Génère un token JWT si les identifiants sont valides
 * @async
 * @param {Request} req - Requête Express
 * @param {Response} res - Réponse Express
 * @throws {Error} Si les identifiants sont invalides ou l'email non vérifié
 * @returns {Promise<void>}
 */
export async function login(req, res) {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: 400,
      message: error.details[0].message,
    });
  }

  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user || !(await compare(password, user.password))) {
    return res.status(401).json({
      status: 401,
      message: "Email ou mot de passe incorrect",
    });
  }

  // Vérification de l'email
  if (!user.isEmailVerified) {
    return res.status(403).json({
      status: 403,
      message: "Veuillez vérifier votre email avant de vous connecter",
    });
  }

  // Génération du token JWT
  const token = generateJwtToken(user);
  res.json({ token, expiresIn: "1d" });
}

/**
 * Vérification de l'email d'un utilisateur
 * @async
 * @param {Request} req - Requête Express avec token en paramètre
 * @param {Response} res - Réponse Express
 * @throws {Error} Si le token est invalide ou expiré
 * @returns {Promise<void>}
 */
export async function verifyEmail(req, res) {
  // Validation du token avec Joi
  const { error } = verifyEmailSchema.validate(req.params);
  if (error) {
    return res.status(400).json({
      status: 400,
      message: error.details[0].message,
    });
  }

  const { token } = req.params;

  // Recherche de l'utilisateur avec le token
  const user = await User.findOne({ where: { verificationToken: token } });
  if (!user) {
    return res.status(404).json({
      status: 404,
      message: "Token de vérification invalide",
    });
  }

  // Mise à jour du statut de vérification
  user.isEmailVerified = true;
  user.verificationToken = null;
  await user.save();

  // Réponse succès
  return res.json({
    status: 200,
    message: "Email vérifié avec succès",
  });
}
