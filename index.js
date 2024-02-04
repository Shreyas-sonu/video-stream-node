const express = require("express");
const app = express();
const fs = require("fs");

app.get("/", function (req, res) {
  res.json({ data: "hello" });
  // res.sendFile(__dirname + "/index.html");
});
// const axios = require("axios");

// app.get("/video", async function (req, res) {
//   // Ensure there is a range given for the video
//   const range = req.headers.range;
//   if (!range) {
//     res.status(400).send("Requires Range header");
//   }

//   // Get video path from request headers
//   const videoPath = req.headers.videopath; // Assuming you set this header in the request

//   try {
//     // Fetch video stats from the remote server (adjust the API endpoint accordingly)
//     const videoStatsResponse = await axios.get(videoPath);
//     const videoSize = videoStatsResponse.headers["content-length"];

//     // Parse Range
//     const CHUNK_SIZE = 10 ** 6; // 1MB
//     const start = Number(range.replace(/\D/g, ""));
//     const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

//     // Create headers
//     const contentLength = end - start + 1;
//     const headers = {
//       "Content-Range": `bytes ${start}-${end}/${videoSize}`,
//       "Accept-Ranges": "bytes",
//       "Content-Length": contentLength,
//       "Content-Type": "video/mp4",
//     };

//     // HTTP Status 206 for Partial Content
//     res.writeHead(206, headers);

//     // Fetch video chunk from the remote server
//     const videoChunkResponse = await axios.get(videoPath, {
//       headers: {
//         Range: `bytes=${start}-${end}`,
//       },
//       responseType: "stream",
//     });

//     // Stream the video chunk to the client
//     videoChunkResponse.data.pipe(res);
//   } catch (error) {
//     console.error("Error fetching video:", error);
//     res.status(500).send("Error fetching video");
//   }
// });

app.get("/video", function (req, res) {
  // Ensure there is a range given for the video
  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Requires Range header");
  }

  // get video stats (about 61MB)
  const videoPath = "media.mp4";
  const videoSize = fs.statSync("media.mp4").size;

  // Parse Range
  // Example: "bytes=32324-"
  const CHUNK_SIZE = 10 ** 6; // 1MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  // Create headers
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  // HTTP Status 206 for Partial Content
  res.writeHead(206, headers);

  // create video read stream for this particular chunk
  const videoStream = fs.createReadStream(videoPath, { start, end });

  // Stream the video chunk to the client
  videoStream.pipe(res);
});

app.listen(4007, "0.0.0.0", function () {
  console.log("Listening on port 4007!");
});
