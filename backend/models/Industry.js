const mongoose = require("mongoose");

const industrySchema = new mongoose.Schema(
  {
    name: {
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

    economicValue: {
      type: Number,
      required: true,
    },

    employees: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["Active", "Monitoring", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

const Industry = mongoose.model("Industry", industrySchema);

module.exports = Industry;