const Minio = require("minio");

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: Number(process.env.MINIO_PORT),
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

// Ensure bucket exists
minioClient.bucketExists(process.env.BUCKET_NAME, function (err, exists) {
  if (err) {
    // If bucket doesn't exist → create it
    if (err.code === "NoSuchBucket") {
      minioClient.makeBucket(process.env.BUCKET_NAME, "", function (err) {
        if (err) console.log("Bucket creation error:", err);
        else console.log(`Bucket '${process.env.BUCKET_NAME}' created.`);
      });
    } else {
      console.log(" Error checking bucket:", err);
    }
  } else if (exists) {
    console.log(` Bucket '${process.env.BUCKET_NAME}' already exists.`);
  }
});

module.exports = minioClient;
