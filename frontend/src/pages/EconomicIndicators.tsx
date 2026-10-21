import { useEffect, useMemo, useState } from "react";
import API from "../api";

interface EconomicIndicator {
_id: string;
sector: string;
region: string;
economicValue: number;
growth: number;
employment: number;
status: string;
}

function EconomicIndicators() {
const [indicators, setIndicators] = useState<EconomicIndicator[]>([]);
const [loading, setLoading] = useState(true);

const [sector, setSector] = useState("");
const [region, setRegion] = useState("");
const [economicValue, setEconomicValue] = useState("");
const [growth, setGrowth] = useState("");
const [employment, setEmployment] = useState("");
const [status, setStatus] = useState("Growing");

const [editingId, setEditingId] = useState<string | null>(null);
const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("All");
const [message, setMessage] = useState("");
const [errorMessage, setErrorMessage] = useState("");

// Check the logged-in user's role
const user = JSON.parse(localStorage.getItem("user") || "null");
const isAdmin = user?.role === "Admin";

const fetchIndicators = async () => {
try {
const response = await API.get("/economic-indicators");
setIndicators(response.data);
} catch (error) {
console.error("Failed to fetch economic indicators:", error);
setErrorMessage("Unable to load economic indicators.");
} finally {
setLoading(false);
}
};

useEffect(() => {
fetchIndicators();
}, []);

const resetForm = () => {
setSector("");
setRegion("");
setEconomicValue("");
setGrowth("");
setEmployment("");
setStatus("Growing");
setEditingId(null);
};

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
e.preventDefault();


if (!isAdmin) return;

setMessage("");
setErrorMessage("");

const value = Number(economicValue);
const growthValue = Number(growth);
const employmentValue = Number(employment);

if (!sector.trim() || !region.trim()) {
  setErrorMessage("Please enter both sector and region.");
  return;
}

if (
  economicValue.trim() === "" ||
  !Number.isFinite(value) ||
  value < 0
) {
  setErrorMessage("Economic value must be a valid non-negative number.");
  return;
}

if (growth.trim() === "" || !Number.isFinite(growthValue)) {
  setErrorMessage("Please enter a valid growth percentage.");
  return;
}

if (
  employment.trim() === "" ||
  !Number.isInteger(employmentValue) ||
  employmentValue < 0
) {
  setErrorMessage("Employment must be a non-negative whole number.");
  return;
}

const indicatorData = {
  sector: sector.trim(),
  region: region.trim(),
  economicValue: value,
  growth: growthValue,
  employment: employmentValue,
  status,
};

try {
  if (editingId) {
    await API.put(
      `/economic-indicators/${editingId}`,
      indicatorData
    );
    setMessage("Economic indicator updated successfully!");
  } else {
    await API.post("/economic-indicators", indicatorData);
    setMessage("Economic indicator added successfully!");
  }

  resetForm();
  await fetchIndicators();
} catch (error) {
  console.error("Failed to save economic indicator:", error);
  setErrorMessage(
    "Unable to save the record. Please check your backend API."
  );
}


};

const handleEdit = (indicator: EconomicIndicator) => {
if (!isAdmin) return;


setEditingId(indicator._id);
setSector(indicator.sector);
setRegion(indicator.region);
setEconomicValue(String(indicator.economicValue));
setGrowth(String(indicator.growth));
setEmployment(String(indicator.employment));
setStatus(indicator.status);

setMessage("");
setErrorMessage("");

window.scrollTo({ top: 0, behavior: "smooth" });


};

const handleDelete = async (id: string) => {
if (!isAdmin) return;


const confirmed = window.confirm(
  "Are you sure you want to delete this economic indicator?"
);

if (!confirmed) return;

setMessage("");
setErrorMessage("");

try {
  await API.delete(`/economic-indicators/${id}`);

  if (editingId === id) {
    resetForm();
  }

  setMessage("Economic indicator deleted successfully!");
  await fetchIndicators();
} catch (error) {
  console.error("Failed to delete economic indicator:", error);
  setErrorMessage("Unable to delete the economic indicator.");
}


};

const filteredIndicators = useMemo(() => {
const searchText = search.toLowerCase().trim();


return indicators.filter((indicator) => {
  const matchesSearch =
    indicator.sector.toLowerCase().includes(searchText) ||
    indicator.region.toLowerCase().includes(searchText) ||
    indicator.status.toLowerCase().includes(searchText);

  const matchesStatus =
    statusFilter === "All" || indicator.status === statusFilter;

  return matchesSearch && matchesStatus;
});


}, [indicators, search, statusFilter]);

const formatValue = (value: number) =>
Number(value).toLocaleString("en-IN", {
maximumFractionDigits: 2,
});

