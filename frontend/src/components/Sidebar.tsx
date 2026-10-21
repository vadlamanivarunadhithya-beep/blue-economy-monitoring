
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        Blue<span>Watch</span>
      </div>

      <div className="nav-section">
        Overview
      </div>

      <NavLink
        to="/"
        className={({ isActive }) =>
          `nav-item ${isActive ? "active" : ""}`
        }
      >
        Dashboard
      </NavLink>

      <div className="nav-section" style={{ marginTop: "32px" }}>
        Monitoring
      </div>

      <NavLink
        to="/marine-resources"
        className={({ isActive }) =>
          `nav-item ${isActive ? "active" : ""}`
        }
      >
        Marine Resources
      </NavLink>

      <NavLink
        to="/fisheries"
        className={({ isActive }) =>
          `nav-item ${isActive ? "active" : ""}`
        }
      >
        Fisheries
      </NavLink>

      <NavLink
        to="/industries"
        className={({ isActive }) =>
          `nav-item ${isActive ? "active" : ""}`
        }
      >
        Coastal Industries
      </NavLink>

      <NavLink
        to="/economic-indicators"
        className={({ isActive }) =>
          `nav-item ${isActive ? "active" : ""}`
        }
      >
        Economic Indicators
      </NavLink>

      <div className="nav-section" style={{ marginTop: "32px" }}>
        System
      </div>

      <NavLink
        to="/alerts"
        className={({ isActive }) =>
          `nav-item ${isActive ? "active" : ""}`
        }
      >
        Alerts
      </NavLink>

    </aside>
  );
}

export default Sidebar;

