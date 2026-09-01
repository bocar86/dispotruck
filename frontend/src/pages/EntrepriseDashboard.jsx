import { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import "./EntrepriseDashboard.css";

function EntrepriseDashboard() {
  const navigate = useNavigate();

  const [missions, setMissions] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  const [titre, setTitre] = useState("");
  const [date, setDate] = useState("");
  const [heure, setHeure] = useState("");
  const [lieu, setLieu] = useState("");

  const [missionOuverte, setMissionOuverte] = useState(null);
  const [chauffeursDisponibles, setChauffeursDisponibles] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "entreprise") {
      navigate("/auth");
      return;
    }

    chargerMissions();
  }, []);

  async function chargerMissions() {
    const token = localStorage.getItem("token");

    try {
      const reponse = await fetch("http://localhost:3000/api/missions", {
        headers: { Authorization: "Bearer " + token },
      });

      const donnees = await reponse.json();

      if (!reponse.ok) {
        setErreur(donnees.message);
        setChargement(false);
        return;
      }

      setMissions(donnees);
      setChargement(false);
    } catch (error) {
      setErreur("Impossible de contacter le serveur");
      setChargement(false);
    }
  }

  async function gererCreation(event) {
    event.preventDefault();
    setErreur("");
    const token = localStorage.getItem("token");

    try {
      const reponse = await fetch("http://localhost:3000/api/missions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ titre: titre, date: date, heure: heure, lieu: lieu }),
      });

      const donnees = await reponse.json();

      if (!reponse.ok) {
        setErreur(donnees.message);
        return;
      }

      setTitre("");
      setDate("");
      setHeure("");
      setLieu("");
      chargerMissions();
    } catch (error) {
      setErreur("Impossible de contacter le serveur");
    }
  }

  async function gererAnnulation(id) {
    const token = localStorage.getItem("token");

    try {
      const reponse = await fetch("http://localhost:3000/api/missions/" + id, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });

      if (!reponse.ok) {
        return;
      }

      chargerMissions();
    } catch (error) {
      setErreur("Impossible de contacter le serveur");
    }
  }

  async function voirChauffeurs(missionId) {
    const token = localStorage.getItem("token");

    if (missionOuverte === missionId) {
      setMissionOuverte(null);
      return;
    }

    try {
      const reponse = await fetch("http://localhost:3000/api/disponibilites/mission/" + missionId, {
        headers: { Authorization: "Bearer " + token },
      });

      const donnees = await reponse.json();

      if (!reponse.ok) {
        setErreur(donnees.message);
        return;
      }

      setChauffeursDisponibles(donnees);
      setMissionOuverte(missionId);
    } catch (error) {
      setErreur("Impossible de contacter le serveur");
    }
  }

  async function gererConfirmation(disponibiliteId) {
    const token = localStorage.getItem("token");

    try {
      const reponse = await fetch(
        "http://localhost:3000/api/disponibilites/" + disponibiliteId + "/confirmer",
        {
          method: "PUT",
          headers: { Authorization: "Bearer " + token },
        }
      );

      if (!reponse.ok) {
        setErreur("Erreur lors de la confirmation");
        return;
      }

      setMissionOuverte(null);
      chargerMissions();
    } catch (error) {
      setErreur("Impossible de contacter le serveur");
    }
  }

  function seDeconnecter() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  }

  let contenuListe = null;
  if (chargement) {
    contenuListe = <p>Chargement...</p>;
  } else if (missions.length === 0) {
    contenuListe = <p>Aucune mission pour le moment</p>;
  } else {
    contenuListe = (
      <table className="missions-table">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Date</th>
            <th>Heure</th>
            <th>Lieu</th>
            <th>Statut</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {missions.map((mission) => {
            let boutonChauffeurs = null;
            if (mission.statut === "en_attente") {
              boutonChauffeurs = (
                <button onClick={() => voirChauffeurs(mission.id)} className="bouton-voir">
                  Voir chauffeurs disponibles
                </button>
              );
            }

            let panneauChauffeurs = null;
            if (missionOuverte === mission.id) {
              let contenuPanneau = null;

              if (chauffeursDisponibles.length === 0) {
                contenuPanneau = <p>Aucun chauffeur disponible pour l'instant</p>;
              } else {
                contenuPanneau = (
                  <ul className="chauffeurs-liste">
                    {chauffeursDisponibles.map((disponibilite) => (
                      <li key={disponibilite.id}>
                        {disponibilite.chauffeur.prenom} {disponibilite.chauffeur.nom} —{" "}
                        {disponibilite.chauffeur.telephone}
                        <button
                          onClick={() => gererConfirmation(disponibilite.id)}
                          className="bouton-confirmer"
                        >
                          Confirmer
                        </button>
                      </li>
                    ))}
                  </ul>
                );
              }

              panneauChauffeurs = (
                <tr>
                  <td colSpan="6">{contenuPanneau}</td>
                </tr>
              );
            }

            return (
              <Fragment key={mission.id}>
                <tr>
                  <td>{mission.titre}</td>
                  <td>{mission.date.slice(0, 10)}</td>
                  <td>{mission.heure.slice(11, 16)}</td>
                  <td>{mission.lieu}</td>
                  <td>{mission.statut}</td>
                  <td>
                    {boutonChauffeurs}
                    <button onClick={() => gererAnnulation(mission.id)} className="bouton-annuler">
                      Annuler
                    </button>
                  </td>
                </tr>
                {panneauChauffeurs}
              </Fragment>
            );
          })}
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
        <div className="dashboard-carte">
          <h2>Publier une mission</h2>
          <form onSubmit={gererCreation} className="mission-form">
            <input
              type="text"
              placeholder="Titre de la mission"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
            />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <input type="time" value={heure} onChange={(e) => setHeure(e.target.value)} />
            <input
              type="text"
              placeholder="Lieu"
              value={lieu}
              onChange={(e) => setLieu(e.target.value)}
            />
            {messageErreur}
            <button type="submit" className="bouton-publier">
              Publier la mission
            </button>
          </form>
        </div>

        <div className="dashboard-carte">
          <h2>Mes missions</h2>
          {contenuListe}
        </div>
      </div>
    </div>
  );
}

export default EntrepriseDashboard;