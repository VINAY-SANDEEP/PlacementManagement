const express = require("express");
const upload = require("../middleware/upload");
const router = express.Router();

const {
  createPlacement,
  getPlacements,
  getPlacement,
  updatePlacement,
  deletePlacement,
} = require("../controllers/placementController");
router.post(
  "/",
  upload.fields([
    { name: "companyLogo", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  createPlacement
);
router.get("/", getPlacements);

router.get("/:id", getPlacement);

router.put(
  "/:id",
  upload.fields([
    { name: "companyLogo", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  updatePlacement
);

router.delete("/:id", deletePlacement);

module.exports = router;