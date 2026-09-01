const prisma = require("../config/prisma");

async function creerMission(req, res) {
  try {
    const { titre, date, heure, lieu } = req.body;
    const entrepriseId = req.user.id;

    if (!titre || !date || !heure) {
      return res.status(400).json({ message: "Titre, date et heure sont obligatoires" });
    }

    const mission = await prisma.mission.create({
      data: {
        titre: titre,
        date: new Date(date),
        heure: new Date("1970-01-01T" + heure + ":00Z"),
        lieu: lieu,
        entrepriseId: entrepriseId,
      },
    });

    res.status(201).json(mission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

async function listerMissions(req, res) {
  try {
    const entrepriseId = req.user.id;

    const missions = await prisma.mission.findMany({
      where: { entrepriseId: entrepriseId },
      orderBy: { date: "asc" },
    });

    res.json(missions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

async function modifierMission(req, res) {
  try {
    const missionId = Number(req.params.id);
    const entrepriseId = req.user.id;
    const { titre, date, heure, lieu } = req.body;

    const mission = await prisma.mission.findUnique({ where: { id: missionId } });

    if (!mission) {
      return res.status(404).json({ message: "Mission non trouvee" });
    }

    if (mission.entrepriseId !== entrepriseId) {
      return res.status(403).json({ message: "Acces refuse" });
    }

    const donneesAMettreAJour = {};
    if (titre) {
      donneesAMettreAJour.titre = titre;
    }
    if (date) {
      donneesAMettreAJour.date = new Date(date);
    }
    if (heure) {
      donneesAMettreAJour.heure = donneesAMettreAJour.heure = new Date("1970-01-01T" + heure + ":00Z");
    }
    if (lieu) {
      donneesAMettreAJour.lieu = lieu;
    }

    const missionModifiee = await prisma.mission.update({
      where: { id: missionId },
      data: donneesAMettreAJour,
    });

    res.json(missionModifiee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

async function annulerMission(req, res) {
  try {
    const missionId = Number(req.params.id);
    const entrepriseId = req.user.id;

    const mission = await prisma.mission.findUnique({ where: { id: missionId } });

    if (!mission) {
      return res.status(404).json({ message: "Mission non trouvee" });
    }

    if (mission.entrepriseId !== entrepriseId) {
      return res.status(403).json({ message: "Acces refuse" });
    }

    const missionAnnulee = await prisma.mission.update({
      where: { id: missionId },
      data: { statut: "annulee" },
    });

    res.json(missionAnnulee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

module.exports = { creerMission, listerMissions, modifierMission, annulerMission };