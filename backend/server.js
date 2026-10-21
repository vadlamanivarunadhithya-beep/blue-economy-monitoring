const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

const marineResourceRoutes = require("./routes/marineResources");
const fisheryRoutes = require("./routes/fisheries");
const industryRoutes = require("./routes/industries");
const economicIndicatorRoutes = require("./routes/economicIndicators");
const alertRoutes = require("./routes/alerts");
const authRoutes = require("./routes/auth");

const { protect } = require("./middleware/authMiddleware");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Blue Economy Monitoring API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend is healthy",
  });
});

// Authentication routes remain public
app.use("/api/auth", authRoutes);

// Protect the Blue Economy APIs
app.use("/api/marine-resources", protect, marineResourceRoutes);
app.use("/api/fisheries", protect, fisheryRoutes);
app.use("/api/industries", protect, industryRoutes);
app.use("/api/economic-indicators", protect, economicIndicatorRoutes);
app.use("/api/alerts", protect, alertRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});