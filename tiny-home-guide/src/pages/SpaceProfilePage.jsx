// src/pages/SpaceProfilePage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSpace } from "../context/SpaceContext.jsx";

function SpaceProfilePage() {
  const navigate = useNavigate();
  const { setSpaceProfile, spaceProfile } = useSpace();

  const [length, setLength] = useState(spaceProfile?.length || "");
  const [width, setWidth] = useState(spaceProfile?.width || "");
  const [type, setType] = useState(spaceProfile?.type || "");
  const [occupants, setOccupants] = useState(spaceProfile?.occupants || "solo");
  const [zones, setZones] = useState(
    spaceProfile?.zones || ["sleep", "work"] // some default zones
  );

  const allZones = [
    { id: "sleep", label: "Sleep area" },
    { id: "work", label: "Work / desk" },
    { id: "dining", label: "Dining space" },
    { id: "pet", label: "Pet corner" },
    { id: "storage", label: "Extra storage" },
  ];

  const handleZoneToggle = (zoneId) => {
    setZones((prev) =>
      prev.includes(zoneId)
        ? prev.filter((z) => z !== zoneId)
        : [...prev, zoneId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!length || !width || !type) {
      alert("Please fill length, width, and type.");
      return;
    }

    const profile = {
      length: Number(length),
      width: Number(width),
      type,
      occupants,
      zones,
    };

    setSpaceProfile(profile);
    navigate("/recommendations");
  };

  return (
    <div>
      <h2>Space Profile</h2>
      <p>Describe your tiny home so we can suggest layouts and furniture.</p>

      <form
        onSubmit={handleSubmit}
        style={{ display: "grid", gap: "12px", maxWidth: 400 }}
      >
        <div>
          <label>
            Length (m):
            <input
              type="number"
              step="0.1"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              placeholder="e.g. 6"
              style={{ marginLeft: 8 }}
            />
          </label>
        </div>

        <div>
          <label>
            Width (m):
            <input
              type="number"
              step="0.1"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              placeholder="e.g. 3"
              style={{ marginLeft: 8 }}
            />
          </label>
        </div>

        <div>
          <label>
            Type of space:
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={{ marginLeft: 8 }}
            >
              <option value="" disabled>
                Select type
              </option>
              <option value="tiny_house">Tiny house</option>
              <option value="cabin">Cabin</option>
              <option value="van">Van</option>
              <option value="studio">Studio</option>
            </select>
          </label>
        </div>

        <div>
          <span>Occupants: </span>
          <label style={{ marginLeft: 8 }}>
            <input
              type="radio"
              name="occupants"
              value="solo"
              checked={occupants === "solo"}
              onChange={(e) => setOccupants(e.target.value)}
            />
            Solo
          </label>
          <label style={{ marginLeft: 8 }}>
            <input
              type="radio"
              name="occupants"
              value="couple"
              checked={occupants === "couple"}
              onChange={(e) => setOccupants(e.target.value)}
            />
            Couple
          </label>
          <label style={{ marginLeft: 8 }}>
            <input
              type="radio"
              name="occupants"
              value="family"
              checked={occupants === "family"}
              onChange={(e) => setOccupants(e.target.value)}
            />
            Family
          </label>
        </div>

        <div>
          <p>What zones do you need?</p>
          {allZones.map((z) => (
            <label key={z.id} style={{ display: "block" }}>
              <input
                type="checkbox"
                checked={zones.includes(z.id)}
                onChange={() => handleZoneToggle(z.id)}
              />
              <span style={{ marginLeft: 4 }}>{z.label}</span>
            </label>
          ))}
        </div>

        <button type="submit">
          Generate ideas {"->"}
        </button>
      </form>
    </div>
  );
}

export default SpaceProfilePage;
