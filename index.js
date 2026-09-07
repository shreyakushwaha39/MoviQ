const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const TMDB_BACKDROP_URL = "https://image.tmdb.org/t/p/original";


// ============================================================
// PAGE INITIALIZATION
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    initializeSplashScreen();

    // HOME PAGE
    if (document.querySelector(".trending")) {
        initializeHomePage();
    }

    // DETAILS PAGE
    if (document.querySelector(".movie-hero")) {
        initializeDetailsPage();
    }

    // SEARCH
    initializeSearch();

    // VOICE SEARCH
    initializeVoiceSearch();

    // BACK BUTTON
    initializeBackButton();

});


// ============================================================
// SPLASH SCREEN
// ============================================================

function initializeSplashScreen() {

    const splash =
        document.getElementById("splash-screen");

    if (!splash) {
        return;
    }

    if (sessionStorage.getItem("moviqSplashShown")) {

        splash.style.display = "none";

        return;
    }

    sessionStorage.setItem(
        "moviqSplashShown",
        "true"
    );

    setTimeout(function () {

        splash.classList.add("hide");

        setTimeout(function () {

            splash.style.display = "none";

        }, 1000);

    }, 4000);

}


// ============================================================
// TMDB FETCH
// ============================================================

async function fetchTMDB(endpoint) {

    try {

        const response = await fetch(
            `/.netlify/functions/tmdb?endpoint=${encodeURIComponent(endpoint)}`
        );

        if (!response.ok) {

            throw new Error(
                `TMDB API error: ${response.status}`
            );

        }

        return await response.json();

    } catch (error) {

        console.error(
            "TMDB Fetch Error:",
            error
        );

        throw error;

    }

}


// ============================================================
// HOME PAGE
// ============================================================

async function initializeHomePage() {

    const trendingContainer =
        document.querySelector(
            ".trending .movie-container"
        );

    const topRatedContainer =
        document.querySelector(
            ".top-rated .movie-container"
        );

    const popularContainer =
        document.querySelector(
            ".popular .movie-container"
        );

    const upcomingContainer =
        document.querySelector(
            ".upcoming .movie-container"
        );


    if (trendingContainer) {

        loadMovies(
            "trending",
            trendingContainer
        );

    }


    if (topRatedContainer) {

        loadMovies(
            "top-rated",
            topRatedContainer
        );

    }


    if (popularContainer) {

        loadMovies(
            "popular",
            popularContainer
        );

    }


    if (upcomingContainer) {

        loadMovies(
            "upcoming",
            upcomingContainer
        );

    }


    initializeSectionTabs();

    initializeGenre();

}


// ============================================================
// LOAD MOVIES
// ============================================================

async function loadMovies(
    type,
    container
) {

    if (!container) {
        return;
    }

    showLoading(container);

    let endpoint = "";


    switch (type) {

        case "trending":

            endpoint =
                "/trending/movie/week";

            break;


        case "top-rated":

            endpoint =
                "/movie/top_rated";

            break;


        case "popular":

            endpoint =
                "/movie/popular";

            break;


        case "upcoming":

            endpoint =
                "/movie/upcoming";

            break;


        default:

            return;

    }


    try {

        const data =
            await fetchTMDB(endpoint);


        if (
            !data ||
            !data.results
        ) {

            throw new Error(
                "Invalid TMDB response"
            );

        }


        displayMovies(
            data.results,
            container,
            "movie"
        );


    } catch (error) {

        console.error(
            `${type} error:`,
            error
        );


        showError(
            container,
            "Unable to load movies."
        );

    }

}


// ============================================================
// LOAD SERIES
// ============================================================

async function loadSeries(
    type,
    container
) {

    if (!container) {
        return;
    }

    showLoading(container);

    let endpoint = "";


    switch (type) {

        case "trending":

            endpoint =
                "/trending/tv/week";

            break;


        case "top-rated":

            endpoint =
                "/tv/top_rated";

            break;


        case "popular":

            endpoint =
                "/tv/popular";

            break;


        default:

            return;

    }


    try {

        const data =
            await fetchTMDB(endpoint);


        if (
            !data ||
            !data.results
        ) {

            throw new Error(
                "Invalid TMDB response"
            );

        }


        displayMovies(
            data.results,
            container,
            "tv"
        );


    } catch (error) {

        console.error(
            `${type} series error:`,
            error
        );


        showError(
            container,
            "Unable to load series."
        );

    }

}


