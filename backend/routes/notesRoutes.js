const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  createNotes,
  getNotes,
  getSingleNotes,
  updateNotes,
  deleteNotes,
} = require("../controllers/notesController");

router.post("/", upload.single("pdf"), createNotes);

router.get("/", getNotes);

router.get("/:id", getSingleNotes);

router.put("/:id", upload.single("pdf"), updateNotes);

router.delete("/:id", deleteNotes);

module.exports = router;