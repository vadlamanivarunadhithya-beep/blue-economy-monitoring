import { useEffect, useMemo, useState } from "react";
import API from "../api";

interface Industry {
_id: string;
name: string;
region: string;
type: string;
economicValue: number;
employees: number;
status: string;
}

function Industries() {
const [industries, setIndustries] = useState<Industry[]>([]);
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [editingId, setEditingId] = useState<string | null>(null);

const [name, setName] = useState("");
const [region, setRegion] = useState("");
const [type, setType] = useState("");
const [economicValue, setEconomicValue] = useState("");
const [employees, setEmployees] = useState("");
const [status, setStatus] = useState("Active");

const [search, setSearch] = useState("");
const [filter, setFilter] = useState("All");
const [message, setMessage] = useState("");

// Check the logged-in user's role.
const user = JSON.parse(localStorage.getItem("user") || "null");
const isAdmin = user?.role === "Admin";

const fetchIndustries = async () => {
try {
const response = await API.get("/industries");
setIndustries(response.data);
} catch (error) {
console.error("Failed to fetch industries:", error);
setMessage("Unable to load industry records.");
} finally {
setLoading(false);
}
};

useEffect(() => {
fetchIndustries();
}, []);

const resetForm = () => {
setName("");
setRegion("");
setType("");
setEconomicValue("");
setEmployees("");
setStatus("Active");
setEditingId(null);
};

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();


if (!isAdmin) return;

setSaving(true);
setMessage("");

const value = Number(economicValue);
const employeeCount = Number(employees);

if (
  !name.trim() ||
  !region.trim() ||
  !type.trim() ||
  economicValue.trim() === "" ||
  employees.trim() === "" ||
  !Number.isFinite(value) ||
  !Number.isInteger(employeeCount) ||
  value < 0 ||
  employeeCount < 0
) {
  setMessage("Please enter valid details. Numbers cannot be negative.");
  setSaving(false);
  return;
}

const data = {
  name: name.trim(),
  region: region.trim(),
  type: type.trim(),
  economicValue: value,
  employees: employeeCount,
  status,
};

try {
  if (editingId) {
    await API.put(`/industries/${editingId}`, data);
    setMessage("Industry updated successfully.");
  } else {
    await API.post("/industries", data);
    setMessage("Industry added successfully.");
  }

  resetForm();
  await fetchIndustries();
} catch (error) {
  console.error("Failed to save industry:", error);
  setMessage("Unable to save industry. Please try again.");
} finally {
  setSaving(false);
}


};

const handleEdit = (industry: Industry) => {
if (!isAdmin) return;


setEditingId(industry._id);
setName(industry.name);
setRegion(industry.region);
setType(industry.type);
setEconomicValue(String(industry.economicValue));
setEmployees(String(industry.employees));
setStatus(industry.status);
setMessage("");

window.scrollTo({ top: 0, behavior: "smooth" });


};

const handleDelete = async (id: string) => {
if (!isAdmin) return;


if (!window.confirm("Are you sure you want to delete this industry?")) {
  return;
}

try {
  await API.delete(`/industries/${id}`);

  if (editingId === id) {
    resetForm();
  }

  setMessage("Industry deleted successfully.");
  await fetchIndustries();
} catch (error) {
  console.error("Failed to delete industry:", error);
  setMessage("Unable to delete industry. Please try again.");
}


};

const filteredIndustries = useMemo(() => {
const query = search.toLowerCase().trim();


return industries.filter((industry) => {
  const matchesSearch = [
    industry.name,
    industry.region,
    industry.type,
    industry.status,
  ].some((value) => value?.toLowerCase().includes(query));

  const matchesStatus =
    filter === "All" || industry.status === filter;

  return matchesSearch && matchesStatus;
});


}, [industries, search, filter]);

