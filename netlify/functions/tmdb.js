exports.handler = async function (event) {
    try {
        const endpoint = event.queryStringParameters?.endpoint;

        if (!endpoint) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: "Missing TMDB endpoint"
                })
            };
        }

        const url = `https://api.themoviedb.org/3${endpoint}`;

        const separator = endpoint.includes("?") ? "&" : "?";

        const response = await fetch(
            `${url}${separator}api_key=${process.env.TMDB_API_KEY}`
        );

        const data = await response.json();

        return {
            statusCode: response.status,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };

    } catch (error) {
        console.error("TMDB Function Error:", error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                error: "Failed to fetch TMDB data"
            })
        };
    }
};
