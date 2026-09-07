exports.handler = async function (event) {

    try {

        const tmdbId =
            event.queryStringParameters?.tmdbId;


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


        const apiKey =
            process.env.WATCHMODE_API_KEY;


        if (!apiKey) {

            return {
                statusCode: 500,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    error: "WATCHMODE_API_KEY is missing"
                })
            };

        }


        // ====================================================
        // FIND WATCHMODE TITLE USING TMDB ID
        // ====================================================

        const searchUrl =
            `https://api.watchmode.com/v1/search/` +
            `?apiKey=${encodeURIComponent(apiKey)}` +
            `&search_field=tmdb_id` +
            `&search_value=${encodeURIComponent(tmdbId)}`;


        const searchResponse =
            await fetch(searchUrl);


        const searchData =
            await searchResponse.json();


        console.log(
            "Watchmode search response:",
            searchData
        );


        if (!searchResponse.ok) {

            return {
                statusCode: searchResponse.status,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(searchData)
            };

        }


        const results =
            searchData.title_results || [];


        if (results.length === 0) {

            return {
                statusCode: 200,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    sources: [],
                    message:
                        "Title not found in Watchmode"
                })
            };

        }


        // ====================================================
        // WATCHMODE TITLE ID
        // ====================================================

        const watchmodeId =
            results[0].id;


        console.log(
            "Watchmode ID:",
            watchmodeId
        );


        // ====================================================
        // GET STREAMING SOURCES
        // ====================================================

        const sourcesUrl =
            `https://api.watchmode.com/v1/title/${watchmodeId}/sources/` +
            `?apiKey=${encodeURIComponent(apiKey)}` +
            `&regions=IN`;


        const sourcesResponse =
            await fetch(sourcesUrl);


        const sourcesData =
            await sourcesResponse.json();


        console.log(
            "Watchmode sources:",
            sourcesData
        );


        if (!sourcesResponse.ok) {

            return {
                statusCode: sourcesResponse.status,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(sourcesData)
            };

        }


        // ====================================================
        // SEND DATA TO FRONTEND
        // ====================================================

        return {

            statusCode: 200,

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                sources: sourcesData,

                watchmodeId:
                    watchmodeId

            })

        };


    } catch (error) {

        console.error(
            "Watchmode Function Error:",
            error
        );


        return {

            statusCode: 500,

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                error:
                    error.message

            })

        };

    }

};
