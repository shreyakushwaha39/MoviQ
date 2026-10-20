const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const ALLOWED = ["/trending/", "/movie/", "/tv/", "/discover/", "/search/"];

export default async (req) => {
  const key = process.env.TMDB_API_KEY;
  if (!key) return json({ error: "TMDB_API_KEY is not set" }, 500);

  const url = new URL(req.url);
  const path = url.pathname.replace("/api/tmdb", "");

  if (!ALLOWED.some((p) => path.startsWith(p)))
    return json({ error: "Endpoint not allowed" }, 400);

  const params = new URLSearchParams(url.search);
  params.set("api_key", key);

  try {
    const r = await fetch(`https://api.themoviedb.org/3${path}?${params}`);
    return new Response(await r.text(), {
      status: r.status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=600",
      },
    });
  } catch (e) {
    return json({ error: "TMDB request failed" }, 502);
  }
};

export const config = { path: "/api/tmdb/*" };