// ============================================================
// DISPLAY MOVIE / SERIES CARDS
// ============================================================

function displayMovies(
    items,
    container,
    mediaType
) {

    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (
        !items ||
        items.length === 0
    ) {

        container.innerHTML = `
            <p class="empty-message">
                No results found.
            </p>
        `;

        return;
    }


    items.forEach(function (item) {

        const card =
            document.createElement("div");


        card.classList.add(
            "movie-card"
        );


        const title =
            item.title ||
            item.name ||
            "Unknown";


        const releaseDate =
            item.release_date ||
            item.first_air_date ||
            "";


        const year =
            releaseDate
                ? releaseDate.substring(0, 4)
                : "N/A";


        const rating =
            item.vote_average
                ? Number(
                    item.vote_average
                ).toFixed(1)
                : "N/A";


        let posterHTML = "";


        if (item.poster_path) {

            posterHTML = `
                <img
                    src="${TMDB_IMAGE_URL}${item.poster_path}"
                    alt="${escapeHTML(title)}"
                    loading="lazy"
                >
            `;

        } else {

            posterHTML = `
                <div class="no-image">
                    <span>No Image</span>
                </div>
            `;

        }


        card.innerHTML = `

            ${posterHTML}

            <div class="movie-info">

                <h3>
                    ${escapeHTML(title)}
                </h3>

                <div class="movie-meta">

                    <span>
                        <i class="fa-solid fa-star"></i>
                        ${rating}
                    </span>

                    <span>
                        ${year}
                    </span>

                </div>

            </div>

        `;


        card.addEventListener(
            "click",
            function () {

                window.location.href =
                    `movie-details.html?id=${item.id}&type=${mediaType}`;

            }
        );


        container.appendChild(card);

    });

}


// ============================================================
// HOME PAGE TABS
// ============================================================

function initializeSectionTabs() {

    const sections = [
        ".trending",
        ".top-rated",
        ".popular"
    ];


    sections.forEach(
        function (sectionSelector) {

            const section =
                document.querySelector(
                    sectionSelector
                );


            if (!section) {
                return;
            }


            const tabs =
                section.querySelectorAll(
                    ".tab"
                );


            const container =
                section.querySelector(
                    ".movie-container"
                );


            if (
                !tabs.length ||
                !container
            ) {

                return;

            }


            tabs.forEach(
                function (tab) {

                    tab.addEventListener(
                        "click",
                        function () {

                            tabs.forEach(
                                function (t) {

                                    t.classList.remove(
                                        "active"
                                    );

                                }
                            );


                            tab.classList.add(
                                "active"
                            );


                            const type =
                                tab.dataset.tab;


                            const sectionClass =
                                sectionSelector.replace(
                                    ".",
                                    ""
                                );


                            if (
                                type === "movies"
                            ) {

                                loadMovies(

                                    sectionClass === "top-rated"
                                        ? "top-rated"
                                        : sectionClass === "popular"
                                            ? "popular"
                                            : "trending",

                                    container

                                );

                            } else {

                                loadSeries(

                                    sectionClass === "top-rated"
                                        ? "top-rated"
                                        : sectionClass === "popular"
                                            ? "popular"
                                            : "trending",

                                    container

                                );

                            }

                        }
                    );

                }
            );

        }
    );

}


// ============================================================
// TMDB GENRES
// ============================================================

const MOVIE_GENRES = {

    "Action": 28,
    "Adventure": 12,
    "Comedy": 35,
    "Drama": 18,
    "Horror": 27,
    "Romance": 10749,
    "Sci-Fi": 878,
    "Fantasy": 14,
    "Animation": 16,
    "Thriller": 53,
    "Crime": 80,
    "Mystery": 9648

};


const TV_GENRES = {

    "Action": 10759,
    "Adventure": 10759,
    "Comedy": 35,
    "Drama": 18,
    "Horror": 27,
    "Romance": 10749,
    "Sci-Fi": 10765,
    "Fantasy": 10765,
    "Animation": 16,
    "Thriller": 53,
    "Crime": 80,
    "Mystery": 9648

};


// ============================================================
// GENRE INITIALIZATION
// ============================================================

