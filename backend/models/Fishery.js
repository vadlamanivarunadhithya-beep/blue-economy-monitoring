const mongoose = require("mongoose");

const fisherySchema = new mongoose.Schema(
  {
    region: {
      type: String,
      required: true,
    },

    species: {
      type: String,
      required: true,
    },

    production: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["Healthy", "Warning", "Critical"],
      default: "Healthy",
    },

    fishermen: {
      type: Number,
      default: 0,
    },

    vessels: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Fishery = mongoose.model("Fishery", fisherySchema);

module.exports = Fishery;