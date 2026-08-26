const express = require("express");
const router = express.Router();

const disponibiliteController = require("../controllers/disponibiliteController");
const { verifierToken, verifierRole } = require("../middleware/authMiddleware");

router.get("/missions", verifierToken, verifierRole("chauffeur"), disponibiliteController.voirMissionsDisponibles);
router.post("/", verifierToken, verifierRole("chauffeur"), disponibiliteController.repondreDisponibilite);
router.get("/mes-missions", verifierToken, verifierRole("chauffeur"), disponibiliteController.voirMesMissionsConfirmees);

router.get("/mission/:missionId", verifierToken, verifierRole("entreprise"), disponibiliteController.voirChauffeursDisponibles);
router.put("/:id/confirmer", verifierToken, verifierRole("entreprise"), disponibiliteController.confirmerChauffeur);

module.exports = router;