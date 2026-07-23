const express = require("express");
const upload = require("../middleware/upload");

const router = express.Router();

router.post("/", upload.single("file"), (req, res) => {
    res.json({
        success: true,
        url: req.file.path,
    });
});

module.exports = router;