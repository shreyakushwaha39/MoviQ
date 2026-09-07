exports.handler = async function (event) {
    try {
        const titleId = event.queryStringParameters?.titleId;

        if (!titleId) {
            return {
                statusCode: 400,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    error: "titleId is missing"
                })
            };
        }

        const apiKey = process.env.WATCHMODE_API_KEY;

        if (!apiKey) {
            console.error("WATCHMODE_API_KEY is missing");

            return {
                statusCode: 500,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    error: "WATCHMODE_API_KEY is missing in Netlify"
                })
            };
        }

        const url =
            `https://api.watchmode.com/v1/title/${encodeURIComponent(titleId)}/sources/?regions=IN`;

        console.log("Calling Watchmode:");
        console.log(url);
        console.log("Title ID:", titleId);

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "X-API-Key": apiKey,
                "Accept": "application/json"
            }
        });

        const text = await response.text();

        console.log("Watchmode HTTP status:", response.status);
        console.log("Watchmode raw response:", text);

        let data;

        try {
            data = JSON.parse(text);
        } catch {
            data = {
                raw: text
            };
        }

        if (!response.ok) {
            return {
                statusCode: response.status,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    error:
                        data?.message ||
                        data?.error ||
                        "Watchmode API request failed",
                    status: response.status,
                    details: data
                })
            };
        }

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                sources: Array.isArray(data) ? data : [],
                titleId: titleId
            })
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
