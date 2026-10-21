
const express = require("express");
const router = express.Router();

const EconomicIndicator = require("../models/EconomicIndicator");
const { adminOnly } = require("../middleware/authMiddleware");

// GET all economic indicators — Admin and Viewer
router.get("/", async (req, res) => {
  try {
    const indicators = await EconomicIndicator.find().sort({
      createdAt: -1,
    });

    res.json(indicators);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch economic indicators",
      error: error.message,
    });
  }
});

// POST a new economic indicator — Admin only
router.post("/", adminOnly, async (req, res) => {
  try {
    const indicator = await EconomicIndicator.create(req.body);

    res.status(201).json(indicator);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create economic indicator",
      error: error.message,
    });
  }
});

// PUT update an economic indicator — Admin only
router.put("/:id", adminOnly, async (req, res) => {
  try {
    const indicator = await EconomicIndicator.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!indicator) {
      return res.status(404).json({
        message: "Economic indicator not found",
      });
    }

    res.json(indicator);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update economic indicator",
      error: error.message,
    });
  }
});

// DELETE an economic indicator — Admin only
router.delete("/:id", adminOnly, async (req, res) => {
  try {
    const indicator = await EconomicIndicator.findByIdAndDelete(
      req.params.id
    );

    if (!indicator) {
      return res.status(404).json({
        message: "Economic indicator not found",
      });
    }

    res.json({
      message: "Economic indicator deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete economic indicator",
      error: error.message,
    });
  }
});

module.exports = router;

