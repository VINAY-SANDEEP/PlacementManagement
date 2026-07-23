const express = require("express");
const router = express.Router();

const {
  createNews,
  getNews,
  getSingleNews,
  updateNews,
  deleteNews,
} = require("../controllers/newsController");

router.post("/", createNews);

router.get("/", getNews);

router.get("/:id", getSingleNews);

router.put("/:id", updateNews);

router.delete("/:id", deleteNews);

module.exports = router;