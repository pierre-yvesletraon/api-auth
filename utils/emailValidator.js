import { createRequire } from "module";
const require = createRequire(import.meta.url);
const disposableEmails = require("disposable-email-domains");

/**
 * Vérifie si une adresse email provient d'un service d'emails jetables
 * @param {string} email - Adresse email à vérifier
 * @returns {boolean} True si l'email est jetable
 */
export function isDisposableEmail(email) {
  if (!email || !email.includes("@")) {
    throw new Error("Format d'email invalide");
  }

  const domain = email.split("@")[1].toLowerCase();
  return (
    disposableEmails.includes(domain) || DISPOSABLE_DOMAINS.includes(domain)
  );
}

/**
 * Liste des domaines d'emails temporaires connus codée en dur
 * @type {string[]}
 */
export const DISPOSABLE_DOMAINS = [
  "tempmail.com",
  "mailinator.com",
  "temp-mail.org",
  "guerrillamail.com",
];
