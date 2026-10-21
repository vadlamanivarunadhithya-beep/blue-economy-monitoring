
const express = require("express");
const router = express.Router();

const MarineResource = require("../models/MarineResource");
const { adminOnly } = require("../middleware/authMiddleware");

// GET: Admin and Viewer can view resources
router.get("/", async (req, res) => {
  try {
    const resources = await MarineResource.find().sort({ createdAt: -1 });
    res.json(resources);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch marine resources",
      error: error.message,
    });
  }
});

// POST: Admin only
router.post("/", adminOnly, async (req, res) => {
  try {
    const resource = await MarineResource.create(req.body);
    res.status(201).json(resource);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create marine resource",
      error: error.message,
    });
  }
});

// PUT: Admin only
router.put("/:id", adminOnly, async (req, res) => {
  try {
    const resource = await MarineResource.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!resource) {
      return res.status(404).json({
        message: "Marine resource not found",
      });
    }

    res.json(resource);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update marine resource",
      error: error.message,
    });
  }
});

// DELETE: Admin only
router.delete("/:id", adminOnly, async (req, res) => {
  try {
    const resource = await MarineResource.findByIdAndDelete(req.params.id);

    if (!resource) {
      return res.status(404).json({
        message: "Marine resource not found",
      });
    }

    res.json({
      message: "Marine resource deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete marine resource",
      error: error.message,
    });
  }
});

module.exports = router;

