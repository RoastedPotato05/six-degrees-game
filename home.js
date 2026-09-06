const standardStartInput = document.getElementById('standard-search-start');
const standardGoalInput = document.getElementById('standard-search-goal');
const standardStartRunBtn = document.getElementById('standard-start-run-btn');
const standardGoalRandomizeBtn = document.getElementById('standard-goal-randomize-btn');
const standardStartRandomizeBtn = document.getElementById('standard-start-randomize-btn');
const standardRunRandomizeBtn = document.getElementById('standard-run-randomize-btn');
const settingsBtn = document.getElementById('settings-btn');
const statsBtn = document.getElementById('stats-btn');
const navLeft = document.getElementById('nav-left');
const navRight = document.getElementById('nav-right');
const homeMenuGamemodeText = document.getElementById('home-menu-gamemode-text');

let randomItems = null;
let numRandomItems = 200;





// fetch top 100 items for each and store the id and media type in the dict
async function fetchRandomItems() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) loadingOverlay.style.display = 'flex'; // Show custom loading screen

    try {
        // Helper function to fetch pages dynamically until we collect 100 items after filtering
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

        // 1. Fetch 100 English Movies
        const movies = await fetchUntil100(
            `https://api.themoviedb.org/3/discover/movie?sort_by=vote_count.desc&api_key=${TMDB_API_KEY}`, 
            'movie'
        );

        // 2. Fetch top actors organically by taking a limited slice of sorted cast per movie
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

        // 3. Fetch 100 English TV Shows
        const tv = await fetchUntil100(
            `https://api.themoviedb.org/3/discover/tv?sort_by=vote_count.desc&api_key=${TMDB_API_KEY}`, 
            'tv'
        );

        // Store everything in a dictionary/object
        const itemDict = {
            movies: movies,
            people: people,
            tv: tv
        };

        console.log(`Successfully fetched ${numRandomItems} items per category:`, itemDict);
        return itemDict;

    } finally {
        // Automatically hide only the custom loading overlay when done
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }
}

// if randomItems is not already fetched, fetch it
if (!randomItems) {
    randomItems = await fetchRandomItems();
}







// --- Start Input Listeners ---
standardStartInput.addEventListener('input', (e) => {
    delete inputData[e.target.id];

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => executeSearch(e.target), 500);
});

standardStartInput.addEventListener('focus', (e) => {
    if (e.target.value.trim()) {
        window.executeSearch(e.target);
    }
});


// --- Goal Input Listeners ---
standardGoalInput.addEventListener('input', (e) => {
    delete inputData[e.target.id];

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => executeSearch(e.target), 500);
});

standardGoalInput.addEventListener('focus', (e) => {
    if (e.target.value.trim()) {
        window.executeSearch(e.target);
    }
});


// --- Start Run Button Listener ---
standardStartRunBtn.addEventListener('click', async () => {
    window.currentMode = 'STANDARD';

    async function validateInput(inputElement) {
        const text = inputElement.value.trim();
        
        // 1. Check for empty input
        if (!text) {
            window.showInputError(inputElement, 'Please enter an item!');
            return null;
        }

        // 2. Get data from cache or auto-resolve top result
        let data = inputData[inputElement.id];
        if (!data) {
            console.log(`No dropdown selection for [${inputElement.id}]. Auto-resolving top result for: "${text}"`);
            data = await window.resolveInputData(inputElement);
            
            // 3. Check if search resolution failed (no results)
            if (!data) {
                window.showInputError(inputElement, 'No results found!');
                return null;
            }
        }

        // 4. Check if the item is banned
        const mediaFilter = localStorage.getItem('mediaFilter') || 'none';
        if (mediaFilter === 'no-tv' && data.media_type === 'tv') {
            window.showInputError(inputElement, 'TV shows are disabled in settings!');
            return null;
        }
        if (mediaFilter === 'no-movies' && data.media_type === 'movie') {
            window.showInputError(inputElement, 'Movies are disabled in settings!');
            return null;
        }


        let  bannedItems = JSON.parse(localStorage.getItem('bannedItems') || '[]');

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

    // Validate both inputs concurrently so errors render on both fields at the same time
    const [startResult, goalResult] = await Promise.all([
        validateInput(standardStartInput),
        validateInput(standardGoalInput)
    ]);

    currentStartData = startResult;
    currentGoalData = goalResult;

    // If either input failed validation, stop the run from starting
    if (!currentStartData || !currentGoalData) {
        return;
    }

    window.switchView('view-standard', { start: currentStartData, goal: currentGoalData });
});


// Helper function to pick a valid random item and populate an input element
async function randomizeInput(inputElement) {
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

        // ensure the start and goal are not the same item
        const otherInputElement = inputElement === standardStartInput ? standardGoalInput : standardStartInput;
        const otherData = inputData[otherInputElement.id];
        if (otherData && otherData.id === item.id && otherData.media_type === item.media_type) {
            continue;
        }

        const bannedItems = JSON.parse(localStorage.getItem('bannedItems') || '[]');
        if (bannedItems.some(b => b.id === item.id && b.media_type === item.media_type)) {
            continue;
        }

        // Fetch details and populate input + cache
        const details = await window.fetchDetails(item.id, item.media_type);
        inputElement.value = `${details.title || details.name}`;
        inputData[inputElement.id] = details;
        break;
    }
}


// --- Randomize Button Listeners ---
standardGoalRandomizeBtn.addEventListener('click', async () => {
    await randomizeInput(standardGoalInput);
});

standardStartRandomizeBtn.addEventListener('click', async () => {
    await randomizeInput(standardStartInput);
});

standardRunRandomizeBtn.addEventListener('click', async () => {
    await randomizeInput(standardStartInput);
    await randomizeInput(standardGoalInput);

    // Now that both inputs and their caches are fully populated, trigger the start run
    standardStartRunBtn.click();
});


settingsBtn.addEventListener('click', () => {
    window.switchView('view-settings');
});

statsBtn.addEventListener('click', () => {
    window.switchView('view-stats');
});

window.startRandomRun = async () => {
    await randomizeInput(standardStartInput);
    await randomizeInput(standardGoalInput);
    standardStartRunBtn.click();
};


navLeft.addEventListener('click', () => {
    homeMenuGamemodeText.textContent = "test";
}); 