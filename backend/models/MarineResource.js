const mongoose = require("mongoose");

const marineResourceSchema = new mongoose.Schema(
  {
    resourceName: {
      type: String,
      required: true,
    },

    region: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    condition: {
      type: String,
      enum: ["Healthy", "Warning", "Critical"],
      default: "Healthy",
    },

    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const MarineResource = mongoose.model(
  "MarineResource",
  marineResourceSchema
);

module.exports = MarineResource;