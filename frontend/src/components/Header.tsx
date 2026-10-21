import { useNavigate } from "react-router-dom";

function Header() {
const navigate = useNavigate();

const handleLogout = () => {
localStorage.removeItem("token");
localStorage.removeItem("user");
navigate("/login", { replace: true });
};

return ( <header className="top-header">


  <div>
    <div className="header-title">
      Blue Economy Monitoring
    </div>

    <div className="header-subtitle">
      Sustainable marine resource management
    </div>
  </div>

  <div className="admin">

    <div className="admin-info">

      <div className="admin-name">
        Administrator
      </div>

      <div className="admin-role">
        System Manager
      </div>

    </div>

    <div className="admin-avatar">
      AD
    </div>

    <button
      onClick={handleLogout}
      style={{
        marginLeft: "16px",
        padding: "9px 16px",
        backgroundColor: "#dc2626",
        color: "#ffffff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: 600,
      }}
    >
      Logout
    </button>

  </div>

</header>


);
}

export default Header;
