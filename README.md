# 🎬 MoviQ

**MoviQ** is a modern and interactive **movie and series discovery website** designed to make finding and exploring entertainment simple, engaging, and visually appealing.

Users can search for movies and series using **text or voice**, explore **Trending, Top Rated, and Popular** sections, browse content by **genre**, view detailed information, watch trailers, and check available streaming platforms.

The website also features a **cinematic animated MoviQ opening experience** using the MoviQ logo.

---

## ✨ Features

### 🎬 Cinematic Opening

MoviQ begins with a stylish animated opening featuring the **Q logo** and **MoviQ logo**, creating a dynamic introduction before entering the main website.

### 🔍 Search Movies & Series

Search for movies and series using:

* ⌨️ **Text Search**
* 🎤 **Voice Search**

The search results are dynamically retrieved using the movie database API.

### 🔥 Trending

Discover movies and series that are currently **trending** and popular among viewers.

### ⭐ Top Rated

Explore movies and series with **high user ratings** and discover some of the best-rated content.

### 🔥 Popular

Browse a collection of **popular movies and series** based on popularity.

### 🎭 Browse by Genre

The **Browse with Genre** section allows users to discover movies and series based on their preferred genres.

Users can select different genres and explore the corresponding content.

Examples include:

* Action
* Adventure
* Animation
* Comedy
* Crime
* Drama
* Fantasy
* Horror
* Romance
* Science Fiction
* Thriller
* Documentary

### 🎞️ Movie & Series Details

Clicking on a movie or series opens the **Movie Details** page.

The details page provides information such as:

* 🎬 Title
* 🖼️ Poster
* ⭐ Rating
* 📅 Release date
* 🎭 Genre
* 📝 Overview
* ⏱️ Runtime
* Other available movie/series information

### ▶️ Watch Trailer

Users can watch the available **movie or series trailer** directly from the details page.

### 📺 Streaming Platforms

MoviQ also shows **streaming platform availability**, helping users find where a particular movie or series can be watched.

---

## 🖥️ Website Sections

The main MoviQ homepage contains the following sections:

```text
                    🎬 MoviQ
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
      🔥 Trending   ⭐ Top Rated   🔥 Popular
          │            │            │
          └────────────┼────────────┘
                       │
                       ▼
                🎭 Browse by Genre
                       │
                       ▼
              Movies / TV Series
                       │
                       ▼
                Movie Details
                       │
                ┌──────┴──────┐
                ▼             ▼
             ▶️ Trailer   📺 Streaming
                         Platforms
```

---

## 🛠️ Tech Stack

| Technology         | Purpose                                   |
| ------------------ | ----------------------------------------- |
| **HTML5**          | Website structure                         |
| **CSS3**           | Styling, animations and responsive design |
| **JavaScript**     | Dynamic functionality and API integration |
| **TMDB API**       | Movie and TV-series data                  |
| **Watchmode API**  | Streaming platform availability           |
| **Web Speech API** | Voice search                              |

---

## 🔌 APIs

### 🎬 TMDB API

MoviQ uses the **TMDB API** to retrieve movie and TV-series information, including:

* Titles
* Posters
* Backdrops
* Ratings
* Release dates
* Genres
* Overviews
* Popularity
* Details

### 📺 Watchmode API

The **Watchmode API** is used to retrieve information about the streaming availability of movies and series.

> ⚠️ API keys should not be publicly exposed in a GitHub repository. For production, use environment variables or a backend proxy to protect API credentials.

---

## 🎤 Voice Search

MoviQ provides a voice-search feature using the browser's **Web Speech API**.

The process works like this:

```text
🎤 Speak Movie / Series Name
            ↓
     Speech Recognition
            ↓
      Recognized Text
            ↓
        API Search
            ↓
      Search Results
```

This allows users to search without manually typing the title.

---

## 🔎 Text Search

Users can also search normally by entering a movie or series name into the search bar.

```text
⌨️ Enter Title
      ↓
  Search Request
      ↓
    TMDB API
      ↓
Matching Movies / Series
      ↓
   🎬 Results
```

---

## 🎭 Genre Browsing

The **Browse with Genre** feature allows users to explore content according to their interests.

