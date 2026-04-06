/**
 * 1. CONFIGURATION & GLOBAL STATE
 */
const API_KEY = 'f23c2f3f';
const AUTHORIZED_USERS = [
    { "name": "Sai", "email": "charan@gmail.com", "password": "1234" },
    { "name": "Ravi", "email": "ravi@gmail.com", "password": "5678" },
    { "name": "Vijay", "email": "vijay@gmail.com", "password": "4321" }
];

let currentMovies = []; // Stores all cumulative movie details
let currentPage = 1;
let currentQuery = "";
let searchTimer;

// DOM Selectors
const loginPage = document.getElementById('loginPage');
const theaterPage = document.getElementById('theaterPage');
const movieGrid = document.getElementById('movieGrid');
const loginBtn = document.getElementById('loginBtn');
const movieSearch = document.getElementById('movieSearch');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const modal = document.getElementById('movieModal');
const detailsContainer = document.getElementById('modalDetails');

/**
 * 2. LOGIN & SECURITY
 */
loginBtn.addEventListener('click', () => {
    const email = document.getElementById('email').value.trim();
    const pass = document.getElementById('password').value.trim();
    const user = AUTHORIZED_USERS.find(u => u.email === email && u.password === pass);

    if (user) {
        loginPage.classList.add('ticket-out');
        setTimeout(() => {
            loginPage.classList.add('hidden');
            theaterPage.classList.remove('hidden');
            theaterPage.classList.add('active');
            // Initial landing content
            startNewSearch('Gold');
        }, 800);
    } else {
        triggerErrorEffect();
    }
});

function triggerErrorEffect() {
    loginPage.style.animation = 'none';
    void loginPage.offsetWidth; // Force CSS reflow
    loginPage.style.animation = 'shake 0.4s cubic-bezier(.36,.07,.19,.97) both';
}

/**
 * 3. THE ARCHIVE ENGINE (Search & Load More)
 */
async function startNewSearch(query) {
    currentPage = 1;
    currentQuery = query;
    currentMovies = []; // Wipe previous results for fresh search
    movieGrid.innerHTML = '<p style="text-align:center; grid-column:1/-1;">Scanning Archives...</p>';
    await appendMovies();
}

async function appendMovies() {
    try {
        loadMoreBtn.innerText = "Accessing Records...";

        const response = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(currentQuery)}&page=${currentPage}&apikey=${API_KEY}`);
        const data = await response.json();

        if (data.Response === "True") {
            // Parallel Fetch: Get deep metadata (Ratings/Genre) for the 10 movies in this page
            const newBatch = await Promise.all(
                data.Search.map(async (m) => {
                    const detail = await fetch(`https://www.omdbapi.com/?i=${m.imdbID}&apikey=${API_KEY}`);
                    return await detail.json();
                })
            );

            // Add new data to our master collection
            currentMovies = [...currentMovies, ...newBatch];

            // Re-apply current filters to the whole collection
            applyFilters();

            // Toggle "Load More" visibility
            if (parseInt(data.totalResults) > currentMovies.length) {
                loadMoreBtn.classList.remove('hidden');
                loadMoreBtn.innerText = "View More Records";
            } else {
                loadMoreBtn.classList.add('hidden');
            }
        } else {
            if (currentPage === 1) movieGrid.innerHTML = `<p class="no-results">No records found for "${currentQuery}"</p>`;
            loadMoreBtn.classList.add('hidden');
        }
    } catch (err) {
        console.error("Archive Fetch Error:", err);
    }
}

/**
 * 4. FILTER & RENDER SYSTEM
 */