function initializeGenre() {

    const genreSection =
        document.querySelector(".genre");


    if (!genreSection) {
        return;
    }


    const genreHeader =
        document.getElementById(
            "genre-header"
        );


    const genreList =
        genreSection.querySelector(
            ".genre-list"
        );


    const tabs =
        genreSection.querySelectorAll(
            ".tab"
        );


    const container =
        genreSection.querySelector(
            ".movie-container"
        );


    if (
        !genreList ||
        !container
    ) {

        return;
    }


    genreList.style.display =
        "none";


    let selectedGenre = null;

    let selectedType = "movies";


    // ========================================================
    // GENRE HEADER
    // ========================================================

    if (genreHeader) {

        genreHeader.addEventListener(
            "click",
            function () {

                if (
                    genreList.style.display ===
                    "none"
                ) {

                    genreList.style.display =
                        "flex";

                } else {

                    genreList.style.display =
                        "none";

                }

            }
        );

    }


    // ========================================================
    // GENRE SELECTION
    // ========================================================

    const genreItems =
        genreList.querySelectorAll(
            "li"
        );


    genreItems.forEach(
        function (item) {

            item.addEventListener(
                "click",
                function () {

                    const genreName =
                        item.textContent.trim();


                    if (
                        selectedType === "movies" &&
                        !MOVIE_GENRES[genreName]
                    ) {

                        showGenreUnavailable(
                            container,
                            genreName,
                            "movies"
                        );

                        return;
                    }


                    if (
                        selectedType === "tv" &&
                        !TV_GENRES[genreName]
                    ) {

                        showGenreUnavailable(
                            container,
                            genreName,
                            "series"
                        );

                        return;
                    }


                    genreItems.forEach(
                        function (genre) {

                            genre.classList.remove(
                                "active"
                            );

                        }
                    );


                    item.classList.add(
                        "active"
                    );


                    selectedGenre =
                        genreName;


                    loadGenreContent(
                        selectedGenre,
                        selectedType,
                        container
                    );

                }
            );

        }
    );


    // ========================================================
    // MOVIES / SERIES TABS
    // ========================================================

    tabs.forEach(
        function (tab) {

            tab.addEventListener(
                "click",
                function () {

                    tabs.forEach(
                        function (t) {

                            t.classList.remove(
                                "active"
                            );

                        }
                    );


                    tab.classList.add(
                        "active"
                    );


                    selectedType =
                        tab.dataset.tab;


                    if (selectedGenre) {

                        const genreMap =
                            selectedType === "movies"
                                ? MOVIE_GENRES
                                : TV_GENRES;


                        if (
                            !genreMap[selectedGenre]
                        ) {

                            showGenreUnavailable(
                                container,
                                selectedGenre,
                                selectedType === "movies"
                                    ? "movies"
                                    : "series"
                            );

                            return;
                        }


                        loadGenreContent(
                            selectedGenre,
                            selectedType,
                            container
                        );

                    }

                }
            );

        }
    );

}


// ============================================================
// LOAD GENRE CONTENT
// ============================================================

async function loadGenreContent(
    genreName,
    type,
    container
) {

    if (!container) {
        return;
    }


    showLoading(container);


    let genreId;

    let endpoint;

    let mediaType;


    if (type === "movies") {

        genreId =
            MOVIE_GENRES[genreName];

        mediaType =
            "movie";


        endpoint =
            `/discover/movie` +
            `?with_genres=${genreId}` +
            `&sort_by=popularity.desc` +
            `&include_adult=false` +
            `&include_video=false` +
            `&language=en-US` +
            `&page=1`;

    } else {

        genreId =
            TV_GENRES[genreName];

        mediaType =
            "tv";


        endpoint =
            `/discover/tv` +
            `?with_genres=${genreId}` +
            `&sort_by=popularity.desc` +
            `&include_adult=false` +
            `&language=en-US` +
            `&page=1`;

    }


    if (!genreId) {

        showGenreUnavailable(
            container,
            genreName,
            type === "movies"
                ? "movies"
                : "series"
        );

        return;
    }


    console.log(
        "Genre:",
        genreName
    );


    console.log(
        "Genre ID:",
        genreId
    );


    console.log(
        "Type:",
        type
    );


    console.log(
        "Endpoint:",
        endpoint
    );


    try {

        const data =
            await fetchTMDB(endpoint);


        if (
            !data ||
            !data.results
        ) {

            throw new Error(
                "Invalid genre response"
            );

        }


        if (
            data.results.length === 0
        ) {

            container.innerHTML = `
                <p class="empty-message">
                    No ${type} found for ${genreName}.
                </p>
            `;

            return;
        }


        displayMovies(
            data.results,
            container,
            mediaType
        );


    } catch (error) {

        console.error(
            "Genre Error:",
            error
        );


        showError(
            container,
            "Unable to load genre content."
        );

    }

}


