function SpaceProfilePage() {
  return (
    <div>
      <h2>Space Profile</h2>
      <p>Here you will describe your tiny home (dimensions, zones, etc.).</p>

      {/* For now just static placeholders – we’ll make this a real form later */}
      <form>
        <div>
          <label>
            Length (m): <input type="number" placeholder="e.g. 6" />
          </label>
        </div>
        <div>
          <label>
            Width (m): <input type="number" placeholder="e.g. 3" />
          </label>
        </div>
        <div>
          <label>
            Type of space:
            <select defaultValue="">
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

        <button type="button">Generate ideas (coming soon)</button>
      </form>
    </div>
  );
}

export default SpaceProfilePage;
