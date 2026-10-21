
const express = require("express");
const router = express.Router();

const Industry = require("../models/Industry");
const { adminOnly } = require("../middleware/authMiddleware");

// GET all industries — Admin and Viewer
router.get("/", async (req, res) => {
  try {
    const industries = await Industry.find().sort({ createdAt: -1 });

    res.json(industries);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch industries",
      error: error.message,
    });
  }
});

// POST a new industry — Admin only
router.post("/", adminOnly, async (req, res) => {
  try {
    const industry = await Industry.create(req.body);

    res.status(201).json(industry);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create industry",
      error: error.message,
    });
  }
});

// PUT update an industry — Admin only
router.put("/:id", adminOnly, async (req, res) => {
  try {
    const industry = await Industry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!industry) {
      return res.status(404).json({
        message: "Industry not found",
      });
    }

    res.json(industry);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update industry",
      error: error.message,
    });
  }
});

// DELETE an industry — Admin only
router.delete("/:id", adminOnly, async (req, res) => {
  try {
    const industry = await Industry.findByIdAndDelete(req.params.id);

    if (!industry) {
      return res.status(404).json({
        message: "Industry not found",
      });
    }

    res.json({
      message: "Industry deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete industry",
      error: error.message,
    });
  }
});

module.exports = router;
