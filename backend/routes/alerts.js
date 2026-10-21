
const express = require("express");
const router = express.Router();

const Alert = require("../models/Alert");
const { adminOnly } = require("../middleware/authMiddleware");

// GET all alerts - Admin and Viewer
router.get("/", async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch alerts",
      error: error.message,
    });
  }
});

// POST a new alert - Admin only
router.post("/", adminOnly, async (req, res) => {
  try {
    const alert = await Alert.create(req.body);
    res.status(201).json(alert);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create alert",
      error: error.message,
    });
  }
});

// PUT update an alert - Admin only
router.put("/:id", adminOnly, async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!alert) {
      return res.status(404).json({
        message: "Alert not found",
      });
    }

    res.json(alert);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update alert",
      error: error.message,
    });
  }
});

// DELETE an alert - Admin only
router.delete("/:id", adminOnly, async (req, res) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);

    if (!alert) {
      return res.status(404).json({
        message: "Alert not found",
      });
    }

    res.json({
      message: "Alert deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete alert",
      error: error.message,
    });
  }
});

module.exports = router;
