require("dotenv").config();

function inspect(name, expectedLength) {
  const v = process.env[name];
  if (!v) return console.log(name, "-> MISSING");
  const bad = /["';\s]/.test(v);
  console.log(
    name, "-> length", v.length, "(expected " + expectedLength + ")",
    bad ? "| PROBLEM: contains a quote, semicolon or space" : "| format ok"
  );
}

(async () => {
  inspect("TMDB_API_KEY", 32);
  inspect("WATCHMODE_API_KEY", 40);

  try {
    const r = await fetch(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.TMDB_API_KEY}`);
    console.log("TMDB status:", r.status, r.status === 200 ? "OK" : "FAILED");
  } catch (e) {
    console.log("TMDB network error:", e.message, e.cause && e.cause.code);
  }

  try {
    const r = await fetch(
      `https://api.watchmode.com/v1/title/movie-550/sources/?apiKey=${process.env.WATCHMODE_API_KEY}&regions=IN`);
    console.log("Watchmode status:", r.status, r.status === 200 ? "OK" : "FAILED");
  } catch (e) {
    console.log("Watchmode network error:", e.message);
  }
})();