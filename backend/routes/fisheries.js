
const express = require("express");
const router = express.Router();

const Fishery = require("../models/Fishery");
const { adminOnly } = require("../middleware/authMiddleware");

// GET all fisheries — Admin and Viewer
router.get("/", async (req, res) => {
  try {
    const fisheries = await Fishery.find().sort({ createdAt: -1 });

    res.json(fisheries);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch fisheries",
      error: error.message,
    });
  }
});

// POST a new fishery record — Admin only
router.post("/", adminOnly, async (req, res) => {
  try {
    const fishery = await Fishery.create(req.body);

    res.status(201).json(fishery);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create fishery record",
      error: error.message,
    });
  }
});

// PUT update a fishery — Admin only
router.put("/:id", adminOnly, async (req, res) => {
  try {
    const fishery = await Fishery.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!fishery) {
      return res.status(404).json({
        message: "Fishery record not found",
      });
    }

    res.json(fishery);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update fishery record",
      error: error.message,
    });
  }
});

// DELETE a fishery — Admin only
router.delete("/:id", adminOnly, async (req, res) => {
  try {
    const fishery = await Fishery.findByIdAndDelete(req.params.id);

    if (!fishery) {
      return res.status(404).json({
        message: "Fishery record not found",
      });
    }

    res.json({
      message: "Fishery record deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete fishery record",
      error: error.message,
    });
  }
});

module.exports = router;

