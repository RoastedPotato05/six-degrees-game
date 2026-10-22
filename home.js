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

let currentDailyRun = null;

function createDailyRunData(run, random) {
    const parseKey = (key) => {
        const [id, media_type] = String(key).split(':');
        return { id: Number(id), media_type };
    };

    if (run) {
        return Promise.all([
            window.fetchDetails(...Object.values(parseKey(run.from_key))),
            window.fetchDetails(...Object.values(parseKey(run.to_key)))
        ]).then(([start, goal]) => ({ start, goal, modifiers: run }));
    }

    const candidates = Object.values(randomItems).flat();
    const isAllowed = (item, modifiers) => {
        if (modifiers['no-tv'] && item.media_type === 'tv') return false;
        if (modifiers['no-movies'] && item.media_type === 'movie') return false;

        const bannedLists = [
            modifiers['no-mcu'] ? window.BANNED_MCU : [],
            modifiers['no-big-3'] ? window.BANNED_BIG_3 : [],
            modifiers['no-talk-shows'] ? window.BANNED_AWARD_TALK_SHOWS : []
        ];
        return !bannedLists.flat().some((banned) =>
            banned.id === item.id && banned.media_type === item.media_type
        );
    };

    const createModifiers = () => {
        const modifiers = {
            'target-name-only': random() < 0.3,
            'no-mcu': random() < 0.8,
            'no-big-3': random() < 0.4,
            'no-talk-shows': true,
            'no-tv': false,
            'no-movies': false,
            bannedItems: []
        };

        if (random() < 0.2) {
            if (random() < 0.5) {
                modifiers['no-tv'] = true;
            } else {
                modifiers['no-movies'] = true;
            }
        }

        return modifiers;
    };

    const selectDistinctItems = (available) => {
        if (available.length < 2) return null;
        const startItem = available[Math.floor(random() * available.length)];
        const goalCandidates = available.filter((item) =>
            item.id !== startItem.id || item.media_type !== startItem.media_type
        );
        return {
            startItem,
            goalItem: goalCandidates[Math.floor(random() * goalCandidates.length)]
        };
    };

    return (async () => {
        const maxAttempts = 12;
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const modifiers = createModifiers();
            const available = candidates.filter((item) => isAllowed(item, modifiers));
            const selected = selectDistinctItems(available);
            if (!selected) continue;

            try {
                const [start, goal] = await Promise.all([
                    window.fetchDetails(selected.startItem.id, selected.startItem.media_type, { checkLocalImage: false }),
                    window.fetchDetails(selected.goalItem.id, selected.goalItem.media_type, { checkLocalImage: false })
                ]);
                const path = await window.shortestPath(start, goal, {
                    modifiers,
                    maxPathLength: 10,
                    returnPathDetails: false
                });

                if (path) {
                    const [displayStart, displayGoal] = await Promise.all([
                        window.fetchDetails(start.id, start.media_type),
                        window.fetchDetails(goal.id, goal.media_type)
                    ]);
                    return { start: displayStart, goal: displayGoal, path, modifiers };
                }
            } catch (error) {
                console.error(`Daily run attempt ${attempt + 1} failed:`, error);
            }
        }

        throw new Error('Unable to generate a daily run with a valid path after the retry limit.');
    })();
}

window.fetchDailyRunCandidates = fetchRandomItems;
window.generateDailyRunData = createDailyRunData;
window.resolveDailyRunGenerator();

