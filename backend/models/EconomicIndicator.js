const mongoose = require("mongoose");

const economicIndicatorSchema = new mongoose.Schema(
  {
    sector: {
      type: String,
      required: true,
    },

    region: {
      type: String,
      required: true,
    },

    economicValue: {
      type: Number,
      required: true,
    },

    growth: {
      type: Number,
      required: true,
    },

    employment: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Growing", "Stable", "Declining"],
      default: "Growing",
    },
  },
  {
    timestamps: true,
  }
);

const EconomicIndicator = mongoose.model(
  "EconomicIndicator",
  economicIndicatorSchema
);

module.exports = EconomicIndicator;