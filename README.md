# MinIO Video Storage App

A Node.js application for storing and streaming videos using MinIO object storage.

## Features

- Video file upload and storage
- Presigned URL generation for secure access
- MongoDB for metadata storage
- RESTful API

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env`
4. Start MinIO server
5. Run the app: `npm start`



## API Endpoints

Upload Video
    URL: http://localhost:5000/videos/upload

        Method: POST

        Body: form-data

        title: "Test Video"

        category: "Tutorial"

        video: (file) Choose from your gallery

Get All Videos
    URL: http://localhost:5000/videos

    Method: GET

    Response: Returns all videos with presigned URLs



## Prerequisites
    Node.js installed

    MongoDB running locally or remotely

    MinIO server running on port 9000

## Usage
    Start MinIO server:

    bash
    minio server /path/to/minio-data
    Start the application:

    bash
    npm start
    Use the API endpoints to upload and retrieve videos


## Environment Variables

```env
PORT=5000
MONGODB_URI="this is my local mongodb url u should use your own db url"
MINIO_ENDPOINT=127.0.0.1
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=videos

