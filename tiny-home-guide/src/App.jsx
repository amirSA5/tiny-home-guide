import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage.jsx";
import SpaceProfilePage from "./pages/SpaceProfilePage.jsx";
import RecommendationsPage from "./pages/RecommendationsPage.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";

function App() {
  return (
    <Router>
      <div style={{ padding: "16px", maxWidth: 800, margin: "0 auto" }}>
        <header style={{ marginBottom: "24px" }}>
          <h1>Tiny Home Living Guide</h1>
          <nav style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <Link to="/">Welcome</Link>
            <Link to="/space">Space Profile</Link>
            <Link to="/recommendations">Recommendations</Link>
            <Link to="/favorites">Favorites</Link>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/space" element={<SpaceProfilePage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
