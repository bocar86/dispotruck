const prisma = require("../config/prisma");

async function voirMissionsDisponibles(req, res) {
  try {
    const missions = await prisma.mission.findMany({
      where: { statut: "en_attente" },
      orderBy: { date: "asc" },
    });

    res.json(missions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

async function repondreDisponibilite(req, res) {
  try {
    const chauffeurId = req.user.id;
    const { missionId, statut } = req.body;

    if (!missionId || !statut) {
      return res.status(400).json({ message: "missionId et statut sont obligatoires" });
    }

    if (statut !== "disponible" && statut !== "non_disponible") {
      return res.status(400).json({ message: "Statut invalide" });
    }

    const mission = await prisma.mission.findUnique({ where: { id: Number(missionId) } });

    if (!mission) {
      return res.status(404).json({ message: "Mission non trouvee" });
    }

    const disponibiliteExistante = await prisma.disponibilite.findFirst({
      where: { missionId: Number(missionId), chauffeurId: chauffeurId },
    });

    let disponibilite;

    if (disponibiliteExistante) {
      disponibilite = await prisma.disponibilite.update({
        where: { id: disponibiliteExistante.id },
        data: { statut: statut, dateReponse: new Date() },
      });
    } else {
      disponibilite = await prisma.disponibilite.create({
        data: {
          missionId: Number(missionId),
          chauffeurId: chauffeurId,
          statut: statut,
        },
      });
    }

    res.status(201).json(disponibilite);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

async function voirMesMissionsConfirmees(req, res) {
  try {
    const chauffeurId = req.user.id;

    const disponibilites = await prisma.disponibilite.findMany({
      where: { chauffeurId: chauffeurId, statut: "confirme" },
      include: { mission: true },
    });

    res.json(disponibilites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

async function voirChauffeursDisponibles(req, res) {
  try {
    const missionId = Number(req.params.missionId);
    const entrepriseId = req.user.id;

    const mission = await prisma.mission.findUnique({ where: { id: missionId } });

    if (!mission) {
      return res.status(404).json({ message: "Mission non trouvee" });
    }

    if (mission.entrepriseId !== entrepriseId) {
      return res.status(403).json({ message: "Acces refuse" });
    }

    const disponibilites = await prisma.disponibilite.findMany({
      where: { missionId: missionId, statut: "disponible" },
      include: { chauffeur: true },
    });

    res.json(disponibilites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

async function confirmerChauffeur(req, res) {
  try {
    const disponibiliteId = Number(req.params.id);
    const entrepriseId = req.user.id;

    const disponibilite = await prisma.disponibilite.findUnique({
      where: { id: disponibiliteId },
      include: { mission: true },
    });

    if (!disponibilite) {
      return res.status(404).json({ message: "Disponibilite non trouvee" });
    }

    if (disponibilite.mission.entrepriseId !== entrepriseId) {
      return res.status(403).json({ message: "Acces refuse" });
    }

    const disponibiliteConfirmee = await prisma.disponibilite.update({
      where: { id: disponibiliteId },
      data: { statut: "confirme" },
    });

    await prisma.mission.update({
      where: { id: disponibilite.missionId },
      data: { statut: "confirmee" },
    });

    res.json(disponibiliteConfirmee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

module.exports = {
  voirMissionsDisponibles,
  repondreDisponibilite,
  voirMesMissionsConfirmees,
  voirChauffeursDisponibles,
  confirmerChauffeur,
};