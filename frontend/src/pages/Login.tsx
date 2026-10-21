import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

type UserRole = "Admin" | "Viewer";

function Login() {
const navigate = useNavigate();

const [selectedRole, setSelectedRole] = useState<UserRole>("Admin");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
e.preventDefault();


setError("");
setLoading(true);

// Clear any previous session before attempting a new login.
localStorage.removeItem("token");
localStorage.removeItem("user");

try {
  const response = await API.post("/auth/login", {
    email: email.trim(),
    password,
  });

  const { token, user } = response.data;

  // Verify that the backend returned the expected role.
  if (user.role !== selectedRole) {
    setError(
      `This account is registered as ${user.role}. Please select ${user.role} Login.`
    );
    return;
  }

  // Save the authenticated session.
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  navigate("/", { replace: true });
} catch (err: unknown) {
  const message =
    typeof err === "object" &&
    err !== null &&
    "response" in err
      ? (
          err as {
            response?: {
              data?: { message?: string };
            };
          }
        ).response?.data?.message
      : undefined;

  setError(
    message || "Login failed. Please check your email and password."
  );
} finally {
  setLoading(false);
}


};

return ( <div style={styles.page}> <div style={styles.backgroundCircleOne} /> <div style={styles.backgroundCircleTwo} />


  <div style={styles.layout}>
    <section style={styles.intro}>
      <div style={styles.logo}>🌊</div>

      <p style={styles.eyebrow}>
        SUSTAINABLE OCEANS · SMART MONITORING
      </p>

      <h1 style={styles.heading}>
        Blue Economy
        <br />
        <span style={styles.headingAccent}>
          Monitoring Platform
        </span>
      </h1>

      <p style={styles.description}>
        Monitor marine resources, fisheries, coastal industries, and
        economic activity through one integrated platform.
      </p>

      <div style={styles.featureList}>
        <div style={styles.feature}>
          <span style={styles.featureIcon}>◉</span>
          Marine Resource Monitoring
        </div>

        <div style={styles.feature}>
          <span style={styles.featureIcon}>⌁</span>
          Fisheries & Coastal Industries
        </div>

        <div style={styles.feature}>
          <span style={styles.featureIcon}>↗</span>
          Economic Insights & Alerts
        </div>
      </div>

      <p style={styles.footerNote}>
        Supporting smarter decisions for a sustainable blue economy.
      </p>
    </section>

    <section style={styles.card}>
      <div style={styles.cardHeader}>
        <p style={styles.cardEyebrow}>WELCOME BACK</p>
        <h2 style={styles.cardTitle}>Sign in to your account</h2>
        <p style={styles.cardDescription}>
          Select your account type to continue.
        </p>
      </div>

      <div style={styles.roleContainer}>
        <button
          type="button"
          onClick={() => {
            setSelectedRole("Admin");
            setError("");
          }}
          style={{
            ...styles.roleButton,
            ...(selectedRole === "Admin"
              ? styles.selectedRoleButton
              : {}),
          }}
          aria-pressed={selectedRole === "Admin"}
        >
          <span style={styles.roleIcon}>⚙</span>
          <span style={styles.roleText}>
            <strong>Administrator</strong>
            <small>Manage platform data</small>
          </span>
          <span style={styles.radio}>
            {selectedRole === "Admin" ? "●" : "○"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedRole("Viewer");
            setError("");
          }}
          style={{
            ...styles.roleButton,
            ...(selectedRole === "Viewer"
              ? styles.selectedRoleButton
              : {}),
          }}
          aria-pressed={selectedRole === "Viewer"}
        >
          <span style={styles.roleIcon}>◉</span>
          <span style={styles.roleText}>
            <strong>Viewer</strong>
            <small>View monitoring information</small>
          </span>
          <span style={styles.radio}>
            {selectedRole === "Viewer" ? "●" : "○"}
          </span>
        </button>
      </div>

      <form onSubmit={handleLogin} style={styles.form}>
        <label htmlFor="email" style={styles.label}>
          Email address
        </label>

        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="username"
          required
          style={styles.input}
        />

        <label htmlFor="password" style={styles.label}>
          Password
        </label>

        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          autoComplete="current-password"
          required
          style={styles.input}
        />

        {error && (
          <div style={styles.error} role="alert">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.submitButton,
            ...(loading ? styles.disabledButton : {}),
          }}
        >
          {loading
            ? "Signing in..."
            : `Sign in as ${selectedRole} →`}
        </button>
      </form>

      <div style={styles.securityNote}>
        <span>🔒</span>
        <span>Your account access is verified securely.</span>
      </div>
    </section>
  </div>
</div>


);
}

