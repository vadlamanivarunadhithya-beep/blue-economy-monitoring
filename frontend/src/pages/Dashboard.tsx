import { useEffect, useMemo, useState } from "react";
import API from "../api";

interface MarineResource {
  _id: string;
  resourceName: string;
  region: string;
  condition: string;
}

interface Fishery {
  _id: string;
  region: string;
  species: string;
  status: string;
}

interface Industry {
  _id: string;
  name: string;
  region: string;
  status: string;
}

interface EconomicIndicator {
  _id: string;
  sector: string;
  region?: string;
  economicValue?: number;
  growth?: number;
  status: string;
}

interface Alert {
  _id: string;
  title: string;
  region?: string;
  severity: string;
  isRead: boolean;
  description?: string;
}

interface MonitoringRecord {
  id: string;
  region: string;
  category: string;
  record: string;
  status: string;
}

function Dashboard() {
  const [marineResources, setMarineResources] = useState<MarineResource[]>([]);
  const [fisheries, setFisheries] = useState<Fishery[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [economicIndicators, setEconomicIndicators] = useState<EconomicIndicator[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setErrorMessage("");

        const [marine, fishery, industry, economic, alert] =
          await Promise.all([
            API.get("/marine-resources"),
            API.get("/fisheries"),
            API.get("/industries"),
            API.get("/economic-indicators"),
            API.get("/alerts"),
          ]);

        setMarineResources(marine.data);
        setFisheries(fishery.data);
        setIndustries(industry.data);
        setEconomicIndicators(economic.data);
        setAlerts(alert.data);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        setErrorMessage(
          "Unable to load all dashboard data. Please check your backend connection."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const healthy = marineResources.filter(
    (item) => item.condition === "Healthy"
  ).length;

  const warning = marineResources.filter(
    (item) => item.condition === "Warning"
  ).length;

  const critical = marineResources.filter(
    (item) => item.condition === "Critical"
  ).length;

  const activeIndustries = industries.filter(
    (item) => item.status === "Active"
  ).length;

  const unreadAlerts = alerts.filter(
    (item) => !item.isRead
  ).length;

  const highSeverityAlerts = alerts.filter(
    (item) => item.severity === "High" && !item.isRead
  ).length;

  const growingSectors = economicIndicators.filter(
    (item) => item.status === "Growing"
  ).length;

  const totalResources = marineResources.length;

  const getPercentage = (count: number) => {
    if (totalResources === 0) return 0;
    return Math.round((count / totalResources) * 100);
  };

  const recentRecords = useMemo<MonitoringRecord[]>(() => {
    const records: MonitoringRecord[] = [
      ...marineResources.map((item) => ({
        id: `marine-${item._id}`,
        region: item.region,
        category: "Marine Resource",
        record: item.resourceName,
        status: item.condition,
      })),

      ...fisheries.map((item) => ({
        id: `fishery-${item._id}`,
        region: item.region,
        category: "Fisheries",
        record: item.species,
        status: item.status,
      })),

      ...industries.map((item) => ({
        id: `industry-${item._id}`,
        region: item.region,
        category: "Coastal Industry",
        record: item.name,
        status: item.status,
      })),

      ...economicIndicators.map((item) => ({
        id: `economic-${item._id}`,
        region: item.region || "Not specified",
        category: "Economic Indicator",
        record: item.sector,
        status: item.status,
      })),

      ...alerts.map((item) => ({
        id: `alert-${item._id}`,
        region: item.region || "Not specified",
        category: "Alert",
        record: item.title,
        status: item.severity,
      })),
    ];

    return records.slice(-8).reverse();
  }, [
    marineResources,
    fisheries,
    industries,
    economicIndicators,
    alerts,
  ]);

  const recentAlerts = alerts.slice(-5).reverse();

  const getBadgeClass = (status: string) => {
    const normalizedStatus = status.toLowerCase().replace(/\s+/g, "-");

    const supportedStatuses = [
      "healthy",
      "warning",
      "critical",
      "active",
      "monitoring",
      "inactive",
      "growing",
      "stable",
      "declining",
      "high",
      "medium",
      "low",
      "read",
      "unread",
    ];

    return `badge ${
      supportedStatuses.includes(normalizedStatus)
        ? normalizedStatus
        : "default"
    }`;
  };

  if (loading) {
    return (
      <div className="marine-page">
        <div className="marine-empty">
          <h2>Loading Dashboard...</h2>
          <p>Fetching the latest monitoring information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="marine-page">
      {/* Dashboard Heading */}
      <div className="marine-heading">
        <div>
          <h1>Blue Economy Dashboard</h1>
          <p>
            Monitor marine resources, fisheries, coastal industries, and
            economic activity in one place.
          </p>
        </div>

        <div className="marine-heading-count">
          Live Data Overview
        </div>
      </div>

      {errorMessage && (
        <div className="marine-message marine-error">
          {errorMessage}
        </div>
      )}

      {/* Summary Cards */}
      <div className="marine-stats-grid">
        <div className="marine-stat-card">
          <div className="marine-stat-label">Marine Resources</div>
          <div className="marine-stat-value">{marineResources.length}</div>
          <div className="marine-stat-note">
            {healthy} healthy resources
          </div>
        </div>

        <div className="marine-stat-card">
          <div className="marine-stat-label">Fisheries</div>
          <div className="marine-stat-value">{fisheries.length}</div>
          <div className="marine-stat-note">
            Registered fishery records
          </div>
        </div>

        <div className="marine-stat-card">
          <div className="marine-stat-label">Active Industries</div>
          <div className="marine-stat-value">{activeIndustries}</div>
          <div className="marine-stat-note">
            Of {industries.length} coastal industries
          </div>
        </div>

        <div className="marine-stat-card">
          <div className="marine-stat-label">Unread Alerts</div>
          <div className="marine-stat-value">{unreadAlerts}</div>
          <div className="marine-stat-note">
            {highSeverityAlerts} unread high-severity alerts
          </div>
        </div>
      </div>

      {/* Monitoring Overview */}
      <div className="marine-dashboard-grid">
        <section className="marine-card">
          <div className="marine-card-heading">
            <div>
              <h2>Marine Resource Health</h2>
              <p>Condition of monitored marine resources.</p>
            </div>
          </div>

          <div className="marine-health-list">
            <div className="marine-health-item">
              <div className="marine-health-heading">
                <span>Healthy</span>
                <strong>
                  {healthy} ({getPercentage(healthy)}%)
                </strong>
              </div>

              <div className="marine-health-track">
                <div
                  className="marine-health-fill healthy-fill"
                  style={{ width: `${getPercentage(healthy)}%` }}
                />
              </div>
            </div>

            <div className="marine-health-item">
              <div className="marine-health-heading">
                <span>Warning</span>
                <strong>
                  {warning} ({getPercentage(warning)}%)
                </strong>
              </div>

              <div className="marine-health-track">
                <div
                  className="marine-health-fill warning-fill"
                  style={{ width: `${getPercentage(warning)}%` }}
                />
              </div>
            </div>

            <div className="marine-health-item">
              <div className="marine-health-heading">
                <span>Critical</span>
                <strong>
                  {critical} ({getPercentage(critical)}%)
                </strong>
              </div>

              <div className="marine-health-track">
                <div
                  className="marine-health-fill critical-fill"
                  style={{ width: `${getPercentage(critical)}%` }}
                />
              </div>
            </div>

            {totalResources === 0 && (
              <p className="marine-empty">
                No marine resources have been recorded yet.
              </p>
            )}
          </div>
        </section>

        <section className="marine-card">
          <div className="marine-card-heading">
            <div>
              <h2>Economic Overview</h2>
              <p>Summary of coastal economic indicators.</p>
            </div>
          </div>

          <div className="marine-overview-list">
            <div className="marine-overview-item">
              <span>Total Economic Sectors</span>
              <strong>{economicIndicators.length}</strong>
            </div>

            <div className="marine-overview-item">
              <span>Growing Sectors</span>
              <strong className="marine-text-green">
                {growingSectors}
              </strong>
            </div>

            <div className="marine-overview-item">
              <span>Other Economic Sectors</span>
              <strong>
                {economicIndicators.length - growingSectors}
              </strong>
            </div>

            <div className="marine-overview-item">
              <span>Total Coastal Industries</span>
              <strong>{industries.length}</strong>
            </div>
          </div>
        </section>
      </div>

      {/* Recent Alerts */}
      <section className="marine-card">
        <div className="marine-card-heading">
          <div>
            <h2>Recent Alerts</h2>
            <p>Latest recorded incidents and notifications.</p>
          </div>

          <span className="marine-heading-count">
            {unreadAlerts} Unread
          </span>
        </div>

        {recentAlerts.length === 0 ? (
          <div className="marine-empty">
            <h3>No alerts available</h3>
            <p>New alerts will appear here when they are recorded.</p>
          </div>
        ) : (
          <div className="marine-alert-list">
            {recentAlerts.map((alert) => (
              <div className="marine-alert-item" key={alert._id}>
                <div className="marine-alert-content">
                  <strong>{alert.title}</strong>
                  <span>
                    {alert.region || "Region not specified"}
                  </span>

                  {alert.description && (
                    <p>{alert.description}</p>
                  )}
                </div>

                <div className="marine-alert-meta">
                  <span className={getBadgeClass(alert.severity)}>
                    {alert.severity}
                  </span>

                  <span
                    className={`marine-status-badge ${
                      alert.isRead ? "read" : "unread"
                    }`}
                  >
                    {alert.isRead ? "Read" : "Unread"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent Monitoring Records */}
      <section className="marine-card">
        <div className="marine-card-heading">
          <div>
            <h2>Recent Monitoring Records</h2>
            <p>
              Latest entries across the platform's monitoring modules.
            </p>
          </div>
        </div>

        {recentRecords.length === 0 ? (
          <div className="marine-empty">
            <h3>No monitoring records available</h3>
            <p>Add records to your modules to see them here.</p>
          </div>
        ) : (
          <div className="marine-table-wrapper">
            <table className="marine-table">
              <thead>
                <tr>
                  <th>Region</th>
                  <th>Category</th>
                  <th>Record</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentRecords.map((record) => (
                  <tr key={record.id}>
                    <td>{record.region}</td>
                    <td>{record.category}</td>
                    <td>
                      <strong>{record.record}</strong>
                    </td>
                    <td>
                      <span className={getBadgeClass(record.status)}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;