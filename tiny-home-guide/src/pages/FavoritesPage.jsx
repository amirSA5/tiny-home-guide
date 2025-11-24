// src/pages/FavoritesPage.jsx
import { Link } from "react-router-dom";
import { useSpace } from "../context/SpaceContext.jsx";
import { layoutPatterns } from "../data/layoutPatterns.js";
import { furnitureItems } from "../data/furnitureItems.js";

function FavoritesPage() {
  const { favorites } = useSpace();

  if (!favorites || favorites.length === 0) {
    return (
      <div>
        <h2>Favorites</h2>
        <p>You don’t have any favorites yet.</p>
        <p>
          Go to <Link to="/recommendations">Recommendations</Link> and save the
          layouts or furniture ideas you like.
        </p>
      </div>
    );
  }

  const layoutFavorites = favorites
    .filter((f) => f.type === "layout")
    .map((f) => layoutPatterns.find((lp) => lp.id === f.id))
    .filter(Boolean);

  const furnitureFavorites = favorites
    .filter((f) => f.type === "furniture")
    .map((f) => furnitureItems.find((item) => item.id === f.id))
    .filter(Boolean);

  return (
    <div>
      <h2>Favorites</h2>
      <p>Here are the layout and furniture ideas you’ve saved.</p>

      <section style={{ marginTop: 24 }}>
        <h3>Layout favorites</h3>
        {layoutFavorites.length === 0 ? (
          <p>No layout ideas saved yet.</p>
        ) : (
          <ul style={{ paddingLeft: 18 }}>
            {layoutFavorites.map((lp) => (
              <li key={lp.id} style={{ marginBottom: 12 }}>
                <strong>{lp.title}</strong>
                <p style={{ margin: "4px 0" }}>{lp.description}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section style={{ marginTop: 24 }}>
        <h3>Furniture favorites</h3>
        {furnitureFavorites.length === 0 ? (
          <p>No furniture ideas saved yet.</p>
        ) : (
          <ul style={{ paddingLeft: 18 }}>
            {furnitureFavorites.map((item) => (
              <li key={item.id} style={{ marginBottom: 12 }}>
                <strong>{item.name}</strong>
                <p style={{ margin: "2px 0" }}>{item.bestLocation}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default FavoritesPage;
