// --- Helper to select all instances of an ID (matches both Desktop & Mobile) ---
function getAll(id) {
    return document.querySelectorAll(`[id="${id}"]`);
}

let randomItems = null;
let numRandomItems = 200;

// Fetch top items
async function fetchRandomItems() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) loadingOverlay.style.display = 'flex';

    try {
        async function fetchUntil100(baseUrl, mediaType) {
            let collectedItems = [];
            let page = 1;
            
            while (collectedItems.length < numRandomItems && page <= 500) {
                const response = await fetch(`${baseUrl}&page=${page}`);
                const data = await response.json();
                
                if (!data.results || data.results.length === 0) break;
                
                let pageItems = data.results;
                pageItems = pageItems.filter(item => item.original_language === 'en');
                
                for (const item of pageItems) {
                    if (collectedItems.length < numRandomItems) {
                        collectedItems.push({
                            id: item.id,
                            media_type: mediaType
                        });
                    }
                }
                page++;
            }
            return collectedItems;
        }

        const movies = await fetchUntil100(
            `https://api.themoviedb.org/3/discover/movie?sort_by=vote_count.desc&api_key=${TMDB_API_KEY}`, 
            'movie'
        );

        let people = [];
        const seenActorIds = new Set();
        const TOP_ACTORS_PER_MOVIE = 5;
        
        for (const movie of movies) {
            if (people.length >= numRandomItems) break;
            
            try {
                const response = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${TMDB_API_KEY}`);
                const creditsData = await response.json();
                
                if (creditsData.cast) {
                    const sortedCast = creditsData.cast.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
                    
                    let addedFromMovie = 0;
                    for (const actor of sortedCast) {
                        if (addedFromMovie >= TOP_ACTORS_PER_MOVIE) break;
                        if (people.length >= numRandomItems) break;
                        
                        if (!seenActorIds.has(actor.id) && (actor.popularity || 0) >= 1) {
                            seenActorIds.add(actor.id);
                            people.push({
                                id: actor.id,
                                media_type: 'person'
                            });
                            addedFromMovie++;
                        }
                    }
                }
            } catch (error) {
                console.error(`Failed to fetch credits for movie ID ${movie.id}:`, error);
            }
        }

        const tv = await fetchUntil100(
            `https://api.themoviedb.org/3/discover/tv?sort_by=vote_count.desc&api_key=${TMDB_API_KEY}`, 
            'tv'
        );

        const itemDict = {
            movies: movies,
            people: people,
            tv: tv
        };

        return itemDict;

    } finally {
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }
}

if (!randomItems) {
    randomItems = await fetchRandomItems();
}


// --- 1. SEARCH INPUT LISTENERS (Attached to both Desktop & Mobile) ---
getAll('standard-search-start').forEach(input => {
    input.addEventListener('input', (e) => {
        delete inputData[e.target.id];
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => executeSearch(e.target), 500);
    });

    input.addEventListener('focus', (e) => {
        if (e.target.value.trim()) {
            window.executeSearch(e.target);
        }
    });
});

getAll('standard-search-goal').forEach(input => {
    input.addEventListener('input', (e) => {
        delete inputData[e.target.id];
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => executeSearch(e.target), 500);
    });

    input.addEventListener('focus', (e) => {
        if (e.target.value.trim()) {
            window.executeSearch(e.target);
        }
    });
});


// --- 2. START RUN VALIDATION & TRIGGER ---
getAll('standard-start-run-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
        window.currentMode = 'STANDARD';

        // Find the active view (desktop or mobile) this button was clicked inside
        const currentView = e.target.closest('.app-view');
        const startInput = currentView.querySelector('#standard-search-start');
        const goalInput = currentView.querySelector('#standard-search-goal');

        async function validateInput(inputElement) {
            const text = inputElement.value.trim();
            
            if (!text) {
                window.showInputError(inputElement, 'Please enter an item!');
                return null;
            }

            let data = inputData[inputElement.id];
            if (!data) {
                data = await window.resolveInputData(inputElement);
                if (!data) {
                    window.showInputError(inputElement, 'No results found!');
                    return null;
                }
            }

            const mediaFilter = localStorage.getItem('mediaFilter') || 'none';
            if (mediaFilter === 'no-tv' && data.media_type === 'tv') {
                window.showInputError(inputElement, 'TV shows are disabled in settings!');
                return null;
            }
            if (mediaFilter === 'no-movies' && data.media_type === 'movie') {
                window.showInputError(inputElement, 'Movies are disabled in settings!');
                return null;
            }

            let bannedItems = JSON.parse(localStorage.getItem('bannedItems') || '[]');

            if (localStorage.getItem('no-mcu') === 'true' && typeof BANNED_MCU !== 'undefined') {
                bannedItems = bannedItems.concat(BANNED_MCU);
            }

            if (localStorage.getItem('no-big-3') === 'true' && typeof BANNED_BIG_3 !== 'undefined') {
                bannedItems = bannedItems.concat(BANNED_BIG_3);
            }

            const isBanned = bannedItems.some(b => b.id === data.id && b.media_type === data.media_type);
            if (isBanned) {
                window.showInputError(inputElement, 'This item is banned! (Check your settings)');
                return null;
            }

            return data;
        }

        const [startResult, goalResult] = await Promise.all([
            validateInput(startInput),
            validateInput(goalInput)
        ]);

        currentStartData = startResult;
        currentGoalData = goalResult;

        if (!currentStartData || !currentGoalData) {
            return;
        }

        window.switchView('view-standard', { start: currentStartData, goal: currentGoalData });
    });
});