// ============================================================
// SEARCH MOVIES / SERIES
// ============================================================

async function searchMovies(query) {

    query =
        query.trim();


    if (!query) {
        return;
    }


    console.log(
        "Searching for:",
        query
    );


    const homeSections = [
        ".trending",
        ".top-rated",
        ".popular",
        ".genre",
        ".upcoming"
    ];


    homeSections.forEach(
        function (selector) {

            const section =
                document.querySelector(
                    selector
                );


            if (section) {

                section.style.display =
                    "none";

            }

        }
    );


    let searchSection =
        document.getElementById(
            "search-results-section"
        );


    if (!searchSection) {

        searchSection =
            document.createElement(
                "section"
            );


        searchSection.id =
            "search-results-section";


        searchSection.className =
            "search-results-section";


        searchSection.innerHTML = `

            <div class="section-header">

                <h2>
                    Search Results
                </h2>

                <button
                    id="clear-search"
                    type="button">

                    Clear

                </button>

            </div>

            <div class="movie-container"></div>

        `;


        const header =
            document.querySelector(
                "header"
            );


        if (header) {

            header.insertAdjacentElement(
                "afterend",
                searchSection
            );

        } else {

            document.body.prepend(
                searchSection
            );

        }


        const clearButton =
            searchSection.querySelector(
                "#clear-search"
            );


        if (clearButton) {

            clearButton.addEventListener(
                "click",
                clearSearch
            );

        }

    }


    searchSection.style.display =
        "block";


    const container =
        searchSection.querySelector(
            ".movie-container"
        );


    showLoading(container);


    try {

        const data =
            await fetchTMDB(
                `/search/multi?query=${encodeURIComponent(query)}&language=en-US&include_adult=false`
            );


        const results =
            (data.results || []).filter(
                function (item) {

                    return (
                        item.media_type === "movie" ||
                        item.media_type === "tv"
                    );

                }
            );


        displaySearchResults(
            results,
            container
        );


    } catch (error) {

        console.error(
            "Search Error:",
            error
        );


        showError(
            container,
            "Unable to search."
        );

    }

}


// ============================================================
// DISPLAY SEARCH RESULTS
// ============================================================

function displaySearchResults(
    items,
    container
) {

    container.innerHTML = "";


    if (
        !items ||
        items.length === 0
    ) {

        container.innerHTML = `
            <p class="empty-message">
                No movies or series found.
            </p>
        `;

        return;
    }


    items.slice(
        0,
        20
    ).forEach(
        function (item) {

            const card =
                document.createElement(
                    "div"
                );


            card.classList.add(
                "movie-card"
            );


            const title =
                item.title ||
                item.name ||
                "Unknown";


            const date =
                item.release_date ||
                item.first_air_date ||
                "";


            const year =
                date
                    ? date.substring(0, 4)
                    : "N/A";


            const rating =
                item.vote_average
                    ? Number(
                        item.vote_average
                    ).toFixed(1)
                    : "N/A";


            let imageHTML = "";


            if (item.poster_path) {

                imageHTML = `
                    <img
                        src="${TMDB_IMAGE_URL}${item.poster_path}"
                        alt="${escapeHTML(title)}"
                        loading="lazy"
                    >
                `;

            } else {

                imageHTML = `
                    <div class="no-image">
                        <span>No Image</span>
                    </div>
                `;

            }


            card.innerHTML = `

                ${imageHTML}

                <div class="movie-info">

                    <h3>
                        ${escapeHTML(title)}
                    </h3>

                    <div class="movie-meta">

                        <span>
                            <i class="fa-solid fa-star"></i>
                            ${rating}
                        </span>

                        <span>
                            ${year}
                        </span>

                    </div>

                </div>

            `;


            card.addEventListener(
                "click",
                function () {

                    window.location.href =
                        `movie-details.html?id=${item.id}&type=${item.media_type}`;

                }
            );


            container.appendChild(card);

        }
    );

}


// ============================================================
// CLEAR SEARCH
// ============================================================

