require("dotenv").config();
const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/config/prisma");

const emailEntreprise = "test-mission-entreprise-" + Date.now() + "@test.com";
const motDePasse = "motdepasse123";

let token = "";
let missionId = null;

describe("Missions", () => {
  beforeAll(async () => {
    await request(app).post("/api/auth/register/entreprise").send({
      nom: "Entreprise Mission Test",
      email: emailEntreprise,
      motDePasse: motDePasse,
      siret: "12345678900012",
      adresse: "1 rue de Test",
    });

    const reponseLogin = await request(app).post("/api/auth/login").send({
      email: emailEntreprise,
      motDePasse: motDePasse,
      role: "entreprise",
    });

    token = reponseLogin.body.token;
  });

  afterAll(async () => {
    const entreprise = await prisma.entreprise.findUnique({ where: { email: emailEntreprise } });

    if (entreprise) {
      await prisma.mission.deleteMany({ where: { entrepriseId: entreprise.id } });
      await prisma.entreprise.delete({ where: { id: entreprise.id } });
    }

    await prisma.$disconnect();
  });

  test("M1 - creer une mission avec un token entreprise valide", async () => {
    const reponse = await request(app)
      .post("/api/missions")
      .set("Authorization", "Bearer " + token)
      .send({
        titre: "Mission de test",
        date: "2026-12-01",
        heure: "08:00",
        lieu: "Paris",
      });

    expect(reponse.statusCode).toBe(201);
    missionId = reponse.body.id;
  });

  test("M2 - creer une mission sans token", async () => {
    const reponse = await request(app).post("/api/missions").send({
      titre: "Mission sans token",
      date: "2026-12-01",
      heure: "08:00",
      lieu: "Paris",
    });

    expect(reponse.statusCode).toBe(401);
  });

  test("M3 - lister ses missions", async () => {
    const reponse = await request(app)
      .get("/api/missions")
      .set("Authorization", "Bearer " + token);

    expect(reponse.statusCode).toBe(200);
    expect(Array.isArray(reponse.body)).toBe(true);
  });

  test("M4 - annuler une mission", async () => {
    const reponse = await request(app)
      .delete("/api/missions/" + missionId)
      .set("Authorization", "Bearer " + token);

    expect(reponse.statusCode).toBe(200);
    expect(reponse.body.statut).toBe("annulee");
  });
});