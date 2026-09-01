import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Authentification.css";

function Authentification() {
  const [mode, setMode] = useState("connexion");
  const [role, setRole] = useState("entreprise");

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [siret, setSiret] = useState("");
  const [adresse, setAdresse] = useState("");
  const [telephone, setTelephone] = useState("");
  const [numPermis, setNumPermis] = useState("");
  const [typePermis, setTypePermis] = useState("");

  const [erreur, setErreur] = useState("");
  const navigate = useNavigate();

  async function gererConnexion() {
    try {
      const reponse = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, motDePasse: motDePasse, role: role }),
      });

      const donnees = await reponse.json();

      if (!reponse.ok) {
        setErreur(donnees.message);
        return;
      }

      localStorage.setItem("token", donnees.token);
      localStorage.setItem("role", donnees.role);

      if (donnees.role === "entreprise") {
        navigate("/entreprise");
      } else {
        navigate("/chauffeur");
      }
    } catch (error) {
      setErreur("Impossible de contacter le serveur");
    }
  }

  async function gererInscription() {
    let url = "http://localhost:3000/api/auth/register/entreprise";
    let corps = {
      nom: nom,
      email: email,
      motDePasse: motDePasse,
      siret: siret,
      adresse: adresse,
    };

    if (role === "chauffeur") {
      url = "http://localhost:3000/api/auth/register/chauffeur";
      corps = {
        nom: nom,
        prenom: prenom,
        email: email,
        motDePasse: motDePasse,
        telephone: telephone,
        numPermis: numPermis,
        typePermis: typePermis,
      };
    }

    try {
      const reponse = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corps),
      });

      const donnees = await reponse.json();

      if (!reponse.ok) {
        setErreur(donnees.message);
        return;
      }

      setMode("connexion");
      setErreur("");
    } catch (error) {
      setErreur("Impossible de contacter le serveur");
    }
  }

  function gererEnvoi(event) {
    event.preventDefault();
    setErreur("");

    if (mode === "connexion") {
      gererConnexion();
    } else {
      gererInscription();
    }
  }

  let classeOngletConnexion = "onglet";
  if (mode === "connexion") {
    classeOngletConnexion = "onglet actif";
  }

  let classeOngletInscription = "onglet";
  if (mode === "inscription") {
    classeOngletInscription = "onglet actif";
  }

  let classeRoleEntreprise = "role";
  if (role === "entreprise") {
    classeRoleEntreprise = "role actif";
  }

  let classeRoleChauffeur = "role";
  if (role === "chauffeur") {
    classeRoleChauffeur = "role actif";
  }

  let texteBouton = "Se connecter";
  if (mode === "inscription") {
    texteBouton = "Creer mon compte";
  }

  let champNom = null;
  if (mode === "inscription") {
    champNom = (
      <input
        type="text"
        placeholder="Nom"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
      />
    );
  }

  let champsChauffeur = null;
  if (mode === "inscription" && role === "chauffeur") {
    champsChauffeur = (
      <>
        <input
          type="text"
          placeholder="Prenom"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
        />
        <input
          type="text"
          placeholder="Telephone"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
        />
        <input
          type="text"
          placeholder="Numero de permis"
          value={numPermis}
          onChange={(e) => setNumPermis(e.target.value)}
        />
        <input
          type="text"
          placeholder="Type de permis"
          value={typePermis}
          onChange={(e) => setTypePermis(e.target.value)}
        />
      </>
    );
  }

  let champsEntreprise = null;
  if (mode === "inscription" && role === "entreprise") {
    champsEntreprise = (
      <>
        <input
          type="text"
          placeholder="Siret"
          value={siret}
          onChange={(e) => setSiret(e.target.value)}
        />
        <input
          type="text"
          placeholder="Adresse"
          value={adresse}
          onChange={(e) => setAdresse(e.target.value)}
        />
      </>
    );
  }

  let messageErreur = null;
  if (erreur !== "") {
    messageErreur = <p className="auth-erreur">{erreur}</p>;
  }

  return (
    <div className="auth">
      <div className="auth-carte">
        <span className="logo">DispoTruck</span>

        <div className="auth-onglets">
          <button type="button" className={classeOngletConnexion} onClick={() => setMode("connexion")}>
            Se connecter
          </button>
          <button type="button" className={classeOngletInscription} onClick={() => setMode("inscription")}>
            Creer un compte
          </button>
        </div>

        <p className="label-role">Je suis...</p>
        <div className="auth-role">
          <button type="button" className={classeRoleEntreprise} onClick={() => setRole("entreprise")}>
            Entreprise
          </button>
          <button type="button" className={classeRoleChauffeur} onClick={() => setRole("chauffeur")}>
            Chauffeur
          </button>
        </div>

        <form onSubmit={gererEnvoi} className="auth-form">
          {champNom}
          {champsChauffeur}
          {champsEntreprise}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
          />

          {messageErreur}

          <button type="submit" className="auth-bouton">
            {texteBouton}
          </button>
        </form>

        <Link to="/" className="auth-retour">Retour a l'accueil</Link>
      </div>
    </div>
  );
}

export default Authentification;