function clearSearch() {

    const searchSection =
        document.getElementById(
            "search-results-section"
        );


    if (searchSection) {

        searchSection.remove();

    }


    const input =
        document.getElementById(
            "search-input"
        );


    if (input) {

        input.value = "";

    }


    [
        ".trending",
        ".top-rated",
        ".popular",
        ".genre",
        ".upcoming"
    ].forEach(
        function (selector) {

            const section =
                document.querySelector(
                    selector
                );


            if (section) {

                section.style.display =
                    "";

            }

        }
    );

}


// ============================================================
// SEARCH INITIALIZATION
// ============================================================

function initializeSearch() {

    const searchButton =
        document.getElementById(
            "search-btn"
        );


    const searchInput =
        document.getElementById(
            "search-input"
        );


    if (
        !searchButton ||
        !searchInput
    ) {

        console.log(
            "Search elements not found."
        );

        return;
    }


    searchButton.addEventListener(
        "click",
        function () {

            const query =
                searchInput.value.trim();


            if (!query) {
                return;
            }


            searchMovies(
                query
            );

        }
    );


    searchInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();


                const query =
                    searchInput.value.trim();


                if (!query) {
                    return;
                }


                searchMovies(
                    query
                );

            }

        }
    );

}


// ============================================================
// VOICE SEARCH
// ============================================================

function initializeVoiceSearch() {

    const voiceButton =
        document.getElementById(
            "voice-btn"
        );


    const input =
        document.getElementById(
            "search-input"
        );


    const voiceIcon =
        document.getElementById(
            "voice-icon"
        );


    if (
        !voiceButton ||
        !input
    ) {

        console.log(
            "Voice search elements not found."
        );

        return;
    }


    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

        console.log(
            "Speech Recognition is not supported by this browser."
        );


        voiceButton.style.display =
            "none";


        return;
    }


    const recognition =
        new SpeechRecognition();


    recognition.lang =
        "en-IN";


    recognition.continuous =
        false;


    recognition.interimResults =
        false;


    voiceButton.addEventListener(
        "click",
        function () {

            try {

                recognition.start();


                if (voiceIcon) {

                    voiceIcon.className =
                        "fa-solid fa-microphone-lines";

                }


                console.log(
                    "Listening..."
                );


            } catch (error) {

                console.log(
                    "Voice recognition is already running."
                );

            }

        }
    );


    recognition.onresult =
        function (event) {

            const transcript =
                event.results[0][0]
                    .transcript
                    .trim();


            console.log(
                "Voice Search:",
                transcript
            );


            input.value =
                transcript;


            if (transcript) {

                searchMovies(
                    transcript
                );

            }

        };


    recognition.onend =
        function () {

            if (voiceIcon) {

                voiceIcon.className =
                    "fa-solid fa-microphone";

            }

        };


    recognition.onerror =
        function (event) {

            console.error(
                "Voice Search Error:",
                event.error
            );


            if (voiceIcon) {

                voiceIcon.className =
                    "fa-solid fa-microphone";

            }

        };

}


// ============================================================
// DETAILS PAGE
// ============================================================

async function initializeDetailsPage() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const movieId =
        params.get("id");


    const mediaType =
        params.get("type") ||
        "movie";


    console.log(
        "Details ID:",
        movieId
    );


    console.log(
        "Media Type:",
        mediaType
    );


    if (!movieId) {

        showDetailsError(
            "Movie/series ID is missing."
        );

        return;
    }


    loadMovieDetails(
        movieId,
        mediaType
    );


    loadCast(
        movieId,
        mediaType
    );


    loadSimilarMovies(
        movieId,
        mediaType
    );


    loadWatchmodeInfo(
        movieId,
        mediaType
    );

}


// ============================================================
// LOAD MOVIE / TV DETAILS
// ============================================================

