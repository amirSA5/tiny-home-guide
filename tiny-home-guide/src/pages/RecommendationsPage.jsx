// src/pages/RecommendationsPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSpace } from "../context/SpaceContext.jsx";
import { furnitureItems } from "../data/furnitureItems.js";
import { layoutPatterns } from "../data/layoutPatterns.js";
import { designTips } from "../data/designTips.js";
import { fetchRecommendations } from "../services/api.js";

function filterLayouts(spaceProfile) {
  if (!spaceProfile) return [];

  const area = spaceProfile.length * spaceProfile.width;

  return layoutPatterns.filter((lp) => {
    if (lp.minArea && lp.minArea > area) return false;

    if (
      lp.recommendedFor?.type &&
      !lp.recommendedFor.type.includes(spaceProfile.type)
    ) {
      return false;
    }

    if (
      lp.recommendedFor?.occupants &&
      !lp.recommendedFor.occupants.includes(spaceProfile.occupants)
    ) {
      return false;
    }

    if (lp.recommendedFor?.zones) {
      const hasCommonZone = lp.recommendedFor.zones.some((z) =>
        spaceProfile.zones.includes(z)
      );
      if (!hasCommonZone) return false;
    }

    return true;
  });
}

function filterFurniture(spaceProfile) {
  if (!spaceProfile) return [];

  return furnitureItems.filter((item) => {
    if (!item.zones || item.zones.length === 0) return true;
    return item.zones.some((z) => spaceProfile.zones.includes(z));
  });
}

function RecommendationsPage() {
  const { spaceProfile, toggleFavorite, isFavorite } = useSpace();
  const [recommendations, setRecommendations] = useState({
    layouts: [],
    furniture: [],
    designTips,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usedFallback, setUsedFallback] = useState(false);

  useEffect(() => {
    if (!spaceProfile) return;
    let cancelled = false;

    async function loadRecommendations() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchRecommendations(spaceProfile);
        if (!cancelled) {
          setRecommendations({
            layouts: data.layouts || [],
            furniture: data.furniture || [],
            designTips: data.designTips || designTips,
          });
          setUsedFallback(false);
        }
      } catch (err) {
        if (!cancelled) {
          setRecommendations({
            layouts: filterLayouts(spaceProfile),
            furniture: filterFurniture(spaceProfile),
            designTips,
          });
          setUsedFallback(true);
          setError(
            err?.message ||
              "Could not reach the server. Showing local suggestions instead."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadRecommendations();
    return () => {
      cancelled = true;
    };
  }, [spaceProfile]);

  if (!spaceProfile) {
    return (
      <div>
        <h2>Recommendations</h2>
        <p>
          We need some info about your tiny home before we can suggest layouts
          and furniture.
        </p>
        <Link to="/space">
          Create your space profile {"->"}
        </Link>
      </div>
    );
  }

  const layouts = recommendations.layouts || [];
  const furniture = recommendations.furniture || [];
  const tips = recommendations.designTips || [];
  const readableType = spaceProfile.type.replace("_", " ");

  return (
    <div>
      <h2>Recommendations</h2>
      <p>
        Here are ideas tailored to your {readableType} of approx.{" "}
        {spaceProfile.length}m x {spaceProfile.width}m.
      </p>

      {loading && <p>Loading fresh recommendations...</p>}
      {error && (
        <p style={{ color: "tomato" }}>
          {error} {usedFallback && "(offline fallback)"}
        </p>
      )}

      <section style={{ marginTop: 24 }}>
        <h3>Layout ideas</h3>
        {layouts.length === 0 ? (
          <p>
            No specific layout patterns matched yet, but you can still explore
            furniture ideas below.
          </p>
        ) : (
          <ul style={{ paddingLeft: 18 }}>
            {layouts.map((lp) => {
              const fav = isFavorite("layout", lp.id);
              return (
                <li key={lp.id} style={{ marginBottom: 12 }}>
                  <strong>{lp.title}</strong>
                  <p style={{ margin: "4px 0" }}>{lp.description}</p>
                  <button
                    type="button"
                    onClick={() => toggleFavorite("layout", lp.id)}
                    style={{ fontSize: "0.9em" }}
                  >
                    {fav ? "[x] Remove from favorites" : "[+] Save to favorites"}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section style={{ marginTop: 24 }}>
        <h3>Multifunctional furniture</h3>
        {furniture.length === 0 ? (
          <p>No furniture suggestions yet.</p>
        ) : (
          <ul style={{ paddingLeft: 18 }}>
            {furniture.map((item) => {
              const fav = isFavorite("furniture", item.id);
              return (
                <li key={item.id} style={{ marginBottom: 12 }}>
                  <strong>{item.name}</strong>
                  <p style={{ margin: "2px 0" }}>{item.bestLocation}</p>
                  {item.footprint && (
                    <p style={{ margin: "2px 0", fontSize: "0.9em" }}>
                      Approx. footprint:{" "}
                      {item.footprint.width &&
                        `width ~${item.footprint.width}cm `}
                      {item.footprint.openDepth &&
                        `- depth in use ~${item.footprint.openDepth}cm `}
                      {item.footprint.foldedDepth &&
                        `- depth folded ~${item.footprint.foldedDepth}cm`}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => toggleFavorite("furniture", item.id)}
                    style={{ fontSize: "0.9em", marginTop: 4 }}
                  >
                    {fav ? "[x] Remove from favorites" : "[+] Save to favorites"}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section style={{ marginTop: 24 }}>
        <h3>Design tips for tiny homes</h3>
        <ul style={{ paddingLeft: 18 }}>
          {tips.map((tip) => (
            <li key={tip.id} style={{ marginBottom: 8 }}>
              {tip.text}
            </li>
          ))}
        </ul>
      </section>

      <div style={{ marginTop: 24 }}>
        <Link to="/favorites">
          View your favorites {"->"}
        </Link>
      </div>
    </div>
  );
}

export default RecommendationsPage;
