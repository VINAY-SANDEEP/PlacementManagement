const Placement = require("../models/Placement");

exports.createPlacement = async (req, res) => {
  try {
    const logo = req.files?.companyLogo?.[0]?.path || "";
    const pdf = req.files?.pdf?.[0]?.path || "";

    let branches = req.body.eligibleBranches || [];
    if (typeof branches === "string") {
      branches = branches.split(",").map(b => b.trim()).filter(Boolean);
    }

    const placement = await Placement.create({
      companyName: req.body.companyName,
      eligibleBranches: branches,
      eligibilityCriteria: req.body.eligibilityCriteria,
      campusType: req.body.campusType || "On Campus",
      jobDescription: req.body.jobDescription || "",
      expectedExamDate: req.body.expectedExamDate || "",
      ctc: req.body.ctc || "",
      formLink: req.body.formLink || "",
      surveyLink: req.body.surveyLink || "",
      companyLogo: logo,
      pdf: pdf,
    });

    res.json({
      success: true,
      message: "Placement Added",
      placement,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getPlacements = async (req, res) => {
  try {
    const placements = await Placement.find().sort({ createdAt: -1 });
    res.json(placements);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.getPlacement = async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id);
    if (!placement) {
      return res.status(404).json({ message: "Placement not found" });
    }
    res.json(placement);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.updatePlacement = async (req, res) => {
  try {
    const existing = await Placement.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "Placement not found" });
    }

    const updateData = { ...req.body };

    if (req.files?.companyLogo?.[0]?.path) {
      updateData.companyLogo = req.files.companyLogo[0].path;
    }
    if (req.files?.pdf?.[0]?.path) {
      updateData.pdf = req.files.pdf[0].path;
    }

    if (updateData.eligibleBranches) {
      if (typeof updateData.eligibleBranches === "string") {
        updateData.eligibleBranches = updateData.eligibleBranches.split(",").map(b => b.trim()).filter(Boolean);
      }
    }

    const placement = await Placement.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      placement,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.deletePlacement = async (req, res) => {
  try {
    await Placement.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: "Placement Deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};