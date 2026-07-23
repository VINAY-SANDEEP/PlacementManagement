const Notes = require("../models/Notes");

// Create
exports.createNotes = async (req, res) => {
  try {
    const notes = await Notes.create({
      notesName: req.body.notesName,
      branch: req.body.branch,
      semester: req.body.semester,
      description: req.body.description,
      pdf: req.file ? req.file.path : "",
    });

    res.json({
      success: true,
      notes,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Get All
exports.getNotes = async (req, res) => {
  try {
    const notes = await Notes.find().sort({ createdAt: -1 });

    res.json(notes);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Get One
exports.getSingleNotes = async (req, res) => {
  try {
    const notes = await Notes.findById(req.params.id);

    res.json(notes);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Update
exports.updateNotes = async (req, res) => {
  try {
    const data = {
      notesName: req.body.notesName,
      branch: req.body.branch,
      semester: req.body.semester,
      description: req.body.description,
    };

    if (req.file) {
      data.pdf = req.file.path;
    }

    const notes = await Notes.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    );

    res.json({
      success: true,
      notes,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Delete
exports.deleteNotes = async (req, res) => {
  try {
    await Notes.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Notes Deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};