async function loadMovieDetails(
    movieId,
    mediaType
) {

    try {

        const endpoint =
            mediaType === "tv"
                ? `/tv/${movieId}`
                : `/movie/${movieId}`;


        const data =
            await fetchTMDB(
                endpoint
            );


        console.log(
            "TMDB Details:",
            data
        );


        // POSTER

        const poster =
            document.getElementById(
                "movie-poster"
            );


        if (poster) {

            if (data.poster_path) {

                poster.src =
                    `${TMDB_IMAGE_URL}${data.poster_path}`;


                poster.style.display =
                    "block";

            } else {

                poster.style.display =
                    "none";

            }

        }


        // TITLE

        const titleElement =
            document.getElementById(
                "movie-title"
            );


        if (titleElement) {

            titleElement.textContent =
                data.title ||
                data.name ||
                "Unknown Title";

        }


        // BACKDROP

        const backdrop =
            document.getElementById(
                "movie-backdrop"
            );


        if (backdrop) {

            if (data.backdrop_path) {

                backdrop.src =
                    `${TMDB_BACKDROP_URL}${data.backdrop_path}`;


                backdrop.style.display =
                    "block";

            } else {

                backdrop.style.display =
                    "none";

            }

        }


        // RATING

        const ratingElement =
            document.getElementById(
                "movie-rating"
            );


        if (ratingElement) {

            ratingElement.innerHTML =
                `<i class="fa-solid fa-star"></i> ` +
                `${
                    data.vote_average
                        ? Number(
                            data.vote_average
                        ).toFixed(1)
                        : "N/A"
                }`;

        }


        // RELEASE DATE

        const releaseElement =
            document.getElementById(
                "movie-release-date"
            );


        if (releaseElement) {

            const date =
                data.release_date ||
                data.first_air_date ||
                "N/A";


            releaseElement.innerHTML =
                `<i class="fa-regular fa-calendar"></i> ${date}`;

        }


        // RUNTIME

        const runtimeElement =
            document.getElementById(
                "movie-runtime"
            );


        if (runtimeElement) {

            let runtime =
                data.runtime;


            if (
                !runtime &&
                data.episode_run_time &&
                data.episode_run_time.length
            ) {

                runtime =
                    data.episode_run_time[0];

            }


            runtimeElement.innerHTML =
                `<i class="fa-regular fa-clock"></i> ` +
                `${
                    runtime
                        ? runtime + " min"
                        : "N/A"
                }`;

        }


        // LANGUAGE

        const languageElement =
            document.getElementById(
                "movie-language"
            );


        if (languageElement) {

            languageElement.innerHTML =
                `<i class="fa-solid fa-language"></i> ` +
                `${
                    data.original_language
                        ? data.original_language.toUpperCase()
                        : "N/A"
                }`;

        }


        // GENRES

        const genresElement =
            document.getElementById(
                "movie-genres"
            );


        if (genresElement) {

            genresElement.innerHTML =
                "";


            if (
                data.genres &&
                data.genres.length
            ) {

                data.genres.forEach(
                    function (genre) {

                        const span =
                            document.createElement(
                                "span"
                            );


                        span.textContent =
                            genre.name;


                        genresElement.appendChild(
                            span
                        );

                    }
                );

            }

        }


        // OVERVIEW

        const overviewElement =
            document.getElementById(
                "movie-overview-text"
            );


        if (overviewElement) {

            overviewElement.textContent =
                data.overview ||
                "No overview available.";

        }


        // TRAILER

        loadTrailer(
            movieId,
            mediaType
        );


    } catch (error) {

        console.error(
            "Movie Details Error:",
            error
        );


        showDetailsError(
            "Unable to load movie details."
        );

    }

}


// ============================================================
// TRAILER
// ============================================================

async function loadTrailer(
    movieId,
    mediaType
) {

    const iframe =
        document.getElementById(
            "movie-trailer"
        );


    if (!iframe) {
        return;
    }


    try {

        const endpoint =
            mediaType === "tv"
                ? `/tv/${movieId}/videos`
                : `/movie/${movieId}/videos`;


        const data =
            await fetchTMDB(
                endpoint
            );


        const videos =
            data.results || [];


        let selectedVideo =
            videos.find(
                function (video) {

                    return (
                        video.site === "YouTube" &&
                        video.type === "Trailer" &&
                        video.official === true
                    );

                }
            );


        if (!selectedVideo) {

            selectedVideo =
                videos.find(
                    function (video) {

                        return (
                            video.site === "YouTube" &&
                            video.type === "Trailer"
                        );

                    }
                );

        }


        if (!selectedVideo) {

            selectedVideo =
                videos.find(
                    function (video) {

                        return (
                            video.site === "YouTube" &&
                            video.type === "Teaser" &&
                            video.official === true
                        );

                    }
                );

        }


        if (!selectedVideo) {

            selectedVideo =
                videos.find(
                    function (video) {

                        return (
                            video.site === "YouTube" &&
                            video.type === "Teaser"
                        );

                    }
                );

        }


        if (!selectedVideo) {

            selectedVideo =
                videos.find(
                    function (video) {

                        return (
                            video.site === "YouTube" &&
                            video.key
                        );

                    }
                );

        }


        if (
            selectedVideo &&
            selectedVideo.key
        ) {

            iframe.src =
                `https://www.youtube.com/embed/${selectedVideo.key}`;


            iframe.style.display =
                "block";


            console.log(
                "Trailer loaded:",
                selectedVideo.name
            );


        } else {

            iframe.removeAttribute(
                "src"
            );


            iframe.style.display =
                "none";

        }


    } catch (error) {

        console.error(
            "Trailer Error:",
            error
        );


        iframe.removeAttribute(
            "src"
        );


        iframe.style.display =
            "none";

    }

}


