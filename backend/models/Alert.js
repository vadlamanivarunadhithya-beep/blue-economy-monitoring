const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    title: {
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

    severity: {
      type: String,
      enum: ["High", "Medium", "Low"],
      required: true,
    },

    description: {
      type: String,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Alert = mongoose.model("Alert", alertSchema);

module.exports = Alert;