const fs = require("fs");
const minioClient = require("../config/minio");
const Video = require("../models/Video");

// Upload video and metadata
exports.uploadVideo = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: "No video file uploaded" });
    }

    const fileName = Date.now() + "-" + file.originalname;

  // first i have to upload thevedio to minio
    await minioClient.fPutObject(
      process.env.BUCKET_NAME,
      fileName,
      file.path
    );

    fs.unlinkSync(file.path);

    // Save metadata in MongoDB
    const video = await Video.create({
      title: req.body.title,
      category: req.body.category,
      type: file.mimetype,
      size: file.size,
      videoUrl: `http://127.0.0.1:9000/${process.env.BUCKET_NAME}/${fileName}`
    });

    res.status(201).json({ success: true, video });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get ALL videos with presigned URLs
exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ uploadedAt: -1 });
    
    // Generate presigned URLs for ALL videos
    const videosWithPresignedUrls = await Promise.all(
      videos.map(async (video) => {
        try {
          const filename = video.videoUrl.split('/').pop();
          console.log('Generating presigned URL for filename:', filename);
          
          const presignedUrl = await minioClient.presignedGetObject(
            'videos',           
            filename,         
            24 * 60 * 60       
          );
          
          // Debug purpose for me to chack the presigned url is working or not ....
          console.log('Successfully generated presigned URL:', presignedUrl);
          
          return {
            ...video.toObject(),
            videoUrl: presignedUrl 
          };
        } catch (error) {
          console.error('Full error:', error);
          return {
            ...video.toObject(),
            videoUrl: null,
            error: `Failed to generate access URL: ${error.message}`
          };
        }
      })
    );
    
    res.json({ 
      success: true, 
      videos: videosWithPresignedUrls 
    });
  } catch (err) {
    console.error('Main error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

