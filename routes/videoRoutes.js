const express = require("express");
const router = express.Router();
const multer = require("multer");

// Temporary storage folder for multer
const upload = multer({ dest: "uploads/" });

const { uploadVideo,getVideos } = require("../controllers/videoController");

// Upload video (POST)
router.post("/upload", upload.single("video"), uploadVideo);

// Get ALL videos
router.get('/', getVideos);


module.exports = router;
