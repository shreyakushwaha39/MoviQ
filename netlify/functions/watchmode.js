exports.handler = async function (event) {
    try {
        const tmdbId = event.queryStringParameters?.tmdbId;
        const type = event.queryStringParameters?.type;

        if (!tmdbId || !type) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: "Missing tmdbId or type"
                })
            };
        }

        const url =
            `https://api.watchmode.com/v1/title/${tmdbId}/sources/` +
            `?apiKey=${process.env.WATCHMODE_API_KEY}` +
            `&regions=IN`;

        const response = await fetch(url);

        const data = await response.json();

        return {
            statusCode: response.status,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };

    } catch (error) {
        console.error("Watchmode Function Error:", error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                error: "Failed to fetch Watchmode data"
            })
        };
    }
};
