function logger(req, res, next) {
  const debut = Date.now();

  res.on("finish", () => {
    const ligne = {
      heure: new Date().toISOString(),
      methode: req.method,
      chemin: req.originalUrl,
      statut: res.statusCode,
      duree_ms: Date.now() - debut,
    };
    console.log(JSON.stringify(ligne));
  });

  next();
}

module.exports = logger;