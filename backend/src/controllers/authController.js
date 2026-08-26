const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

const SALT_ROUNDS = 10;

async function registerEntreprise(req, res) {
  try {
    const { nom, email, motDePasse, siret, adresse } = req.body;

    if (!nom || !email || !motDePasse) {
      return res.status(400).json({ message: "Nom, email et mot de passe sont obligatoires" });
    }

    const existant = await prisma.entreprise.findUnique({ where: { email } });
    if (existant) {
      return res.status(409).json({ message: "Un compte existe deja avec cet email" });
    }

    const motDePasseHash = await bcrypt.hash(motDePasse, SALT_ROUNDS);

    const entreprise = await prisma.entreprise.create({
      data: { nom, email, motDePasse: motDePasseHash, siret, adresse },
    });

    res.status(201).json({
      id: entreprise.id,
      nom: entreprise.nom,
      email: entreprise.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

async function registerChauffeur(req, res) {
  try {
    const { nom, prenom, email, motDePasse, telephone, numPermis, typePermis } = req.body;

    if (!nom || !prenom || !email || !motDePasse) {
      return res.status(400).json({ message: "Nom, prenom, email et mot de passe sont obligatoires" });
    }

    const existant = await prisma.chauffeur.findUnique({ where: { email } });
    if (existant) {
      return res.status(409).json({ message: "Un compte existe deja avec cet email" });
    }

    const motDePasseHash = await bcrypt.hash(motDePasse, SALT_ROUNDS);

    const chauffeur = await prisma.chauffeur.create({
      data: {
        nom,
        prenom,
        email,
        motDePasse: motDePasseHash,
        telephone,
        numPermis,
        typePermis,
      },
    });

    res.status(201).json({
      id: chauffeur.id,
      nom: chauffeur.nom,
      prenom: chauffeur.prenom,
      email: chauffeur.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

async function login(req, res) {
  try {
    const { email, motDePasse, role } = req.body;

    if (!email || !motDePasse || !role) {
      return res.status(400).json({ message: "Email, mot de passe et role sont obligatoires" });
    }

    if (role !== "entreprise" && role !== "chauffeur") {
      return res.status(400).json({ message: "Role invalide" });
    }

    let utilisateur;

    if (role === "entreprise") {
      utilisateur = await prisma.entreprise.findUnique({ where: { email } });
    } else {
      utilisateur = await prisma.chauffeur.findUnique({ where: { email } });
    }

    if (!utilisateur) {
      return res.status(401).json({ message: "Identifiants incorrects" });
    }

    const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
    if (!motDePasseValide) {
      return res.status(401).json({ message: "Identifiants incorrects" });
    }

    const token = jwt.sign(
      { id: utilisateur.id, role: role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token: token,
      role: role,
      id: utilisateur.id,
      nom: utilisateur.nom,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

module.exports = { registerEntreprise, registerChauffeur, login };