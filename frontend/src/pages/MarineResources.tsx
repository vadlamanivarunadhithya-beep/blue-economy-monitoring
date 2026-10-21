import { useEffect, useState } from "react";
import API from "../api";

interface MarineResource {
_id: string;
resourceName: string;
region: string;
type: string;
condition: string;
description: string;
}

interface ResourceForm {
resourceName: string;
region: string;
type: string;
condition: string;
description: string;
}

const initialForm: ResourceForm = {
resourceName: "",
region: "",
type: "",
condition: "Healthy",
description: "",
};

function MarineResources() {
const [resources, setResources] = useState<MarineResource[]>([]);
const [form, setForm] = useState<ResourceForm>(initialForm);
const [editingId, setEditingId] = useState<string | null>(null);
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [deletingId, setDeletingId] = useState<string | null>(null);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");
const [search, setSearch] = useState("");
const [filterCondition, setFilterCondition] = useState("All");

// Check the logged-in user's role.
const user = JSON.parse(localStorage.getItem("user") || "null");
const isAdmin = user?.role === "Admin";

const fetchResources = async () => {
try {
setError("");
const response = await API.get("/marine-resources");
setResources(response.data);
} catch (err) {
console.error("Failed to fetch marine resources:", err);
setError(
"Unable to load marine resources. Check that the backend and database are running."
);
} finally {
setLoading(false);
}
};

useEffect(() => {
fetchResources();
}, []);

const updateField = (
field: keyof ResourceForm,
value: string
) => {
setForm((previous) => ({
...previous,
[field]: value,
}));
};

const resetForm = () => {
setForm(initialForm);
setEditingId(null);
};

const handleSubmit = async (
event: React.FormEvent<HTMLFormElement>
) => {
event.preventDefault();


if (!isAdmin) return;

const cleanedForm: ResourceForm = {
  resourceName: form.resourceName.trim(),
  region: form.region.trim(),
  type: form.type.trim(),
  condition: form.condition,
  description: form.description.trim(),
};

if (
  !cleanedForm.resourceName ||
  !cleanedForm.region ||
  !cleanedForm.type
) {
  setError("Please fill in Resource Name, Region, and Type.");
  setSuccess("");
  return;
}

try {
  setSaving(true);
  setError("");
  setSuccess("");

  if (editingId) {
    await API.put(`/marine-resources/${editingId}`, cleanedForm);
    setSuccess("Marine resource updated successfully.");
  } else {
    await API.post("/marine-resources", cleanedForm);
    setSuccess("Marine resource added successfully.");
  }

  resetForm();
  await fetchResources();
} catch (err) {
  console.error("Failed to save marine resource:", err);
  setError(
    editingId
      ? "Failed to update the marine resource. Please try again."
      : "Failed to add the marine resource. Please try again."
  );
} finally {
  setSaving(false);
}


};

const handleEdit = (resource: MarineResource) => {
if (!isAdmin) return;


setForm({
  resourceName: resource.resourceName,
  region: resource.region,
  type: resource.type,
  condition: resource.condition,
  description: resource.description || "",
});

setEditingId(resource._id);
setError("");
setSuccess("");

window.scrollTo({
  top: 0,
  behavior: "smooth",
});


};

const handleDelete = async (id: string) => {
if (!isAdmin) return;


const confirmed = window.confirm(
  "Are you sure you want to delete this marine resource?"
);

if (!confirmed) return;

try {
  setDeletingId(id);
  setError("");
  setSuccess("");

  await API.delete(`/marine-resources/${id}`);

  if (editingId === id) {
    resetForm();
  }

  setSuccess("Marine resource deleted successfully.");
  await fetchResources();
} catch (err) {
  console.error("Failed to delete marine resource:", err);
  setError("Failed to delete the marine resource. Please try again.");
} finally {
  setDeletingId(null);
}


};

const filteredResources = resources.filter((resource) => {
const searchText = search.toLowerCase();


const matchesSearch = [
  resource.resourceName,
  resource.region,
  resource.type,
  resource.condition,
  resource.description || "",
].some((value) => value.toLowerCase().includes(searchText));

const matchesCondition =
  filterCondition === "All" ||
  resource.condition === filterCondition;

return matchesSearch && matchesCondition;


});

return ( <main className="monitoring-page"> <header className="page-header"> <div> <h1>Marine Resources</h1> <p>Monitor marine resources and coastal environmental conditions.</p> </div>


    <div className="record-count">
      {resources.length} Total Records
    </div>
  </header>

  {error && (
    <div className="feedback-message error-message" role="alert">
      {error}
    </div>
  )}

  {success && (
    <div className="feedback-message success-message" role="status">
      {success}
    </div>
  )}

  {/* Only Admins can see the Add/Edit form. */}
  {isAdmin && (
    <section className="monitoring-panel">
      <div className="panel-heading">
        <div>
          <h2>
            {editingId ? "Edit Marine Resource" : "Add Marine Resource"}
          </h2>
          <p>
            {editingId
              ? "Update the selected resource details."
              : "Enter the details of the marine resource to monitor."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="resource-form">
        <div className="form-field">
          <label htmlFor="resourceName">Resource Name *</label>
          <input
            id="resourceName"
            type="text"
            placeholder="e.g. Marine Water"
            value={form.resourceName}
            onChange={(event) =>
              updateField("resourceName", event.target.value)
            }
            maxLength={100}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="region">Region *</label>
          <input
            id="region"
            type="text"
            placeholder="e.g. Chennai Coast"
            value={form.region}
            onChange={(event) =>
              updateField("region", event.target.value)
            }
            maxLength={100}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="type">Resource Type *</label>
          <input
            id="type"
            type="text"
            placeholder="e.g. Water Quality"
            value={form.type}
            onChange={(event) =>
              updateField("type", event.target.value)
            }
            maxLength={100}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="condition">Condition</label>
          <select
            id="condition"
            value={form.condition}
            onChange={(event) =>
              updateField("condition", event.target.value)
            }
          >
            <option value="Healthy">Healthy</option>
            <option value="Warning">Warning</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        <div className="form-field full-width">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            placeholder="Enter monitoring details..."
            value={form.description}
            onChange={(event) =>
              updateField("description", event.target.value)
            }
            rows={3}
            maxLength={500}
          />
        </div>

        <div className="form-actions full-width">
          <button
            type="submit"
            className="primary-button"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : editingId
                ? "Save Changes"
                : "Add Resource"}
          </button>

          {editingId && (
            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                resetForm();
                setError("");
                setSuccess("");
              }}
              disabled={saving}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
    </section>
  )}

  <section className="monitoring-panel records-panel">
    <div className="panel-heading">
      <div>
        <h2>Marine Resource Records</h2>
        <p>
          {isAdmin
            ? "Search, review, edit, and manage recorded resources."
            : "Search and review recorded marine resources."}
        </p>
      </div>
    </div>

    <div className="table-toolbar">
      <input
        type="search"
        placeholder="Search by resource, region, or type..."
        aria-label="Search marine resources"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <select
        aria-label="Filter by condition"
        value={filterCondition}
        onChange={(event) => setFilterCondition(event.target.value)}
      >
        <option value="All">All Conditions</option>
        <option value="Healthy">Healthy</option>
        <option value="Warning">Warning</option>
        <option value="Critical">Critical</option>
      </select>
    </div>

    {loading ? (
      <p className="empty-state">Loading marine resources...</p>
    ) : filteredResources.length === 0 ? (
      <p className="empty-state">
        {resources.length === 0
          ? "No marine resources found."
          : "No records match your search or filter."}
      </p>
    ) : (
      <div className="table-container">
        <table className="monitoring-table">
          <thead>
            <tr>
              <th>Resource</th>
              <th>Region</th>
              <th>Type</th>
              <th>Condition</th>
              <th>Description</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {filteredResources.map((resource) => (
              <tr key={resource._id}>
                <td className="resource-name">
                  {resource.resourceName}
                </td>
                <td>{resource.region}</td>
                <td>{resource.type}</td>
                <td>
                  <span
                    className={`status-badge status-${resource.condition.toLowerCase()}`}
                  >
                    {resource.condition}
                  </span>
                </td>
                <td>{resource.description || "—"}</td>

                {isAdmin && (
                  <td>
                    <div className="row-actions">
                      <button
                        type="button"
                        className="edit-button"
                        onClick={() => handleEdit(resource)}
                        disabled={saving || deletingId !== null}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-button"
                        onClick={() => handleDelete(resource._id)}
                        disabled={deletingId === resource._id || saving}
                      >
                        {deletingId === resource._id
                          ? "Deleting..."
                          : "Delete"}
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
  </section>
</main>


);
}

export default MarineResources;
