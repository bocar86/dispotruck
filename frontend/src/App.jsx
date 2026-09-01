import { Routes, Route } from "react-router-dom";
import Accueil from "./pages/Accueil";
import Authentification from "./pages/Authentification";
import EntrepriseDashboard from "./pages/EntrepriseDashboard";
import ChauffeurDashboard from "./pages/ChauffeurDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Accueil />} />
      <Route path="/auth" element={<Authentification />} />
      <Route path="/entreprise" element={<EntrepriseDashboard />} />
      <Route path="/chauffeur" element={<ChauffeurDashboard />} />
    </Routes>
  );
}

export default App;