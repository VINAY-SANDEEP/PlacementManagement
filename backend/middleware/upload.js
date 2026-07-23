const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {

    if (file.mimetype === "application/pdf") {
      return {
        folder: "CampusPortal/PDFs",
        resource_type: "raw",
      };
    }

    return {
      folder: "CampusPortal/Logos",
      resource_type: "image",
    };
  },
});

const upload = multer({ storage });

module.exports = upload;