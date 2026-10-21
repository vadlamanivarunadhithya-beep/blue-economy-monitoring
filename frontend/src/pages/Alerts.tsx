
import { useEffect, useMemo, useState } from "react";
import API from "../api";

interface Alert {
  _id: string;
  title: string;
  region: string;
  type: string;
  severity: string;
  description: string;
  isRead: boolean;
}

function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [region, setRegion] = useState("");
  const [type, setType] = useState("");
  const [severity, setSeverity] = useState("Medium");
  const [description, setDescription] = useState("");

  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [readFilter, setReadFilter] = useState("All");

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = user?.role === "Admin";

  const fetchAlerts = async () => {
    try {
      const response = await API.get("/alerts");
      setAlerts(response.data);
      setErrorMessage("");
    } catch (error) {
      console.error("Failed to fetch alerts:", error);
      setErrorMessage("Unable to load alerts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const resetForm = () => {
    setTitle("");
    setRegion("");
    setType("");
    setSeverity("Medium");
    setDescription("");
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isAdmin) return;

    setMessage("");
    setErrorMessage("");

    if (!title.trim() || !region.trim() || !type.trim()) {
      setErrorMessage("Please fill in the title, region, and alert type.");
      return;
    }

    try {
      await API.post("/alerts", {
        title: title.trim(),
        region: region.trim(),
        type: type.trim(),
        severity,
        description: description.trim(),
        isRead: false,
      });

      resetForm();
      setMessage("Alert created successfully!");

      await fetchAlerts();
    } catch (error) {
      console.error("Failed to add alert:", error);
      setErrorMessage("Unable to create the alert. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this alert?"
    );

    if (!confirmed) return;

    setMessage("");
    setErrorMessage("");

    try {
      await API.delete(`/alerts/${id}`);

      setMessage("Alert deleted successfully!");
      await fetchAlerts();
    } catch (error) {
      console.error("Failed to delete alert:", error);
      setErrorMessage("Unable to delete the alert.");
    }
  };

  const handleMarkAsRead = async (alert: Alert) => {
    if (!isAdmin) return;

    setMessage("");
    setErrorMessage("");

    try {
      await API.put(`/alerts/${alert._id}`, {
        isRead: true,
      });

      setMessage("Alert marked as read!");
      await fetchAlerts();
    } catch (error) {
      console.error("Failed to update alert:", error);
      setErrorMessage("Unable to update the alert.");
    }
  };

  const filteredAlerts = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return alerts.filter((alert) => {
      const matchesSearch =
        alert.title.toLowerCase().includes(searchText) ||
        alert.region.toLowerCase().includes(searchText) ||
        alert.type.toLowerCase().includes(searchText) ||
        alert.description.toLowerCase().includes(searchText);

      const matchesSeverity =
        severityFilter === "All" || alert.severity === severityFilter;

      const matchesRead =
        readFilter === "All" ||
        (readFilter === "Read" && alert.isRead) ||
        (readFilter === "Unread" && !alert.isRead);

      return matchesSearch && matchesSeverity && matchesRead;
    });
  }, [alerts, search, severityFilter, readFilter]);

  const unreadCount = alerts.filter((alert) => !alert.isRead).length;

  const highCount = alerts.filter(
    (alert) => alert.severity === "High" && !alert.isRead
  ).length;

  const mediumCount = alerts.filter(
    (alert) => alert.severity === "Medium"
  ).length;

  const lowCount = alerts.filter(
    (alert) => alert.severity === "Low"
  ).length;

  return (
    <div className="marine-page">
      {/* Page Heading */}
      <div className="marine-heading">
        <div>
          <h1>Alerts & Notifications</h1>
          <p>
            Monitor coastal incidents, environmental risks, and important
            updates.
          </p>
        </div>

        <div className="marine-heading-count">
          {alerts.length} Total Alerts
        </div>
      </div>

      {/* Success and Error Messages */}
      {message && (
        <div className="marine-message marine-success">{message}</div>
      )}

      {errorMessage && (
        <div className="marine-message marine-error">{errorMessage}</div>
      )}

      {/* Alert Statistics */}
      <div className="marine-stats-grid">
        <div className="marine-stat-card">
          <div className="marine-stat-label">Total Alerts</div>
          <div className="marine-stat-value">{alerts.length}</div>
          <div className="marine-stat-note">All recorded alerts</div>
        </div>

        <div className="marine-stat-card">
          <div className="marine-stat-label">Unread Alerts</div>
          <div className="marine-stat-value">{unreadCount}</div>
          <div className="marine-stat-note">Awaiting review</div>
        </div>

        <div className="marine-stat-card">
          <div className="marine-stat-label">High Severity</div>
          <div className="marine-stat-value">{highCount}</div>
          <div className="marine-stat-note">
            Unread high-severity alerts
          </div>
        </div>

        <div className="marine-stat-card">
          <div className="marine-stat-label">Medium / Low</div>
          <div className="marine-stat-value">
            {mediumCount + lowCount}
          </div>
          <div className="marine-stat-note">
            Medium and low severity
          </div>
        </div>
      </div>

      {/* Create Alert Form - Admin Only */}
      {isAdmin && (
        <section className="marine-card">
          <div className="marine-card-heading">
            <div>
              <h2>Create New Alert</h2>
              <p>
                Record an incident or notify the team about a coastal risk.
              </p>
            </div>
          </div>

          <form className="marine-form" onSubmit={handleAdd}>
            <div className="marine-form-grid">
              <div className="marine-field">
                <label htmlFor="alertTitle">Alert Title</label>
                <input
                  id="alertTitle"
                  type="text"
                  placeholder="e.g. Poor Water Quality"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="marine-field">
                <label htmlFor="alertRegion">Region</label>
                <input
                  id="alertRegion"
                  type="text"
                  placeholder="e.g. Chennai Coast"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  required
                />
              </div>

              <div className="marine-field">
                <label htmlFor="alertType">Alert Type</label>
                <input
                  id="alertType"
                  type="text"
                  placeholder="e.g. Water Pollution"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                />
              </div>

              <div className="marine-field">
                <label htmlFor="alertSeverity">Severity</label>
                <select
                  id="alertSeverity"
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="marine-field marine-field-full">
                <label htmlFor="alertDescription">Description</label>
                <textarea
                  id="alertDescription"
                  placeholder="Describe the incident, its impact, or any action required..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <div className="marine-form-actions">
              <button type="submit" className="marine-primary-btn">
                + Create Alert
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Alert Records */}
      <section className="marine-card">
        <div className="marine-card-heading">
          <div>
            <h2>Alert Records</h2>
            <p>
              Search, filter, and review recorded alerts.
              {isAdmin && " You can also manage alerts."}
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="marine-toolbar">
          <div className="marine-search">
            <input
              type="text"
              placeholder="Search title, region, type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="marine-filter"
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            aria-label="Filter by severity"
          >
            <option value="All">All Severities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            className="marine-filter"
            value={readFilter}
            onChange={(e) => setReadFilter(e.target.value)}
            aria-label="Filter by read status"
          >
            <option value="All">All Alerts</option>
            <option value="Unread">Unread</option>
            <option value="Read">Read</option>
          </select>
        </div>

        {loading ? (
          <div className="marine-empty">Loading alerts...</div>
        ) : filteredAlerts.length === 0 ? (
          <div className="marine-empty">
            <h3>No alerts found</h3>
            <p>Try changing your filters or create a new alert.</p>
          </div>
        ) : (
          <div className="marine-table-wrapper">
            <table className="marine-table">
              <thead>
                <tr>
                  <th>Alert</th>
                  <th>Region</th>
                  <th>Type</th>
                  <th>Severity</th>
                  <th>Description</th>
                  <th>Status</th>
                  {isAdmin && <th>Actions</th>}
                </tr>
              </thead>

              <tbody>
                {filteredAlerts.map((alert) => (
                  <tr key={alert._id}>
                    <td>
                      <strong>{alert.title}</strong>
                    </td>

                    <td>{alert.region}</td>
                    <td>{alert.type}</td>

                    <td>
                      <span
                        className={`marine-status-badge ${alert.severity.toLowerCase()}`}
                      >
                        {alert.severity}
                      </span>
                    </td>

                    <td className="marine-description-cell">
                      {alert.description || "No description provided"}
                    </td>

                    <td>
                      <span
                        className={`marine-status-badge ${
                          alert.isRead ? "read" : "unread"
                        }`}
                      >
                        {alert.isRead ? "Read" : "Unread"}
                      </span>
                    </td>

                    {isAdmin && (
                      <td>
                        <div className="marine-actions">
                          {!alert.isRead && (
                            <button
                              type="button"
                              className="marine-edit-btn"
                              onClick={() => handleMarkAsRead(alert)}
                            >
                              Mark Read
                            </button>
                          )}

                          <button
                            type="button"
                            className="marine-delete-btn"
                            onClick={() => handleDelete(alert._id)}
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

        {!loading && filteredAlerts.length > 0 && (
          <div className="marine-table-footer">
            Showing {filteredAlerts.length} of {alerts.length} alerts
          </div>
        )}
      </section>
    </div>
  );
}

export default Alerts;

