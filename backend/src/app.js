const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const prisma = require("./config/prisma");

const authRoutes = require("./routes/authRoutes");
const missionRoutes = require("./routes/missionRoutes");
const disponibiliteRoutes = require("./routes/disponibiliteRoutes");

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);

app.use(express.json());

app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      statut: "ok",
      base_de_donnees: "connectee",
      heure: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      statut: "erreur",
      base_de_donnees: "deconnectee",
      heure: new Date().toISOString(),
    });
  }
});

if (process.env.NODE_ENV !== "test") {
  const limiteurAuth = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Trop de tentatives, reessayez dans 15 minutes" },
  });

  app.use("/api/auth", limiteurAuth);
}

app.use("/api/auth", authRoutes);
app.use("/api/missions", missionRoutes);
app.use("/api/disponibilites", disponibiliteRoutes);

module.exports = app;

//Un point important : tes tests Jest 
// appellent /api/auth/register et /api/auth/login 
// plusieurs fois de suite — si on limite trop 
// strictement, la CI va faire planter tes propres tests
// avec des erreurs 429. Solution simple :
// le rate limiting est désactivé automatiquement 
// en environnement de test (Jest définit NODE_ENV=test tout seul),
//  actif partout ailleurs (dev, prod).