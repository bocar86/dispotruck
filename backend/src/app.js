const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const missionRoutes = require("./routes/missionRoutes");
const disponibiliteRoutes = require("./routes/disponibiliteRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/missions", missionRoutes);
app.use("/api/disponibilites", disponibiliteRoutes);

app.get("/api/test", (req, res) => {
  res.json({ status: "ok" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route non trouvee" });
});

module.exports = app;