// ============================================================
// CAST
// ============================================================

async function loadCast(
    movieId,
    mediaType
) {

    const container =
        document.getElementById(
            "cast-container"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        "<p>Loading cast...</p>";


    try {

        const endpoint =
            mediaType === "tv"
                ? `/tv/${movieId}/credits`
                : `/movie/${movieId}/credits`;


        const data =
            await fetchTMDB(
                endpoint
            );


        const cast =
            data.cast || [];


        container.innerHTML =
            "";


        if (!cast.length) {

            container.innerHTML =
                "<p>Cast information not available.</p>";

            return;
        }


        cast.slice(
            0,
            10
        ).forEach(
            function (person) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.classList.add(
                    "cast-card"
                );


                let imageHTML = "";


                if (person.profile_path) {

                    imageHTML = `
                        <img
                            src="${TMDB_IMAGE_URL}${person.profile_path}"
                            alt="${escapeHTML(person.name)}"
                            loading="lazy"
                        >
                    `;

                } else {

                    imageHTML = `
                        <div class="no-image">
                            <span>No Image</span>
                        </div>
                    `;

                }


                card.innerHTML = `

                    ${imageHTML}

                    <h3>
                        ${escapeHTML(person.name)}
                    </h3>

                    <p>
                        ${escapeHTML(
                            person.character ||
                            "Unknown"
                        )}
                    </p>

                `;


                container.appendChild(
                    card
                );

            }
        );


    } catch (error) {

        console.error(
            "Cast Error:",
            error
        );


        container.innerHTML =
            "<p>Unable to load cast.</p>";

    }

}


// ============================================================
// SIMILAR MOVIES / SERIES
// ============================================================

