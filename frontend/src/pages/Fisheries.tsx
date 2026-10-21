import { useEffect, useMemo, useState } from "react";
import API from "../api";

interface Fishery {
_id: string;
region: string;
species: string;
production: number;
status: string;
fishermen: number;
vessels: number;
}

function Fisheries() {
const [fisheries, setFisheries] = useState<Fishery[]>([]);
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [editingId, setEditingId] = useState<string | null>(null);

const [region, setRegion] = useState("");
const [species, setSpecies] = useState("");
const [production, setProduction] = useState("");
const [status, setStatus] = useState("Healthy");
const [fishermen, setFishermen] = useState("");
const [vessels, setVessels] = useState("");

const [search, setSearch] = useState("");
const [filter, setFilter] = useState("All");
const [message, setMessage] = useState("");

// Check the logged-in user's role.
const user = JSON.parse(localStorage.getItem("user") || "null");
const isAdmin = user?.role === "Admin";

const fetchFisheries = async () => {
try {
const response = await API.get("/fisheries");
setFisheries(response.data);
} catch (error) {
console.error("Failed to fetch fisheries:", error);
setMessage("Unable to load fisheries records.");
} finally {
setLoading(false);
}
};

useEffect(() => {
fetchFisheries();
}, []);

const resetForm = () => {
setRegion("");
setSpecies("");
setProduction("");
setStatus("Healthy");
setFishermen("");
setVessels("");
setEditingId(null);
};

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();


if (!isAdmin) return;

setSaving(true);
setMessage("");

const data = {
  region: region.trim(),
  species: species.trim(),
  production: Number(production),
  status,
  fishermen: Number(fishermen || 0),
  vessels: Number(vessels || 0),
};

if (
  !data.region ||
  !data.species ||
  production.trim() === "" ||
  !Number.isFinite(data.production) ||
  !Number.isInteger(data.fishermen) ||
  !Number.isInteger(data.vessels) ||
  data.production < 0 ||
  data.fishermen < 0 ||
  data.vessels < 0
) {
  setMessage("Enter valid details. Numbers cannot be negative.");
  setSaving(false);
  return;
}

try {
  if (editingId) {
    await API.put(`/fisheries/${editingId}`, data);
    setMessage("Fishery updated successfully.");
  } else {
    await API.post("/fisheries", data);
    setMessage("Fishery added successfully.");
  }

  resetForm();
  await fetchFisheries();
} catch (error) {
  console.error("Failed to save fishery:", error);
  setMessage("Unable to save fishery. Please try again.");
} finally {
  setSaving(false);
}


};

const handleEdit = (fishery: Fishery) => {
if (!isAdmin) return;


setEditingId(fishery._id);
setRegion(fishery.region);
setSpecies(fishery.species);
setProduction(String(fishery.production));
setStatus(fishery.status);
setFishermen(String(fishery.fishermen ?? 0));
setVessels(String(fishery.vessels ?? 0));
setMessage("");

window.scrollTo({ top: 0, behavior: "smooth" });


};

const handleDelete = async (id: string) => {
if (!isAdmin) return;


if (!window.confirm("Are you sure you want to delete this fishery?")) {
  return;
}

try {
  await API.delete(`/fisheries/${id}`);

  if (editingId === id) resetForm();

  setMessage("Fishery deleted successfully.");
  await fetchFisheries();
} catch (error) {
  console.error("Failed to delete fishery:", error);
  setMessage("Unable to delete fishery. Please try again.");
}


};

const filteredFisheries = useMemo(() => {
const query = search.toLowerCase().trim();


return fisheries.filter((fishery) => {
  const matchesSearch = [
    fishery.region,
    fishery.species,
    fishery.status,
  ].some((value) => value?.toLowerCase().includes(query));

  const matchesStatus =
    filter === "All" || fishery.status === filter;

  return matchesSearch && matchesStatus;
});


}, [fisheries, search, filter]);

