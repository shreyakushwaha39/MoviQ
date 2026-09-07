exports.handler = async function (event) {

    try {

        const tmdbId =
            event.queryStringParameters?.tmdbId;

        const mediaType =
            event.queryStringParameters?.type || "movie";


        console.log("=================================");
        console.log("WATCHMODE FUNCTION START");
        console.log("TMDB ID:", tmdbId);
        console.log("Media Type:", mediaType);
        console.log("=================================");


        if (!tmdbId) {

            return {
                statusCode: 400,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    success: false,
                    step: "input",
                    error: "TMDB ID is missing"
                })
            };

        }


        const apiKey =
            process.env.WATCHMODE_API_KEY;


        if (!apiKey) {

            console.error(
                "WATCHMODE_API_KEY DOES NOT EXIST"
            );


            return {
                statusCode: 500,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    success: false,
                    step: "environment",
                    error:
                        "WATCHMODE_API_KEY is missing in Netlify"
                })
            };

        }


        console.log(
            "Watchmode API key exists."
        );


        // =====================================================
        // STEP 1 — FIND WATCHMODE TITLE
        // =====================================================

        const searchUrl =
            "https://api.watchmode.com/v1/search/" +
            "?apiKey=" +
            encodeURIComponent(apiKey) +
            "&search_field=tmdb_id" +
            "&search_value=" +
            encodeURIComponent(tmdbId);


        console.log(
            "Watchmode search URL:",
            searchUrl.replace(
                apiKey,
                "HIDDEN_API_KEY"
            )
        );


        const searchResponse =
            await fetch(searchUrl);


        const searchText =
            await searchResponse.text();


        console.log(
            "Search HTTP status:",
            searchResponse.status
        );


        console.log(
            "Search raw response:",
            searchText
        );


        let searchData;


        try {

            searchData =
                JSON.parse(searchText);

        } catch (error) {

            return {
                statusCode: 500,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({

                    success: false,

                    step: "search-json",

                    error:
                        "Watchmode returned invalid JSON",

                    status:
                        searchResponse.status,

                    raw:
                        searchText

                })
            };

        }


        if (!searchResponse.ok) {

            return {
                statusCode: searchResponse.status,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({

                    success: false,

                    step: "search",

                    status:
                        searchResponse.status,

                    watchmode:
                        searchData

                })
            };

        }


        console.log(
            "Search data:",
            searchData
        );


        // =====================================================
        // STEP 2 — GET WATCHMODE ID
        // =====================================================

        const results =
            searchData.title_results || [];


        console.log(
            "Title results:",
            results
        );


        if (results.length === 0) {

            return {
                statusCode: 200,

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    success: true,

                    step:
                        "title-not-found",

                    tmdbId:
                        tmdbId,

                    sources: [],

                    message:
                        "Watchmode could not find this TMDB title."

                })

            };

        }


        const watchmodeId =
            results[0].id;


        console.log(
            "Watchmode ID:",
            watchmodeId
        );


        // =====================================================
        // STEP 3 — GET STREAMING SOURCES
        // =====================================================

        const sourcesUrl =
            "https://api.watchmode.com/v1/title/" +
            encodeURIComponent(watchmodeId) +
            "/sources/" +
            "?apiKey=" +
            encodeURIComponent(apiKey) +
            "&regions=IN";


        console.log(
            "Sources URL:",
            sourcesUrl.replace(
                apiKey,
                "HIDDEN_API_KEY"
            )
        );


        const sourcesResponse =
            await fetch(sourcesUrl);


        const sourcesText =
            await sourcesResponse.text();


        console.log(
            "Sources HTTP status:",
            sourcesResponse.status
        );


        console.log(
            "Sources raw response:",
            sourcesText
        );


        let sourcesData;


        try {

            sourcesData =
                JSON.parse(sourcesText);

        } catch (error) {

            return {
                statusCode: 500,

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    success: false,

                    step:
                        "sources-json",

                    error:
                        "Watchmode returned invalid source JSON",

                    status:
                        sourcesResponse.status,

                    raw:
                        sourcesText

                })
            };

        }


        if (!sourcesResponse.ok) {

            return {

                statusCode:
                    sourcesResponse.status,

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify({

                        success: false,

                        step:
                            "sources",

                        status:
                            sourcesResponse.status,

                        watchmode:
                            sourcesData

                    })

            };

        }


        // =====================================================
        // SUCCESS
        // =====================================================

        console.log(
            "FINAL SOURCES:",
            sourcesData
        );


        return {

            statusCode: 200,

            headers: {
                "Content-Type":
                    "application/json"
            },

            body:
                JSON.stringify({

                    success: true,

                    step:
                        "complete",

                    tmdbId:
                        tmdbId,

                    mediaType:
                        mediaType,

                    watchmodeId:
                        watchmodeId,

                    sources:
                        sourcesData

                })

        };


    } catch (error) {

        console.error(
            "WATCHMODE FUNCTION ERROR:",
            error
        );


        return {

            statusCode: 500,

            headers: {
                "Content-Type":
                    "application/json"
            },

            body:
                JSON.stringify({

                    success: false,

                    step:
                        "exception",

                    error:
                        error.message

                })

        };

    }

};
