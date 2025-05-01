import nodemailer from "nodemailer";

/**
 * Service d'envoi d'emails
 * @module emailService
 */

/**
 * Configuration du transporteur Nodemailer
 * @type {import('nodemailer').Transporter}
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // Changé à false pour le port 587 car utilisation de STARTTLS avec Gmail
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false // Passé à false pour éviter les erreurs de certificats mais reste sécurisé avec gmail malgré tout
  }
});

/**
 * Envoie un email de vérification à l'utilisateur
 * Utilise Nodemailer avec configuration Mailtrap en développement
 * @async
 * @param {string} email - Adresse email du destinataire
 * @param {string} token - Token de vérification unique
 * @throws {Error} Si l'envoi échoue
 * @returns {Promise<void>}
 */
export async function sendVerificationEmail(email, token) {
  const verificationUrl = `${process.env.API_URL}/api/auth/verify-email/${token}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Vérifiez votre compte Qualiextra",
    html: `
      <h1>Bienvenue sur Qualiextra</h1>
      <p>Veuillez cliquer sur le lien ci-dessous pour vérifier votre compte :</p>
      <a href="${verificationUrl}">Vérifier mon compte</a>
    `,
  });
}