return ( <div className="marine-page"> <div className="marine-heading"> <div> <h1>Economic Indicators</h1> <p>
Monitor coastal economic performance, growth, and employment. </p> </div>


    <div className="marine-heading-count">
      {indicators.length} Records
    </div>
  </div>

  {message && (
    <div className="marine-message marine-success">
      {message}
    </div>
  )}

  {errorMessage && (
    <div className="marine-message marine-error">
      {errorMessage}
    </div>
  )}

  {/* Admin-only Add / Edit Form */}
  {isAdmin && (
    <section className="marine-card">
      <div className="marine-card-heading">
        <div>
          <h2>
            {editingId
              ? "Edit Economic Indicator"
              : "Add Economic Indicator"}
          </h2>
          <p>
            {editingId
              ? "Update the selected economic indicator."
              : "Enter the details of a coastal economic sector."}
          </p>
        </div>
      </div>

      <form className="marine-form" onSubmit={handleSubmit}>
        <div className="marine-form-grid">
          <div className="marine-field">
            <label htmlFor="sector">Sector Name</label>
            <input
              id="sector"
              type="text"
              placeholder="e.g. Fisheries"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              required
            />
          </div>

          <div className="marine-field">
            <label htmlFor="region">Region</label>
            <input
              id="region"
              type="text"
              placeholder="e.g. Chennai Coast"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              required
            />
          </div>

          <div className="marine-field">
            <label htmlFor="economicValue">Economic Value</label>
            <input
              id="economicValue"
              type="number"
              min="0"
              step="any"
              placeholder="Enter economic value"
              value={economicValue}
              onChange={(e) => setEconomicValue(e.target.value)}
              required
            />
          </div>

          <div className="marine-field">
            <label htmlFor="growth">Growth (%)</label>
            <input
              id="growth"
              type="number"
              step="0.1"
              placeholder="e.g. 5.5"
              value={growth}
              onChange={(e) => setGrowth(e.target.value)}
              required
            />
          </div>

          <div className="marine-field">
            <label htmlFor="employment">Employment</label>
            <input
              id="employment"
              type="number"
              min="0"
              step="1"
              placeholder="Number of people employed"
              value={employment}
              onChange={(e) => setEmployment(e.target.value)}
              required
            />
          </div>

          <div className="marine-field">
            <label htmlFor="status">Economic Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Growing">Growing</option>
              <option value="Stable">Stable</option>
              <option value="Declining">Declining</option>
            </select>
          </div>
        </div>

        <div className="marine-form-actions">
          <button type="submit" className="marine-primary-btn">
            {editingId ? "Update Indicator" : "Add Indicator"}
          </button>

          {editingId && (
            <button
              type="button"
              className="marine-secondary-btn"
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
    </section>
  )}

  {/* Records Table */}
  <section className="marine-card">
    <div className="marine-card-heading">
      <div>
        <h2>Economic Indicator Records</h2>
        <p>Search, review, and manage economic data.</p>
      </div>
    </div>

    <div className="marine-toolbar">
      <div className="marine-search">
        <input
          type="text"
          placeholder="Search sector or region..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <select
        className="marine-filter"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        aria-label="Filter by economic status"
      >
        <option value="All">All Statuses</option>
        <option value="Growing">Growing</option>
        <option value="Stable">Stable</option>
        <option value="Declining">Declining</option>
      </select>
    </div>

    {loading ? (
      <div className="marine-empty">
        Loading economic indicators...
      </div>
    ) : filteredIndicators.length === 0 ? (
      <div className="marine-empty">
        <h3>No economic indicators found</h3>
        <p>
          {isAdmin
            ? "Try changing your search or add a new record."
            : "Try changing your search or filter."}
        </p>
      </div>
    ) : (
      <div className="marine-table-wrapper">
        <table className="marine-table">
          <thead>
            <tr>
              <th>Sector</th>
              <th>Region</th>
              <th>Economic Value</th>
              <th>Growth</th>
              <th>Employment</th>
              <th>Status</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {filteredIndicators.map((indicator) => (
              <tr key={indicator._id}>
                <td>
                  <strong>{indicator.sector}</strong>
                </td>
                <td>{indicator.region}</td>
                <td>{formatValue(indicator.economicValue)}</td>
                <td>
                  <span
                    className={
                      Number(indicator.growth) >= 0
                        ? "marine-growth-positive"
                        : "marine-growth-negative"
                    }
                  >
                    {Number(indicator.growth) > 0 ? "+" : ""}
                    {formatValue(indicator.growth)}%
                  </span>
                </td>
                <td>{formatValue(indicator.employment)}</td>
                <td>
                  <span
                    className={`marine-status-badge ${indicator.status
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {indicator.status}
                  </span>
                </td>

                {isAdmin && (
                  <td>
                    <div className="marine-actions">
                      <button
                        type="button"
                        className="marine-edit-btn"
                        onClick={() => handleEdit(indicator)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="marine-delete-btn"
                        onClick={() => handleDelete(indicator._id)}
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

    {!loading && filteredIndicators.length > 0 && (
      <div className="marine-table-footer">
        Showing {filteredIndicators.length} of {indicators.length} records
      </div>
    )}
  </section>
</div>


);
}

export default EconomicIndicators;
