const News = require("../models/News");

// Create
exports.createNews = async (req, res) => {
  try {
    const news = await News.create(req.body);

    res.json({
      success: true,
      news,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Get All
exports.getNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });

    res.json(news);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Get One
exports.getSingleNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    res.json(news);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Update
exports.updateNews = async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      news,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Delete
exports.deleteNews = async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "News Deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};