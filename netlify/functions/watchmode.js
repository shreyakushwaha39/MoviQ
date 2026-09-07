exports.handler = async function (event) {
    try {
        const tmdbId = event.queryStringParameters?.tmdbId;

        if (!tmdbId) {
            return {
                statusCode: 400,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    error: "TMDB ID is required"
                })
            };
        }

        const apiKey = process.env.WATCHMODE_API_KEY;

        if (!apiKey) {
            return {
                statusCode: 500,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    error: "Watchmode API key is not configured"
                })
            };
        }

        const url =
            `https://api.watchmode.com/v1/title/${tmdbId}/sources/?apiKey=${apiKey}&regions=IN`;

        const response = await fetch(url);

        const data = await response.json();

        console.log("Watchmode response:", data);

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
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                error: error.message
            })
        };
    }
};