const styles: Record<string, React.CSSProperties> = {
page: {
minHeight: "100vh",
width: "100%",
boxSizing: "border-box",
background:
"linear-gradient(135deg, #071b33 0%, #0b3150 52%, #0b5263 100%)",
display: "flex",
alignItems: "center",
justifyContent: "center",
padding: "36px 24px",
position: "relative",
overflow: "hidden",
fontFamily: "Inter, Segoe UI, Arial, sans-serif",
},
backgroundCircleOne: {
position: "absolute",
width: "400px",
height: "400px",
borderRadius: "50%",
background: "rgba(51, 196, 190, 0.08)",
top: "-180px",
right: "-100px",
pointerEvents: "none",
},
backgroundCircleTwo: {
position: "absolute",
width: "300px",
height: "300px",
borderRadius: "50%",
background: "rgba(66, 153, 225, 0.10)",
bottom: "-150px",
left: "-80px",
pointerEvents: "none",
},
layout: {
position: "relative",
zIndex: 1,
width: "100%",
maxWidth: "1120px",
display: "grid",
gridTemplateColumns: "1fr 440px",
alignItems: "center",
gap: "64px",
margin: "auto",
},
intro: {
color: "#ffffff",
padding: "20px 0",
},
logo: {
width: "58px",
height: "58px",
display: "flex",
alignItems: "center",
justifyContent: "center",
borderRadius: "18px",
background: "rgba(255,255,255,0.12)",
border: "1px solid rgba(255,255,255,0.18)",
fontSize: "30px",
marginBottom: "30px",
},
eyebrow: {
color: "#76e3d5",
fontSize: "11px",
letterSpacing: "2px",
fontWeight: 700,
marginBottom: "18px",
},
heading: {
fontSize: "clamp(34px, 4vw, 52px)",
lineHeight: 1.15,
letterSpacing: "-1.5px",
margin: "0 0 22px",
fontWeight: 750,
},
headingAccent: {
color: "#75e1d3",
},
description: {
maxWidth: "490px",
color: "#c0d2e2",
fontSize: "15px",
lineHeight: 1.9,
marginBottom: "30px",
},
featureList: {
display: "grid",
gap: "17px",
marginBottom: "42px",
},
feature: {
display: "flex",
alignItems: "center",
gap: "13px",
color: "#e0edf5",
fontSize: "14px",
},
featureIcon: {
color: "#75e1d3",
fontSize: "20px",
width: "24px",
textAlign: "center",
},
footerNote: {
color: "#91adbf",
fontSize: "12px",
lineHeight: 1.7,
},
card: {
width: "100%",
boxSizing: "border-box",
background: "#ffffff",
borderRadius: "22px",
padding: "36px",
boxShadow: "0 25px 80px rgba(0,0,0,0.25)",
},
cardHeader: {
marginBottom: "24px",
},
cardEyebrow: {
color: "#138a91",
fontWeight: 700,
fontSize: "11px",
letterSpacing: "1.8px",
margin: "0 0 10px",
},
cardTitle: {
color: "#122b40",
fontSize: "25px",
lineHeight: 1.3,
margin: "0 0 8px",
},
cardDescription: {
color: "#718096",
fontSize: "13px",
lineHeight: 1.6,
margin: 0,
},
roleContainer: {
display: "grid",
gap: "10px",
marginBottom: "24px",
},
roleButton: {
display: "flex",
alignItems: "center",
gap: "12px",
width: "100%",
padding: "14px",
borderRadius: "12px",
border: "1px solid #dce5ec",
background: "#ffffff",
textAlign: "left",
cursor: "pointer",
color: "#243b50",
boxSizing: "border-box",
},
selectedRoleButton: {
border: "1.5px solid #138a91",
background: "#effbfa",
},
roleIcon: {
width: "40px",
height: "40px",
flexShrink: 0,
borderRadius: "10px",
background: "#e3f5f4",
color: "#117e83",
display: "flex",
alignItems: "center",
justifyContent: "center",
fontSize: "21px",
},
roleText: {
display: "grid",
gap: "4px",
flex: 1,
fontSize: "13px",
},
radio: {
color: "#138a91",
fontSize: "17px",
},
form: {
display: "grid",
gap: "10px",
},
label: {
fontSize: "12px",
color: "#34495e",
fontWeight: 650,
marginTop: "4px",
},
input: {
width: "100%",
boxSizing: "border-box",
padding: "13px 14px",
border: "1px solid #d8e1e9",
borderRadius: "10px",
outline: "none",
fontSize: "13px",
color: "#172b3a",
background: "#ffffff",
marginBottom: "8px",
},
error: {
background: "#fff0f0",
color: "#b42318",
border: "1px solid #ffd0d0",
borderRadius: "9px",
padding: "11px",
fontSize: "12px",
lineHeight: 1.6,
},
submitButton: {
width: "100%",
marginTop: "8px",
padding: "14px",
border: "none",
borderRadius: "10px",
background: "linear-gradient(100deg, #117f91, #12a79d)",
color: "#ffffff",
fontSize: "14px",
fontWeight: 700,
cursor: "pointer",
boxShadow: "0 7px 18px rgba(17,127,145,0.2)",
},
disabledButton: {
opacity: 0.65,
cursor: "wait",
},
securityNote: {
display: "flex",
alignItems: "center",
justifyContent: "center",
gap: "8px",
marginTop: "22px",
color: "#81909d",
fontSize: "11px",
},
};

export default Login;
