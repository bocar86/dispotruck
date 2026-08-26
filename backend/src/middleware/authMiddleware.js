const jwt = require("jsonwebtoken");

function verifierToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token manquant" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const donneesToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = donneesToken; // contient id et role
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide ou expire" });
  }
}

function verifierRole(roleAttendu) {
  return (req, res, next) => {
    if (req.user.role !== roleAttendu) {
      return res.status(403).json({ message: "Acces refuse" });
    }
    next();
  };
}

module.exports = { verifierToken, verifierRole };