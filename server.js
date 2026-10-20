require("dotenv").config();
const path = require("path");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

const TMDB_KEY = process.env.TMDB_API_KEY;
const WATCHMODE_KEY = process.env.WATCHMODE_API_KEY;

if (!TMDB_KEY || !WATCHMODE_KEY) {
  console.error("Missing TMDB_API_KEY or WATCHMODE_API_KEY");
  process.exit(1);
}

const TMDB_ALLOWED = ["/trending/", "/movie/", "/tv/", "/discover/", "/search/"];

app.use("/api/tmdb", async (req, res) => {
  try {
    if (!TMDB_ALLOWED.some((p) => req.path.startsWith(p)))
      return res.status(400).json({ error: "Endpoint not allowed" });

    const params = new URLSearchParams(req.query);
    params.set("api_key", TMDB_KEY);

    const r = await fetch(`https://api.themoviedb.org/3${req.path}?${params}`);
    res.status(r.status).json(await r.json());
  } catch (e) {
    console.error("TMDB proxy:", e.message);
    res.status(502).json({ error: "TMDB request failed" });
  }
});

app.use("/api/watchmode", async (req, res) => {
  try {
    if (!/^\/title\/(movie|tv)-\d+\/sources\/?$/.test(req.path))
      return res.status(400).json({ error: "Endpoint not allowed" });

    const params = new URLSearchParams({
      apiKey: WATCHMODE_KEY,
      regions: req.query.regions || "IN",
    });

    const r = await fetch(`https://api.watchmode.com/v1${req.path}?${params}`);
    res.status(r.status).json(await r.json());
  } catch (e) {
    console.error("Watchmode proxy:", e.message);
    res.status(502).json({ error: "Watchmode request failed" });
  }
});

app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => console.log("MoviQ running on", PORT));