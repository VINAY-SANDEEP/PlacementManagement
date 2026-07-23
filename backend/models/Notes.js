const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema(
  {
    notesName: {
      type: String,
      required: true,
    },

    branch: {
      type: String,
      required: true,
    },

    semester: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
    },

    pdf: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notes", notesSchema);