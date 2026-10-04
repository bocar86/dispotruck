import { useState } from "react";
import { Link } from "react-router-dom";
import "./Accueil.css";
import logo from "../assets/logo-dispotruck.png";

function Accueil() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  function seDeconnecter() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
  }

  let lienDashboard = "/entreprise";
  if (role === "chauffeur") {
    lienDashboard = "/chauffeur";
  }

  let boutonsHeader = (
    <>
      <Link to="/auth?mode=connexion" className="btn-outline">Connexion</Link>
      <Link to="/auth?mode=inscription" className="btn-primary">Inscription</Link>
    </>
  );

  if (token) {
    boutonsHeader = (
      <>
        <Link to={lienDashboard} className="btn-outline">Mon espace</Link>
        <button onClick={seDeconnecter} className="btn-primary btn-deconnexion">
          Se deconnecter
        </button>
      </>
    );
  }

  return (
    <div className="accueil">
      <header className="accueil-header">
        <img src={logo} alt="DispoTruck" className="logo-img" />
        <div className="header-buttons">{boutonsHeader}</div>
      </header>

      <main className="accueil-main">
        <div className="hero-overlay">
          <h1>La plateforme qui connecte les entreprises et les chauffeurs</h1>
          <p className="sous-titre">
            Plus besoin de chercher dans vos contacts a 5h du matin.
            DispoTruck vous met en relation instantanement.
          </p>

          <div className="choix-role">
            <Link to="/auth?mode=inscription&role=entreprise" className="carte-choix">Je suis une entreprise</Link>
            <Link to="/auth?mode=inscription&role=chauffeur" className="carte-choix">Je suis un chauffeur</Link>
          </div>
        </div>

        <div className="fonctionnalites">
          <div className="fonctionnalite">
            <h3>Mission publiee</h3>
            <p>Le chef d'equipe publie une mission urgente</p>
          </div>
          <div className="fonctionnalite">
            <h3>Notification recue</h3>
            <p>Les chauffeurs disponibles sont alertes</p>
          </div>
          <div className="fonctionnalite">
            <h3>Mission confirmee</h3>
            <p>Le chef d'equipe confirme le chauffeur en un clic</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Accueil;