```text
              🎭 Genres
                  │
       ┌──────────┼──────────┐
       ▼          ▼          ▼
     Action     Comedy      Horror
       │          │          │
       └──────────┼──────────┘
                  ▼
          Filtered Content
                  │
          🎬 Movies / Series
```

---

## 🎬 Movie Details

When a user selects a movie or series, MoviQ navigates to the dedicated:

```text
movie-details.html
```

page.

The page provides detailed information about the selected title along with trailer and streaming availability.

---

## 📁 Project Structure

```text
MoviQ/
│
├── index.html
├── movie-details.html
├── style.css
├── index.js
│
└── images/
    ├── moviQlogo.png
    └── Qlogo.png
```

### 📄 `index.html`

Contains the main MoviQ homepage, including:

* MoviQ opening experience
* Search
* Voice search
* Trending section
* Top Rated section
* Popular section
* Browse with Genre section

### 📄 `movie-details.html`

Displays detailed information about the selected movie or series, including:

* Movie/series information
* Trailer
* Streaming platform availability

### 🎨 `style.css`

Contains the complete styling of the website, including:

* Layout
* Movie cards
* Search interface
* Animations
* Opening screen
* Responsive design
* Buttons and UI elements

### ⚙️ `index.js`

Handles the website's main functionality, including:

* API requests
* Movie/series search
* Voice search
* Trending content
* Top-rated content
* Popular content
* Genre browsing
* Movie/series selection
* Details page navigation

### 🖼️ `images/`

Contains the MoviQ branding assets:

```text
images/
├── moviQlogo.png
└── Qlogo.png
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/MoviQ.git
```

### 2. Open the Project

```bash
cd MoviQ
```

### 3. Configure API Keys

Add your API keys to the JavaScript configuration.

```javascript
const TMDB_API_KEY = "YOUR_TMDB_API_KEY";
const WATCHMODE_API_KEY = "YOUR_WATCHMODE_API_KEY";
```

**Do not commit your real API keys to GitHub.**

### 4. Run the Website

The easiest way to run MoviQ is using **VS Code Live Server**.

```text
Right Click index.html
        ↓
Open with Live Server
```

---

## 🎯 User Flow

The overall user experience of MoviQ:

```text
                🎬 MoviQ Opening
                       ↓
                  🏠 Homepage
                       ↓
       ┌───────────────┼───────────────┐
       ↓               ↓               ↓
   🔍 Search       🔥 Trending      ⭐ Top Rated
       │               │               │
       │               └───────┬───────┘
       │                       ↓
       │                  🔥 Popular
       │                       │
       └───────────────┬───────┘
                       ↓
               🎭 Browse by Genre
                       ↓
               🎬 Select Content
                       ↓
             📄 Movie Details Page
                       ↓
              ┌────────┴─────────┐
              ↓                  ↓
         ▶️ Watch Trailer   📺 Streaming
                              Platforms
```

---

## 🌟 Key Highlights

* 🎬 Cinematic MoviQ opening animation
* 🔍 Text-based movie and series search
* 🎤 Voice search functionality
* 🔥 Trending content
* ⭐ Top-rated content
* 🔥 Popular content
* 🎭 Genre-based browsing
* 🎞️ Movie and series details
* ▶️ Trailer viewing
* 📺 Streaming platform availability
* 📱 Responsive and interactive UI

---

## 📚 What I Learned

Building MoviQ helped develop practical knowledge of:

* HTML5
* CSS3
* JavaScript
* REST API integration
* Fetch API
* JSON data handling
* DOM manipulation
* Web Speech API
* Dynamic content rendering
* Genre filtering
* Responsive web design
* CSS animations
* UI/UX design

---

## 🎬 Project Goal

The goal of **MoviQ** is to create a simple yet engaging platform where users can:

> **Search → Discover → Explore → Watch**

Whether users want to find something trending, explore highly-rated movies, browse by genre, watch a trailer, or find a streaming platform, MoviQ brings these discovery features together in one place.

---

## ⭐ Support

If you like **MoviQ**, consider giving this repository a ⭐ on GitHub!

---

## 📌 Disclaimer

MoviQ uses third-party APIs to retrieve movie, TV-series, trailer, and streaming-related information. Availability and content may change based on the respective API providers.
