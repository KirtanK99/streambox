const express = require("express");
const cors = require("cors");
const data = require("./data/videos.json");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

/**
 * GET /categories – fetch all categories
 * Returns a plain array of category names, e.g.:
 * ["Action", "Comedy", "Drama", "Sci-Fi", "Documentary"]
 */
app.get("/categories", (req, res) => {
  res.json(data.categories);
});

/**
 * GET /videos
 *
 * Optional query param:
 *   - category=Comedy  → filter videos by category (case-insensitive)
 *
 * Examples:
 *   /videos                     -> all videos
 *   /videos?category=Comedy     -> only Comedy videos
 *
 * NOTE: Search (by title or category) is intentionally handled
 * entirely on the client side to keep the backend simple and
 * aligned with the exercise requirements.
 */
app.get("/videos", (req, res) => {
  const { category } = req.query;

  let videos = data.videos;

  if (category) {
    const categoryLower = category.toLowerCase();
    videos = videos.filter(
      (video) => (video.category || "").toLowerCase() === categoryLower
    );
  }

  // Return a plain array per spec
  res.json(videos);
});

/**
 * GET /videos/:id – fetch video details by ID
 * Returns 404 if not found.
 */
app.get("/videos/:id", (req, res) => {
  const { id } = req.params;
  const video = data.videos.find((v) => String(v.id) === String(id));

  if (!video) {
    return res.status(404).json({ message: "Video not found" });
  }

  res.json(video);
});

/**
 * Simple health check
 */
app.get("/", (req, res) => {
  res.send("StreamBox API is running");
});

app.listen(PORT, () => {
  console.log(`StreamBox backend listening on http://localhost:${PORT}`);
});
