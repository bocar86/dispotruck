require("dotenv").config();
const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/config/prisma");

const emailEntreprise = "test-entreprise-" + Date.now() + "@test.com";
const emailChauffeur = "test-chauffeur-" + Date.now() + "@test.com";
const motDePasse = "motdepasse123";

describe("Authentification", () => {
  afterAll(async () => {
    await prisma.entreprise.deleteMany({ where: { email: emailEntreprise } });
    await prisma.chauffeur.deleteMany({ where: { email: emailChauffeur } });
    await prisma.$disconnect();
  });

  test("A1 - inscription entreprise avec des donnees valides", async () => {
    const reponse = await request(app).post("/api/auth/register/entreprise").send({
      nom: "Entreprise Test",
      email: emailEntreprise,
      motDePasse: motDePasse,
      siret: "12345678900012",
      adresse: "1 rue de Test",
    });

    expect(reponse.statusCode).toBe(201);
  });

  test("A2 - inscription chauffeur avec des donnees valides", async () => {
    const reponse = await request(app).post("/api/auth/register/chauffeur").send({
      nom: "Test",
      prenom: "Chauffeur",
      email: emailChauffeur,
      motDePasse: motDePasse,
      telephone: "0600000000",
      numPermis: "123456",
      typePermis: "CE",
    });

    expect(reponse.statusCode).toBe(201);
  });

  test("A3 - inscription avec un email deja utilise", async () => {
    const reponse = await request(app).post("/api/auth/register/entreprise").send({
      nom: "Entreprise Test",
      email: emailEntreprise,
      motDePasse: motDePasse,
      siret: "12345678900012",
      adresse: "1 rue de Test",
    });

    expect(reponse.statusCode).toBeGreaterThanOrEqual(400);
  });

  test("A4 - connexion avec le bon email et le bon mot de passe", async () => {
    const reponse = await request(app).post("/api/auth/login").send({
      email: emailEntreprise,
      motDePasse: motDePasse,
      role: "entreprise",
    });

    expect(reponse.statusCode).toBe(200);
    expect(reponse.body.token).toBeDefined();
  });

  test("A5 - connexion avec un mauvais mot de passe", async () => {
    const reponse = await request(app).post("/api/auth/login").send({
      email: emailEntreprise,
      motDePasse: "mauvaismotdepasse",
      role: "entreprise",
    });

    expect(reponse.statusCode).toBe(401);
  });
});