return ( <main className="marine-page"> <header className="marine-heading"> <div> <span className="marine-eyebrow">SUSTAINABLE FISHERIES</span> <h1>Fisheries</h1> <p>
Monitor fish production, fishing activity, and coastal livelihoods. </p> </div>


    <div className="marine-count">
      <span className="count-icon">♧</span>
      <div>
        <strong>{fisheries.length}</strong>
        <span>Total Records</span>
      </div>
    </div>
  </header>

  {message && (
    <div className="marine-message" role="status">
      <span>{message}</span>
      <button
        type="button"
        onClick={() => setMessage("")}
        aria-label="Dismiss message"
      >
        ×
      </button>
    </div>
  )}

  {/* Only Admins can add or edit fisheries. */}
  {isAdmin && (
    <section className="marine-card">
      <div className="marine-section-heading">
        <div className="section-icon">＋</div>
        <div>
          <h2>{editingId ? "Edit Fishery" : "Add Fishery"}</h2>
          <p>
            {editingId
              ? "Update the details of this fishery."
              : "Enter the fishery and production details below."}
          </p>
        </div>
      </div>

      <form className="marine-form" onSubmit={handleSubmit}>
        <label>
          Region <span>*</span>
          <input
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder="e.g. Chennai Coast"
            required
            maxLength={100}
          />
        </label>

        <label>
          Fish Species <span>*</span>
          <input
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            placeholder="e.g. Indian Mackerel"
            required
            maxLength={100}
          />
        </label>

        <label>
          Production <span>*</span>
          <input
            type="number"
            min="0"
            step="any"
            value={production}
            onChange={(e) => setProduction(e.target.value)}
            placeholder="e.g. 1250"
            required
          />
        </label>

        <label>
          Status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Healthy">Healthy</option>
            <option value="Warning">Warning</option>
            <option value="Critical">Critical</option>
          </select>
        </label>

        <label>
          Fishermen
          <input
            type="number"
            min="0"
            step="1"
            value={fishermen}
            onChange={(e) => setFishermen(e.target.value)}
            placeholder="e.g. 320"
          />
        </label>

        <label>
          Fishing Vessels
          <input
            type="number"
            min="0"
            step="1"
            value={vessels}
            onChange={(e) => setVessels(e.target.value)}
            placeholder="e.g. 85"
          />
        </label>

        <div className="marine-form-actions">
          <button
            type="submit"
            className="marine-primary-button"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : editingId
                ? "Save Changes"
                : "＋ Add Fishery"}
          </button>

          {editingId && (
            <button
              type="button"
              className="marine-cancel-button"
              onClick={resetForm}
              disabled={saving}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  )}

  {/* Both Admins and Viewers can access the records. */}
  <section className="marine-card records-card">
    <div className="records-heading">
      <div>
        <h2>Fishery Records</h2>
        <p>
          {isAdmin
            ? "Search, review, edit, and manage fishery records."
            : "Search and review fishery records."}
        </p>
      </div>

      <div className="records-tools">
        <input
          className="marine-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="⌕  Search fisheries..."
          aria-label="Search fisheries"
        />

        <select
          className="marine-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filter fisheries by status"
        >
          <option value="All">All Statuses</option>
          <option value="Healthy">Healthy</option>
          <option value="Warning">Warning</option>
          <option value="Critical">Critical</option>
        </select>
      </div>
    </div>

    {loading ? (
      <div className="marine-empty">Loading fisheries...</div>
    ) : filteredFisheries.length === 0 ? (
      <div className="marine-empty">
        <span>♧</span>
        <h3>No fisheries found</h3>
        <p>
          {isAdmin
            ? "Try a different search or add a fishery record."
            : "Try a different search or filter."}
        </p>
      </div>
    ) : (
      <div className="marine-table-wrapper">
        <table className="marine-table">
          <thead>
            <tr>
              <th>Region</th>
              <th>Species</th>
              <th>Production</th>
              <th>Status</th>
              <th>Fishermen</th>
              <th>Vessels</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {filteredFisheries.map((fishery) => (
              <tr key={fishery._id}>
                <td>
                  <strong className="fishery-region">
                    {fishery.region}
                  </strong>
                </td>
                <td>{fishery.species}</td>
                <td>
                  <strong className="fishery-production">
                    {Number(fishery.production).toLocaleString()}
                  </strong>
                </td>
                <td>
                  <span
                    className={`condition-badge ${fishery.status.toLowerCase()}`}
                  >
                    <span className="condition-dot" />
                    {fishery.status}
                  </span>
                </td>
                <td>{fishery.fishermen ?? 0}</td>
                <td>{fishery.vessels ?? 0}</td>

                {isAdmin && (
                  <td>
                    <div className="resource-actions">
                      <button
                        type="button"
                        className="marine-edit-button"
                        onClick={() => handleEdit(fishery)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="marine-delete-button"
                        onClick={() => handleDelete(fishery._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

    <div className="records-footer">
      Showing {filteredFisheries.length} of {fisheries.length} records
    </div>
  </section>
</main>


);
}

export default Fisheries;