function applyFilters() {
    const genre = document.getElementById('genreFilter').value;
    const yearPrefix = document.getElementById('yearFilter').value;
    const minRating = parseFloat(document.getElementById('ratingFilter').value);

    const filtered = currentMovies.filter(m => {
        const movieYear = m.Year ? m.Year.substring(0, 4) : "";
        const movieRating = m.imdbRating !== "N/A" ? parseFloat(m.imdbRating) : 0;

        const matchGenre = genre === "" || (m.Genre && m.Genre.includes(genre));
        const matchYear = yearPrefix === "" || movieYear.startsWith(yearPrefix);
        const matchRating = movieRating >= minRating;

        return matchGenre && matchYear && matchRating;
    });

    renderGrid(filtered);
}

function renderGrid(movies) {
    if (movies.length === 0 && currentMovies.length > 0) {
        movieGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #888;">No items match current filters.</p>';
        return;
    }

    movieGrid.innerHTML = movies.map(m => `
        <div class="movie-card" onclick="openDetails('${m.imdbID}')">
            <img src="${m.Poster !== 'N/A' ? m.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'}">
            <div class="movie-info">
                <h3>${m.Title}</h3>
                <p>${m.Year} • <span class="gold-text">⭐ ${m.imdbRating}</span></p>
            </div>
        </div>
    `).join('');
}

/**
 * 5. CINEMATIC MODAL (Details)
 */
async function openDetails(id) {
    modal.classList.remove('hidden');
    detailsContainer.innerHTML = '<p style="text-align:center">Retrieving Film Specs...</p>';

    const res = await fetch(`https://www.omdbapi.com/?i=${id}&plot=full&apikey=${API_KEY}`);
    const m = await res.json();

    detailsContainer.innerHTML = `
        <div class="modal-flex">
            <img src="${m.Poster}" class="modal-poster">
            <div class="modal-text">
                <h1>${m.Title} <span class="gold-text">(${m.Year})</span></h1>
                <p class="rating">⭐ <span class="gold-text">${m.imdbRating}</span> / 10 (IMDb)</p>
                <p class="plot">${m.Plot}</p>
                <div class="specs">
                    <p><strong>Director:</strong> ${m.Director}</p>
                    <p><strong>Cast:</strong> ${m.Actors}</p>
                    <p><strong>Genre:</strong> ${m.Genre}</p>
                    <p><strong>Streaming:</strong> 
                        <a href="https://www.google.com/search?q=watch+${encodeURIComponent(m.Title)}+online" 
                           target="_blank" class="stream-link">
                           Check Availability ↗
                        </a>
                    </p>
                </div>
            </div>
        </div>`;
}

/**
 * 6. GLOBAL EVENT LISTENERS
 */
movieSearch.addEventListener('input', (e) => {
    clearTimeout(searchTimer);
    const query = e.target.value.trim();
    if (query.length > 2) {
        searchTimer = setTimeout(() => startNewSearch(query), 500);
    }
});

loadMoreBtn.addEventListener('click', () => {
    currentPage++;
    appendMovies();
});

document.querySelectorAll('select').forEach(s => s.addEventListener('change', applyFilters));

document.querySelector('.close-modal').onclick = () => {
    modal.classList.add('hidden');
};

// Close modal on outside click
window.onclick = (event) => {
    if (event.target == modal) modal.classList.add('hidden');
};

/**
 * 7. HOME NAVIGATION LOGIC
 * Resets the app state and returns to the Login "Entrance"
 */
const homeLink = document.getElementById('homeLink');

homeLink.addEventListener('click', () => {
    // 1. Smoothly hide the Theater Page
    theaterPage.classList.remove('active');
    theaterPage.classList.add('hidden');

    // 2. Reset the Login Page state
    loginPage.classList.remove('hidden', 'ticket-out');

    // 3. Clear all search data and inputs
    currentMovies = [];
    currentPage = 1;
    currentQuery = "";
    movieGrid.innerHTML = "";
    movieSearch.value = "";

    // Reset Filters to default
    document.getElementById('genreFilter').value = "";
    document.getElementById('yearFilter').value = "";
    document.getElementById('ratingFilter').value = "0";

    // 4. Hide the "Load More" button
    loadMoreBtn.classList.add('hidden');

    console.log("Returned to Entrance. Archives cleared.");
});