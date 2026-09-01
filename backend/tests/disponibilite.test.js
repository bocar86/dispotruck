require("dotenv").config();
const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/config/prisma");

const emailEntreprise = "test-dispo-entreprise-" + Date.now() + "@test.com";
const emailChauffeur = "test-dispo-chauffeur-" + Date.now() + "@test.com";
const motDePasse = "motdepasse123";

let tokenEntreprise = "";
let tokenChauffeur = "";
let missionId = null;
let disponibiliteId = null;

describe("Disponibilites", () => {
  beforeAll(async () => {
    await request(app).post("/api/auth/register/entreprise").send({
      nom: "Entreprise Dispo Test",
      email: emailEntreprise,
      motDePasse: motDePasse,
      siret: "12345678900012",
      adresse: "1 rue de Test",
    });

    await request(app).post("/api/auth/register/chauffeur").send({
      nom: "Test",
      prenom: "Chauffeur",
      email: emailChauffeur,
      motDePasse: motDePasse,
      telephone: "0600000000",
      numPermis: "123456",
      typePermis: "CE",
    });

    const reponseLoginEntreprise = await request(app).post("/api/auth/login").send({
      email: emailEntreprise,
      motDePasse: motDePasse,
      role: "entreprise",
    });
    tokenEntreprise = reponseLoginEntreprise.body.token;

    const reponseLoginChauffeur = await request(app).post("/api/auth/login").send({
      email: emailChauffeur,
      motDePasse: motDePasse,
      role: "chauffeur",
    });
    tokenChauffeur = reponseLoginChauffeur.body.token;

    const reponseMission = await request(app)
      .post("/api/missions")
      .set("Authorization", "Bearer " + tokenEntreprise)
      .send({
        titre: "Mission dispo test",
        date: "2026-12-01",
        heure: "08:00",
        lieu: "Lyon",
      });
    missionId = reponseMission.body.id;
  });

  afterAll(async () => {
    const entreprise = await prisma.entreprise.findUnique({ where: { email: emailEntreprise } });
    const chauffeur = await prisma.chauffeur.findUnique({ where: { email: emailChauffeur } });

    if (chauffeur) {
      await prisma.disponibilite.deleteMany({ where: { chauffeurId: chauffeur.id } });
      await prisma.chauffeur.delete({ where: { id: chauffeur.id } });
    }

    if (entreprise) {
      await prisma.mission.deleteMany({ where: { entrepriseId: entreprise.id } });
      await prisma.entreprise.delete({ where: { id: entreprise.id } });
    }

    await prisma.$disconnect();
  });

  test("D1 - voir les missions disponibles (chauffeur)", async () => {
    const reponse = await request(app)
      .get("/api/disponibilites/missions")
      .set("Authorization", "Bearer " + tokenChauffeur);

    expect(reponse.statusCode).toBe(200);
    expect(Array.isArray(reponse.body)).toBe(true);
  });

  test("D2 - repondre disponible a une mission", async () => {
    const reponse = await request(app)
      .post("/api/disponibilites")
      .set("Authorization", "Bearer " + tokenChauffeur)
      .send({ missionId: missionId, statut: "disponible" });

    expect(reponse.statusCode).toBe(201);
    disponibiliteId = reponse.body.id;
  });

  test("D3 - entreprise confirme un chauffeur", async () => {
    const reponse = await request(app)
      .put("/api/disponibilites/" + disponibiliteId + "/confirmer")
      .set("Authorization", "Bearer " + tokenEntreprise);

    expect(reponse.statusCode).toBe(200);
    expect(reponse.body.statut).toBe("confirme");
  });

  test("D4 - chauffeur voit la mission dans ses missions confirmees", async () => {
    const reponse = await request(app)
      .get("/api/disponibilites/mes-missions")
      .set("Authorization", "Bearer " + tokenChauffeur);

    expect(reponse.statusCode).toBe(200);
    const missionsIds = reponse.body.map((d) => d.missionId);
    expect(missionsIds).toContain(missionId);
  });
});