async function renderDailyRun(data) {
    const getImage = (item) => item.imageUrl ||
        (item.poster_path || item.profile_path
            ? `https://image.tmdb.org/t/p/w500${item.poster_path || item.profile_path}`
            : '');
    const getName = (item) => item.title || item.name || 'Unknown item';

    const modifierLabels = [
        ['target-name-only', 'Target name only'],
        ['no-mcu', 'No MCU'],
        ['no-big-3', "No 'Big 3' directors"],
        ['no-talk-shows', 'No talk shows'],
        ['no-tv', 'No TV shows'],
        ['no-movies', 'No movies']
    ].filter(([key]) => data.modifiers[key]).map(([, label]) => label);

    if (data.modifiers.bannedItems?.length) {
        const bannedNames = await Promise.all(data.modifiers.bannedItems.map(async (key) => {
            const [id, mediaType] = String(key).split(':');
            try {
                const item = await window.fetchDetails(Number(id), mediaType);
                return getName(item);
            } catch (error) {
                console.error(`Failed to resolve daily run banned item ${key}:`, error);
                return key;
            }
        }));
        modifierLabels.push(`Banned items: ${bannedNames.join(', ')}`);
    }

    const panels = [
        {
            date: 'daily-run-date',
            startPoster: 'daily-run-start-poster',
            goalPoster: 'daily-run-goal-poster',
            startName: 'daily-run-start-name',
            goalName: 'daily-run-goal-name',
            modifiers: 'daily-run-modifiers'
        },
        {
            date: 'daily-run-date-mobile',
            startPoster: 'daily-run-start-poster-mobile',
            goalPoster: 'daily-run-goal-poster-mobile',
            startName: 'daily-run-start-name-mobile',
            goalName: 'daily-run-goal-name-mobile',
            modifiers: 'daily-run-modifiers-mobile'
        }
    ];

    panels.forEach((panel) => {
        const dateElement = document.getElementById(panel.date);
        const startPoster = document.getElementById(panel.startPoster);
        const goalPoster = document.getElementById(panel.goalPoster);
        const startName = document.getElementById(panel.startName);
        const goalName = document.getElementById(panel.goalName);
        const modifiersElement = document.getElementById(panel.modifiers);
        if (!dateElement || !startPoster || !goalPoster || !startName || !goalName || !modifiersElement) return;

        dateElement.textContent = window.dailyDateString;
        startPoster.src = getImage(data.start);
        goalPoster.src = getImage(data.goal);
        startPoster.alt = getName(data.start);
        goalPoster.alt = getName(data.goal);
        startName.textContent = getName(data.start);
        goalName.textContent = getName(data.goal);
        modifiersElement.innerHTML = '';

        if (modifierLabels.length === 0) {
            modifiersElement.textContent = 'No Modifiers';
            return;
        }

        const heading = document.createElement('div');
        heading.textContent = 'Modifiers:';
        heading.style.opacity = '0.5';
        heading.style.marginBottom = '12px';
        modifiersElement.appendChild(heading);

        modifierLabels.forEach((label) => {
            const modifier = document.createElement('div');
            modifier.textContent = label;
            modifier.style.marginBottom = '6px';
            modifiersElement.appendChild(modifier);
        });
    });
}

await window.dailyRunsReady;
const configuredDailyRun = window.DAILY_RUNS.find((run) => run.date === window.dailyDateString);
if (configuredDailyRun) {
    currentDailyRun = await createDailyRunData(configuredDailyRun, createDailyRandom(window.dailyDateString));
} else {
    const movieCandidates = Object.values(randomItems).flat().filter((item) => item.media_type === 'movie');
    if (movieCandidates.length < 2) {
        throw new Error('Daily run fallback requires at least two movie candidates.');
    }
    const random = createDailyRandom(window.dailyDateString);
    const startItem = movieCandidates[Math.floor(random() * movieCandidates.length)];
    let goalItem = movieCandidates[Math.floor(random() * movieCandidates.length)];
    while (goalItem.id === startItem.id || goalItem.media_type !== startItem.media_type) {
        goalItem = movieCandidates[Math.floor(random() * movieCandidates.length)];
    }
    const [start, goal] = await Promise.all([
        window.fetchDetails(startItem.id, startItem.media_type),
        window.fetchDetails(goalItem.id, goalItem.media_type)
    ]);
    currentDailyRun = {
        start,
        goal,
        modifiers: {
            'target-name-only': false,
            'no-mcu': false,
            'no-big-3': false,
            'no-talk-shows': false,
            'no-tv': false,
            'no-movies': false,
            bannedItems: []
        }
    };
}
await renderDailyRun(currentDailyRun);


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
            if (localStorage.getItem('no-talk-shows') === 'true' && typeof BANNED_AWARD_TALK_SHOWS !== 'undefined') {
                bannedItems = bannedItems.concat(BANNED_AWARD_TALK_SHOWS);
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
async function randomizeInput(inputElement, otherInputElement, random = Math.random) {
    while (true) {
        const categories = Object.keys(randomItems);
        const category = categories[Math.floor(random() * categories.length)];
        const item = randomItems[category][Math.floor(random() * randomItems[category].length)];
        
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
        if (localStorage.getItem('no-talk-shows') === 'true' && typeof BANNED_AWARD_TALK_SHOWS !== 'undefined' && BANNED_AWARD_TALK_SHOWS.some(b => b.id === item.id && b.media_type === item.media_type)) {
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

function createDailyRandom(seedText) {
    let seed = 0;
    for (const character of seedText) {
        seed = (seed * 31 + character.charCodeAt(0)) >>> 0;
    }

    return () => {
        seed = (1664525 * seed + 1013904223) >>> 0;
        return seed / 4294967296;
    };
}

function parseDailyRunKey(key) {
    const [id, media_type] = String(key).split(':');
    return { id: Number(id), media_type };
}

const dailyRunButtons = [
    ...getAll('daily-run-btn'),
    ...getAll('standard-daily-run-btn')
];

dailyRunButtons.forEach((button) => {
    button.addEventListener('click', async () => {
        window.setDailyRunSettings(currentDailyRun.modifiers);
        window.switchView('view-standard', {
            start: currentDailyRun.start,
            goal: currentDailyRun.goal
        });
    });
});