async function loadSimilarMovies(
    movieId,
    mediaType
) {

    const container =
        document.getElementById(
            "similar-container"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        "<p>Loading similar titles...</p>";


    try {

        const endpoint =
            mediaType === "tv"
                ? `/tv/${movieId}/similar`
                : `/movie/${movieId}/similar`;


        const data =
            await fetchTMDB(
                endpoint
            );


        const results =
            data.results || [];


        if (!results.length) {

            container.innerHTML =
                "<p>No similar titles found.</p>";

            return;
        }


        displayMovies(
            results,
            container,
            mediaType
        );


    } catch (error) {

        console.error(
            "Similar Movies Error:",
            error
        );


        container.innerHTML =
            "<p>Unable to load similar titles.</p>";

    }

}

const WATCHMODE_API_KEY = "Phco2A1LTGe8S5zruu0lmjKMqMT5lCLhK9nH8hEc";
// ============================================================
// WATCHMODE - STREAMING PLATFORMS
// ============================================================

async function loadWatchmodeInfo(
    tmdbId,
    mediaType
) {

    const container =
        document.getElementById(
            "watch-providers"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `

        <p class="watch-loading">
            Checking streaming platforms...
        </p>

    `;


    try {

        const watchmodeId =
            mediaType === "tv"
                ? `tv-${tmdbId}`
                : `movie-${tmdbId}`;


        const url =
            `${WATCHMODE_BASE_URL}/title/` +
            `${watchmodeId}/sources/` +
            `?apiKey=${encodeURIComponent(WATCHMODE_API_KEY)}` +
            `&regions=IN`;


        const response =
            await fetch(url);


        if (!response.ok) {

            const errorText =
                await response.text();


            console.error(
                "Watchmode Error:",
                response.status,
                errorText
            );


            throw new Error(
                `Watchmode HTTP ${response.status}`
            );
        }


        const sources =
            await response.json();


        if (
            !Array.isArray(sources) ||
            sources.length === 0
        ) {

            container.innerHTML = `

                <div class="no-streaming">

                    <i class="fa-solid fa-tv"></i>

                    <p>
                        No streaming platforms found
                        in India for this title.
                    </p>

                </div>

            `;

            return;
        }


        displayWatchProviders(
            sources
        );

    } catch (error) {

        console.error(
            "Watchmode Error:",
            error
        );


        container.innerHTML = `

            <div class="no-streaming">

                <i class="fa-solid fa-circle-exclamation"></i>

                <p>
                    Streaming information is
                    temporarily unavailable.
                </p>

            </div>

        `;
    }
}


// ============================================================
// DISPLAY STREAMING PROVIDERS
// ============================================================

function displayWatchProviders(
    sources
) {

    const container =
        document.getElementById(
            "watch-providers"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        "";


    const providers = [];


    sources.forEach(
        function (source) {

            const name =
                source.name ||
                "Streaming Service";


            const exists =
                providers.some(
                    function (provider) {

                        return (
                            provider.name ===
                            name
                        );

                    }
                );


            if (!exists) {

                providers.push({

                    name: name,

                    type:
                        source.type ||
                        "Streaming",

                    link:
                        source.web_url ||
                        source.link ||
                        null,

                    logo:
                        source.logo_100px ||
                        source.logo ||
                        null

                });
            }

        }
    );


    if (!providers.length) {

        container.innerHTML =
            `<p>No streaming providers found.</p>`;

        return;
    }


    providers.forEach(
        function (provider) {

            const card =
                document.createElement(
                    "div"
                );


            card.classList.add(
                "provider"
            );


            let logoHTML = "";


            if (provider.logo) {

                logoHTML = `

                    <img
                        src="${provider.logo}"
                        alt="${escapeHTML(provider.name)}"
                        class="provider-logo"
                        loading="lazy"
                    >

                `;
            }


            let watchHTML = "";


            if (provider.link) {

                watchHTML = `

                    <a
                        href="${provider.link}"
                        target="_blank"
                        rel="noopener noreferrer">

                        Watch

                    </a>

                `;
            }


            card.innerHTML = `

                ${logoHTML}

                <div class="provider-name">

                    ${escapeHTML(
                        provider.name
                    )}

                </div>

                <div class="provider-type">

                    ${getProviderType(
                        provider.type
                    )}

                </div>

                ${watchHTML}

            `;


            container.appendChild(
                card
            );

        }
    );
}


// ============================================================
// WATCHMODE PROVIDER TYPE
// ============================================================

function getProviderType(type) {

    switch (type) {

        case "sub":
            return "Subscription";

        case "rent":
            return "Rent";

        case "purchase":
            return "Buy";

        case "free":
            return "Free";

        case "tve":
            return "TV";

        default:
            return "Streaming";
    }
}


// ============================================================
// BACK BUTTON
// ============================================================

function initializeBackButton() {

    const backButton =
        document.getElementById(
            "back-btn"
        );


    if (!backButton) {
        return;
    }


    backButton.addEventListener(
        "click",
        function () {

            window.history.back();

        }
    );

}


// ============================================================
// ERROR FUNCTIONS
// ============================================================

function showLoading(
    container
) {

    if (!container) {
        return;
    }


    container.innerHTML = `

        <p class="loading">
            Loading...
        </p>

    `;

}


function showError(
    container,
    message
) {

    if (!container) {
        return;
    }


    container.innerHTML = `

        <p class="error-message">
            ${escapeHTML(message)}
        </p>

    `;

}


function showDetailsError(
    message
) {

    const title =
        document.getElementById(
            "movie-title"
        );


    if (title) {

        title.textContent =
            message;

    }


    const overview =
        document.getElementById(
            "movie-overview-text"
        );


    if (overview) {

        overview.textContent =
            "Please check your TMDB API configuration and movie URL.";

    }

}


// ============================================================
// GENRE UNAVAILABLE
// ============================================================

function showGenreUnavailable(
    container,
    genreName,
    type
) {

    if (!container) {
        return;
    }


    container.innerHTML = `

        <p class="empty-message">

            ${escapeHTML(genreName)}
            is not available for
            ${escapeHTML(type)}
            in the current TMDB genre mapping.

        </p>

    `;

}


// ============================================================
// HTML ESCAPE
// ============================================================

function escapeHTML(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}
