import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ChauffeurDashboard.css";

function ChauffeurDashboard() {
  const navigate = useNavigate();

  const [missionsDisponibles, setMissionsDisponibles] = useState([]);
  const [missionsConfirmees, setMissionsConfirmees] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [missionsRepondues, setMissionsRepondues] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "chauffeur") {
      navigate("/auth");
      return;
    }

    chargerDonnees();
  }, []);

  async function chargerDonnees() {
    const token = localStorage.getItem("token");

    try {
      const reponseMissions = await fetch("http://localhost:3000/api/disponibilites/missions", {
        headers: { Authorization: "Bearer " + token },
      });
      const donneesMissions = await reponseMissions.json();

      const reponseConfirmees = await fetch("http://localhost:3000/api/disponibilites/mes-missions", {
        headers: { Authorization: "Bearer " + token },
      });
      const donneesConfirmees = await reponseConfirmees.json();

      if (!reponseMissions.ok || !reponseConfirmees.ok) {
        setErreur("Impossible de charger les missions");
        setChargement(false);
        return;
      }

      setMissionsDisponibles(donneesMissions);
      setMissionsConfirmees(donneesConfirmees);
      setChargement(false);
    } catch (error) {
      setErreur("Impossible de contacter le serveur");
      setChargement(false);
    }
  }

  async function gererReponse(missionId, statut) {
    const token = localStorage.getItem("token");

    try {
      const reponse = await fetch("http://localhost:3000/api/disponibilites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ missionId: missionId, statut: statut }),
      });

      if (!reponse.ok) {
        setErreur("Erreur lors de l'envoi de la reponse");
        return;
      }

      const nouvellesReponses = missionsRepondues.concat(missionId);
      setMissionsRepondues(nouvellesReponses);
    } catch (error) {
      setErreur("Impossible de contacter le serveur");
    }
  }

  function seDeconnecter() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  }

  let contenuMissionsDisponibles = null;
  if (chargement) {
    contenuMissionsDisponibles = <p>Chargement...</p>;
  } else if (missionsDisponibles.length === 0) {
    contenuMissionsDisponibles = <p>Aucune mission disponible pour le moment</p>;
  } else {
    contenuMissionsDisponibles = (
      <table className="missions-table">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Date</th>
            <th>Heure</th>
            <th>Lieu</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {missionsDisponibles.map((mission) => {
            let boutons = (
              <>
                <button
                  onClick={() => gererReponse(mission.id, "disponible")}
                  className="bouton-disponible"
                >
                  Disponible
                </button>
                <button
                  onClick={() => gererReponse(mission.id, "non_disponible")}
                  className="bouton-non-disponible"
                >
                  Non disponible
                </button>
              </>
            );

            if (missionsRepondues.includes(mission.id)) {
              boutons = <span className="reponse-envoyee">Reponse envoyee</span>;
            }

            return (
              <tr key={mission.id}>
                <td>{mission.titre}</td>
                <td>{mission.date.slice(0, 10)}</td>
                <td>{mission.heure.slice(11, 16)}</td>
                <td>{mission.lieu}</td>
                <td>{boutons}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  let contenuMissionsConfirmees = null;
  if (chargement) {
    contenuMissionsConfirmees = <p>Chargement...</p>;
  } else if (missionsConfirmees.length === 0) {
    contenuMissionsConfirmees = <p>Aucune mission confirmee pour le moment</p>;
  } else {
    contenuMissionsConfirmees = (
      <table className="missions-table">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Date</th>
            <th>Heure</th>
            <th>Lieu</th>
          </tr>
        </thead>
        <tbody>
          {missionsConfirmees.map((disponibilite) => (
            <tr key={disponibilite.id}>
              <td>{disponibilite.mission.titre}</td>
              <td>{disponibilite.mission.date.slice(0, 10)}</td>
              <td>{disponibilite.mission.heure.slice(11, 16)}</td>
              <td>{disponibilite.mission.lieu}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  let messageErreur = null;
  if (erreur !== "") {
    messageErreur = <p className="dashboard-erreur">{erreur}</p>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <span className="logo">DispoTruck</span>
        <button onClick={seDeconnecter} className="bouton-deconnexion">
          Se deconnecter
        </button>
      </header>

      <div className="dashboard-contenu">
        {messageErreur}

        <div className="dashboard-carte">
          <h2>Missions disponibles</h2>
          {contenuMissionsDisponibles}
        </div>

        <div className="dashboard-carte">
          <h2>Mes missions confirmees</h2>
          {contenuMissionsConfirmees}
        </div>
      </div>
    </div>
  );
}

export default ChauffeurDashboard;