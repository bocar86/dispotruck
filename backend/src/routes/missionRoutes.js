const express = require("express");
const router = express.Router();

const missionController = require("../controllers/missionController");
const { verifierToken, verifierRole } = require("../middleware/authMiddleware");

router.post("/", verifierToken, verifierRole("entreprise"), missionController.creerMission);
router.get("/", verifierToken, verifierRole("entreprise"), missionController.listerMissions);
router.put("/:id", verifierToken, verifierRole("entreprise"), missionController.modifierMission);
router.delete("/:id", verifierToken, verifierRole("entreprise"), missionController.annulerMission);

module.exports = router;