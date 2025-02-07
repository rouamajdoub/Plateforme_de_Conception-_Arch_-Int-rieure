const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10; // Nombre d'itérations pour sécuriser le hash

// Fonction pour hacher un mot de passe
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return await bcrypt.hash(password, salt);
}

// Fonction pour comparer un mot de passe avec un hash
async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

module.exports = { hashPassword, comparePassword };
