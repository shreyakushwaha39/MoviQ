const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export default async (req) => {
  const key = process.env.WATCHMODE_API_KEY;
  if (!key) return json({ error: "WATCHMODE_API_KEY is not set" }, 500);

  const url = new URL(req.url);
  const path = url.pathname.replace("/api/watchmode", "");

  if (!/^\/title\/(movie|tv)-\d+\/sources\/?$/.test(path))
    return json({ error: "Endpoint not allowed" }, 400);

  const params = new URLSearchParams({
    apiKey: key,
    regions: url.searchParams.get("regions") || "IN",
  });

  try {
    const r = await fetch(`https://api.watchmode.com/v1${path}?${params}`);
    return new Response(await r.text(), {
      status: r.status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (e) {
    return json({ error: "Watchmode request failed" }, 502);
  }
};

export const config = { path: "/api/watchmode/*" };