return ( <main className="marine-page"> <header className="marine-heading"> <div> <span className="marine-eyebrow">COASTAL ECONOMY</span> <h1>Coastal Industries</h1> <p>
Monitor coastal industries, employment, and economic contributions. </p> </div>


    <div className="marine-count">
      <span className="count-icon">⌂</span>
      <div>
        <strong>{industries.length}</strong>
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

  {/* Only Admins can add or edit industries. */}
  {isAdmin && (
    <section className="marine-card">
      <div className="marine-section-heading">
        <div className="section-icon">＋</div>
        <div>
          <h2>{editingId ? "Edit Industry" : "Add Coastal Industry"}</h2>
          <p>
            {editingId
              ? "Update the details of this industry."
              : "Enter the details of the coastal industry to monitor."}
          </p>
        </div>
      </div>

      <form className="marine-form" onSubmit={handleSubmit}>
        <label>
          Industry Name <span>*</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Coastal Processing Unit"
            required
            maxLength={100}
          />
        </label>

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
          Industry Type <span>*</span>
          <input
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="e.g. Seafood Processing"
            required
            maxLength={100}
          />
        </label>

        <label>
          Economic Value <span>*</span>
          <input
            type="number"
            min="0"
            step="any"
            value={economicValue}
            onChange={(e) => setEconomicValue(e.target.value)}
            placeholder="Enter economic value"
            required
          />
        </label>

        <label>
          Number of Employees <span>*</span>
          <input
            type="number"
            min="0"
            step="1"
            value={employees}
            onChange={(e) => setEmployees(e.target.value)}
            placeholder="e.g. 250"
            required
          />
        </label>

        <label>
          Industry Status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Active">Active</option>
            <option value="Monitoring">Monitoring</option>
            <option value="Inactive">Inactive</option>
          </select>
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
                : "＋ Add Industry"}
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

  {/* Industry records: available to both Admins and Viewers. */}
  <section className="marine-card records-card">
    <div className="records-heading">
      <div>
        <h2>Industry Records</h2>
        <p>
          {isAdmin
            ? "Search, review, edit, and manage coastal industries."
            : "Search and review coastal industry records."}
        </p>
      </div>

      <div className="records-tools">
        <input
          className="marine-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="⌕  Search industries..."
          aria-label="Search industries"
        />

        <select
          className="marine-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filter industries by status"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Monitoring">Monitoring</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
    </div>

    {loading ? (
      <div className="marine-empty">Loading industry records...</div>
    ) : filteredIndustries.length === 0 ? (
      <div className="marine-empty">
        <span>⌂</span>
        <h3>No industries found</h3>
        <p>
          {isAdmin
            ? "Try another search or add a coastal industry."
            : "Try adjusting your search or filter."}
        </p>
      </div>
    ) : (
      <div className="marine-table-wrapper">
        <table className="marine-table">
          <thead>
            <tr>
              <th>Industry</th>
              <th>Region</th>
              <th>Type</th>
              <th>Economic Value</th>
              <th>Employees</th>
              <th>Status</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {filteredIndustries.map((industry) => (
              <tr key={industry._id}>
                <td>
                  <strong className="industry-name">
                    {industry.name}
                  </strong>
                </td>
                <td>{industry.region}</td>
                <td>{industry.type}</td>
                <td>
                  {Number(industry.economicValue).toLocaleString()}
                </td>
                <td>
                  {Number(industry.employees).toLocaleString()}
                </td>
                <td>
                  <span
                    className={`condition-badge ${industry.status.toLowerCase()}`}
                  >
                    <span className="condition-dot" />
                    {industry.status}
                  </span>
                </td>

                {isAdmin && (
                  <td>
                    <div className="resource-actions">
                      <button
                        type="button"
                        className="marine-edit-button"
                        onClick={() => handleEdit(industry)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="marine-delete-button"
                        onClick={() => handleDelete(industry._id)}
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
      Showing {filteredIndustries.length} of {industries.length} records
    </div>
  </section>
</main>


);
}

export default Industries;
