const mongoose = require("mongoose");

const placementSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },

    companyLogo: {
      type: String,
    },

    eligibleBranches: [
      {
        type: String,
      },
    ],

    eligibilityCriteria: {
      type: String,
    },

    campusType: {
      type: String,
      enum: ["On Campus", "Off Campus"],
    },

    jobDescription: {
      type: String,
    },

    pdf: {
      type: String,
    },

    expectedExamDate: {
      type: String,
    },

    ctc: {
      type: String,
    },

    formLink: {
      type: String,
    },

    surveyLink: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Placement", placementSchema);