// Helper to pick a random item
async function randomizeInput(inputElement, otherInputElement) {
    while (true) {
        const category = Object.keys(randomItems)[Math.floor(Math.random() * Object.keys(randomItems).length)];
        const item = randomItems[category][Math.floor(Math.random() * randomItems[category].length)];
        
        const mediaFilter = localStorage.getItem('mediaFilter') || 'none';
        const noTv = mediaFilter === 'no-tv' || localStorage.getItem('no-tv') === 'true';
        const noMovies = mediaFilter === 'no-movies' || localStorage.getItem('no-movies') === 'true';

        if (noTv && item.media_type === 'tv') continue;
        if (noMovies && item.media_type === 'movie') continue;

        if (localStorage.getItem('no-mcu') === 'true' && typeof BANNED_MCU !== 'undefined' && BANNED_MCU.some(b => b.id === item.id && b.media_type === item.media_type)) {
            continue;
        }
        if (localStorage.getItem('no-big-3') === 'true' && typeof BANNED_BIG_3 !== 'undefined' && BANNED_BIG_3.some(b => b.id === item.id && b.media_type === item.media_type)) {
            continue;
        }

        const otherData = otherInputElement ? inputData[otherInputElement.id] : null;
        if (otherData && otherData.id === item.id && otherData.media_type === item.media_type) {
            continue;
        }

        const bannedItems = JSON.parse(localStorage.getItem('bannedItems') || '[]');
        if (bannedItems.some(b => b.id === item.id && b.media_type === item.media_type)) {
            continue;
        }

        const details = await window.fetchDetails(item.id, item.media_type);
        inputElement.value = `${details.title || details.name}`;
        inputData[inputElement.id] = details;
        break;
    }
}


// --- 3. RANDOMIZE BUTTON LISTENERS ---
getAll('standard-start-randomize-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
        const view = e.target.closest('.app-view');
        const startInput = view.querySelector('#standard-search-start');
        const goalInput = view.querySelector('#standard-search-goal');
        await randomizeInput(startInput, goalInput);
    });
});

getAll('standard-goal-randomize-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
        const view = e.target.closest('.app-view');
        const startInput = view.querySelector('#standard-search-start');
        const goalInput = view.querySelector('#standard-search-goal');
        await randomizeInput(goalInput, startInput);
    });
});

getAll('standard-run-randomize-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
        const view = e.target.closest('.app-view');
        const startInput = view.querySelector('#standard-search-start');
        const goalInput = view.querySelector('#standard-search-goal');
        const startRunBtn = view.querySelector('#standard-start-run-btn');

        await randomizeInput(startInput, goalInput);
        await randomizeInput(goalInput, startInput);

        startRunBtn.click();
    });
});


// --- 4. NAVIGATION BUTTONS (Settings & Stats) ---
getAll('settings-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        window.switchView('view-settings');
    });
});

getAll('stats-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        window.switchView('view-stats');
    });
});

window.startRandomRun = async () => {
    const isMobile = window.innerWidth <= (window.MOBILE_BREAKPOINT || 1000);
    const view = document.getElementById(isMobile ? 'view-home-mobile' : 'view-home');
    const startInput = view.querySelector('#standard-search-start');
    const goalInput = view.querySelector('#standard-search-goal');
    const startRunBtn = view.querySelector('#standard-start-run-btn');

    await randomizeInput(startInput, goalInput);
    await randomizeInput(goalInput, startInput);
    startRunBtn.click();
};