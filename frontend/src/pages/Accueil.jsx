import { Link } from "react-router-dom";
import "./Accueil.css";

function Accueil() {
  return (
    <div className="accueil">
      <header className="accueil-header">
        <span className="logo">DispoTruck</span>
        <div className="header-buttons">
          <Link to="/auth" className="btn-outline">Connexion</Link>
          <Link to="/auth" className="btn-primary">Inscription</Link>
        </div>
      </header>

      <main className="accueil-main">
        <h1>La plateforme qui connecte les entreprises et les chauffeurs</h1>
        <p className="sous-titre">
          Plus besoin de chercher dans vos contacts a 5h du matin.
          DispoTruck vous met en relation instantanement.
        </p>

        <div className="choix-role">
          <Link to="/auth" className="carte-choix">Je suis une entreprise</Link>
          <Link to="/auth" className="carte-choix">Je suis un chauffeur</Link>
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