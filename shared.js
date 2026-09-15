// shared.js
import Graph from "https://esm.sh/graphology";
import Sigma from "https://esm.sh/sigma";


const TMDB_API_KEY = '1bb166cc311693519c574fe0560e8d05';
const BASE_URL = 'https://api.themoviedb.org/3';

const BANNED_MCU = [
  {
    "id": 1726,
    "name": "Iron Man",
    "media_type": "movie"
  },
  {
    "id": 1724,
    "name": "The Incredible Hulk",
    "media_type": "movie"
  },
  {
    "id": 10138,
    "name": "Iron Man 2",
    "media_type": "movie"
  },
  {
    "id": 10195,
    "name": "Thor",
    "media_type": "movie"
  },
  {
    "id": 1771,
    "name": "Captain America: The First Avenger",
    "media_type": "movie"
  },
  {
    "id": 76122,
    "name": "Marvel One-Shot: The Consultant",
    "media_type": "movie"
  },
  {
    "id": 76535,
    "name": "Marvel One-Shot: A Funny Thing Happened on the Way to Thor's Hammer",
    "media_type": "movie"
  },
  {
    "id": 24428,
    "name": "The Avengers",
    "media_type": "movie"
  },
  {
    "id": 119569,
    "name": "Marvel One-Shot: Item 47",
    "media_type": "movie"
  },
  {
    "id": 68721,
    "name": "Iron Man 3",
    "media_type": "movie"
  },
  {
    "id": 211387,
    "name": "Marvel One-Shot: Agent Carter",
    "media_type": "movie"
  },
  {
    "id": 76338,
    "name": "Thor: The Dark World",
    "media_type": "movie"
  },
  {
    "id": 253980,
    "name": "Marvel One-Shot: All Hail the King",
    "media_type": "movie"
  },
  {
    "id": 100402,
    "name": "Captain America: The Winter Soldier",
    "media_type": "movie"
  },
  {
    "id": 118340,
    "name": "Guardians of the Galaxy",
    "media_type": "movie"
  },
  {
    "id": 202555,
    "name": "Daredevil: Born Again",
    "media_type": "tv"
  },
  {
    "id": 99861,
    "name": "Avengers: Age of Ultron",
    "media_type": "movie"
  },
  {
    "id": 102899,
    "name": "Ant-Man",
    "media_type": "movie"
  },
  {
    "id": 38472,
    "name": "Marvel's Jessica Jones",
    "media_type": "tv"
  },
  {
    "id": 271110,
    "name": "Captain America: Civil War",
    "media_type": "movie"
  },
  {
    "id": 62126,
    "name": "Marvel's Luke Cage",
    "media_type": "tv"
  },
  {
    "id": 284052,
    "name": "Doctor Strange",
    "media_type": "movie"
  },
  {
    "id": 62127,
    "name": "Marvel's Iron Fist",
    "media_type": "tv"
  },
  {
    "id": 283995,
    "name": "Guardians of the Galaxy Vol. 2",
    "media_type": "movie"
  },
  {
    "id": 315635,
    "name": "Spider-Man: Homecoming",
    "media_type": "movie"
  },
  {
    "id": 11515,
    "name": "The Defenders",
    "media_type": "tv"
  },
  {
    "id": 284053,
    "name": "Thor: Ragnarok",
    "media_type": "movie"
  },
  {
    "id": 67178,
    "name": "Marvel's The Punisher",
    "media_type": "tv"
  },
  {
    "id": 284054,
    "name": "Black Panther",
    "media_type": "movie"
  },
  {
    "id": 299536,
    "name": "Avengers: Infinity War",
    "media_type": "movie"
  },
  {
    "id": 640146,
    "name": "Ant-Man and the Wasp: Quantumania",
    "media_type": "movie"
  },
  {
    "id": 299537,
    "name": "Captain Marvel",
    "media_type": "movie"
  },
  {
    "id": 299534,
    "name": "Avengers: Endgame",
    "media_type": "movie"
  },
  {
    "id": 429617,
    "name": "Spider-Man: Far From Home",
    "media_type": "movie"
  },
  {
    "id": 114695,
    "name": "Marvel Studios Legends",
    "media_type": "tv"
  },
  {
    "id": 85271,
    "name": "WandaVision",
    "media_type": "tv"
  },
  {
    "id": 88396,
    "name": "The Falcon and the Winter Soldier",
    "media_type": "tv"
  },
  {
    "id": 84958,
    "name": "Loki",
    "media_type": "tv"
  },
  {
    "id": 497698,
    "name": "Black Widow",
    "media_type": "movie"
  },
  {
    "id": 91363,
    "name": "What If...?",
    "media_type": "tv"
  },
  {
    "id": 566525,
    "name": "Shang-Chi and the Legend of the Ten Rings",
    "media_type": "movie"
  },
  {
    "id": 524434,
    "name": "Eternals",
    "media_type": "movie"
  },
  {
    "id": 88329,
    "name": "Hawkeye",
    "media_type": "tv"
  },
  {
    "id": 634649,
    "name": "Spider-Man: No Way Home",
    "media_type": "movie"
  },
  {
    "id": 92749,
    "name": "Moon Knight",
    "media_type": "tv"
  },
  {
    "id": 453395,
    "name": "Doctor Strange in the Multiverse of Madness",
    "media_type": "movie"
  },
  {
    "id": 92782,
    "name": "Ms. Marvel",
    "media_type": "tv"
  },
  {
    "id": 616037,
    "name": "Thor: Love and Thunder",
    "media_type": "movie"
  },
  {
    "id": 232125,
    "name": "I Am Groot",
    "media_type": "tv"
  },
  {
    "id": 92783,
    "name": "She-Hulk: Attorney at Law",
    "media_type": "tv"
  },
  {
    "id": 894205,
    "name": "Werewolf by Night",
    "media_type": "movie"
  },
  {
    "id": 505642,
    "name": "Black Panther: Wakanda Forever",
    "media_type": "movie"
  },
  {
    "id": 774752,
    "name": "The Guardians of the Galaxy Holiday Special",
    "media_type": "movie"
  },
  {
    "id": 640146,
    "name": "Ant-Man and the Wasp: Quantumania",
    "media_type": "movie"
  },
  {
    "id": 447365,
    "name": "Guardians of the Galaxy Vol. 3",
    "media_type": "movie"
  },
  {
    "id": 114472,
    "name": "Secret Invasion",
    "media_type": "tv"
  },
  {
    "id": 609681,
    "name": "The Marvels",
    "media_type": "movie"
  },
  {
    "id": 122226,
    "name": "Echo",
    "media_type": "tv"
  },
  {
    "id": 533535,
    "name": "Deadpool & Wolverine",
    "media_type": "movie"
  },
  {
    "id": 138501,
    "name": "Agatha All Along",
    "media_type": "tv"
  },
  {
    "id": 822119,
    "name": "Captain America: Brave New World",
    "media_type": "movie"
  },
  {
    "id": 986056,
    "name": "Thunderbolts*",
    "media_type": "movie"
  },
  {
    "id": 114471,
    "name": "Ironheart",
    "media_type": "tv"
  },
  {
    "id": 617126,
    "name": "The Fantastic 4: First Steps",
    "media_type": "movie"
  },
  {
    "id": 198178,
    "name": "Wonder Man",
    "media_type": "tv"
  },
  {
    "id": 969681,
    "name": "Spider-Man: Brand New Day",
    "media_type": "movie"
  },
  {
    "id": 213375,
    "name": "VisionQuest",
    "media_type": "tv"
  },
  {
    "id": 1003596,
    "name": "Avengers: Doomsday",
    "media_type": "movie"
  },
  {
    "id": 1003598,
    "name": "Avengers: Secret Wars",
    "media_type": "movie"
  }
];

const BANNED_BIG_3 = [
    {
        "id": 488,
        "name": "Steven Spielberg",
        "media_type": "person"
    },
    {
        "id": 525,
        "name": "Christopher Nolan",
        "media_type": "person"
    },
    {
        "id": 138,
        "name": "Quentin Tarantino",
        "media_type": "person"
    },
  {
    "id": 1368337,
    "name": "The Odyssey",
    "media_type": "movie"
  },
  {
    "id": 872585,
    "name": "Oppenheimer",
    "media_type": "movie"
  },
  {
    "id": 577922,
    "name": "Tenet",
    "media_type": "movie"
  },
  {
    "id": 374720,
    "name": "Dunkirk",
    "media_type": "movie"
  },
  {
    "id": 352114,
    "name": "Quay",
    "media_type": "movie"
  },
  {
    "id": 157336,
    "name": "Interstellar",
    "media_type": "movie"
  },
  {
    "id": 49026,
    "name": "The Dark Knight Rises",
    "media_type": "movie"
  },
  {
    "id": 27205,
    "name": "Inception",
    "media_type": "movie"
  },
  {
    "id": 155,
    "name": "The Dark Knight",
    "media_type": "movie"
  },
  {
    "id": 505819,
    "name": "Cinema 16: European Short Films (U.S. Edition)",
    "media_type": "movie"
  },
  {
    "id": 1124,
    "name": "The Prestige",
    "media_type": "movie"
  },
  {
    "id": 272,
    "name": "Batman Begins",
    "media_type": "movie"
  },
  {
    "id": 126444,
    "name": "Cinema16: British Short Films",
    "media_type": "movie"
  },
  {
    "id": 320,
    "name": "Insomnia",
    "media_type": "movie"
  },
  {
    "id": 77,
    "name": "Memento",
    "media_type": "movie"
  },
  {
    "id": 11660,
    "name": "Following",
    "media_type": "movie"
  },
  {
    "id": 43629,
    "name": "Doodlebug",
    "media_type": "movie"
  },
  {
    "id": 445962,
    "name": "Larceny",
    "media_type": "movie"
  },
  {
    "id": 804706,
    "name": "Tarantella",
    "media_type": "movie"
  },
  {
    "id": 1275779,
    "name": "Disclosure Day",
    "media_type": "movie"
  },
  {
    "id": 804095,
    "name": "The Fabelmans",
    "media_type": "movie"
  },
  {
    "id": 511809,
    "name": "West Side Story",
    "media_type": "movie"
  },
  {
    "id": 333339,
    "name": "Ready Player One",
    "media_type": "movie"
  },
  {
    "id": 446354,
    "name": "The Post",
    "media_type": "movie"
  },
  {
    "id": 267935,
    "name": "The BFG",
    "media_type": "movie"
  },
  {
    "id": 296098,
    "name": "Bridge of Spies",
    "media_type": "movie"
  },
  {
    "id": 72976,
    "name": "Lincoln",
    "media_type": "movie"
  },
  {
    "id": 57212,
    "name": "War Horse",
    "media_type": "movie"
  },
  {
    "id": 17578,
    "name": "The Adventures of Tintin",
    "media_type": "movie"
  },
  {
    "id": 1198548,
    "name": "A Timeless Call",
    "media_type": "movie"
  },
  {
    "id": 217,
    "name": "Indiana Jones and the Kingdom of the Crystal Skull",
    "media_type": "movie"
  },
  {
    "id": 612,
    "name": "Munich",
    "media_type": "movie"
  },
  {
    "id": 755898,
    "name": "War of the Worlds",
    "media_type": "movie"
  },
  {
    "id": 594,
    "name": "The Terminal",
    "media_type": "movie"
  },
  {
    "id": 640,
    "name": "Catch Me If You Can",
    "media_type": "movie"
  },
  {
    "id": 180,
    "name": "Minority Report",
    "media_type": "movie"
  },
  {
    "id": 644,
    "name": "A.I. Artificial Intelligence",
    "media_type": "movie"
  },
  {
    "id": 793912,
    "name": "The Unfinished Journey",
    "media_type": "movie"
  },
  {
    "id": 857,
    "name": "Saving Private Ryan",
    "media_type": "movie"
  },
  {
    "id": 1184074,
    "name": "Amistad",
    "media_type": "movie"
  },
  {
    "id": 330,
    "name": "The Lost World: Jurassic Park",
    "media_type": "movie"
  },
  {
    "id": 424,
    "name": "Schindler's List",
    "media_type": "movie"
  },
  {
    "id": 329,
    "name": "Jurassic Park",
    "media_type": "movie"
  },
  {
    "id": 879,
    "name": "Hook",
    "media_type": "movie"
  },
  {
    "id": 1309288,
    "name": "Amazing Stories: The Movie II",
    "media_type": "movie"
  },
  {
    "id": 11352,
    "name": "Always",
    "media_type": "movie"
  },
  {
    "id": 89,
    "name": "Indiana Jones and the Last Crusade",
    "media_type": "movie"
  },
  {
    "id": 10110,
    "name": "Empire of the Sun",
    "media_type": "movie"
  },
  {
    "id": 576510,
    "name": "Amazing Stories",
    "media_type": "movie"
  },
  {
    "id": 558915,
    "name": "The Color Purple",
    "media_type": "movie"
  },
  {
    "id": 87,
    "name": "Indiana Jones and the Temple of Doom",
    "media_type": "movie"
  },
  {
    "id": 15301,
    "name": "Twilight Zone: The Movie",
    "media_type": "movie"
  },
  {
    "id": 601,
    "name": "E.T. the Extra-Terrestrial",
    "media_type": "movie"
  },
  {
    "id": 85,
    "name": "Raiders of the Lost Ark",
    "media_type": "movie"
  },
  {
    "id": 11519,
    "name": "1941",
    "media_type": "movie"
  },
  {
    "id": 840,
    "name": "Close Encounters of the Third Kind",
    "media_type": "movie"
  },
  {
    "id": 578,
    "name": "Jaws",
    "media_type": "movie"
  },
  {
    "id": 5121,
    "name": "The Sugarland Express",
    "media_type": "movie"
  },
  {
    "id": 1245859,
    "name": "Savage House",
    "media_type": "movie"
  },
  {
    "id": 85483,
    "name": "Something Evil",
    "media_type": "movie"
  },
  {
    "id": 839,
    "name": "Duel",
    "media_type": "movie"
  },
  {
    "id": 590390,
    "name": "Peter Falk versus Columbo",
    "media_type": "movie"
  },
  {
    "id": 1275498,
    "name": "The Psychiatrist",
    "media_type": "movie"
  },
  {
    "id": 526303,
    "name": "The Name of the Game",
    "media_type": "movie"
  },
  {
    "id": 391069,
    "name": "Night Gallery",
    "media_type": "movie"
  },
  {
    "id": 845271,
    "name": "The Return of Marcus Welby, M.D.",
    "media_type": "movie"
  },
  {
    "id": 97105,
    "name": "Amblin'",
    "media_type": "movie"
  },
  {
    "id": 1588237,
    "name": "The Lost Chapter: Yuki's Revenge",
    "media_type": "movie"
  },
  {
    "id": 466272,
    "name": "Once Upon a Time... in Hollywood",
    "media_type": "movie"
  },
  {
    "id": 273248,
    "name": "The Hateful Eight",
    "media_type": "movie"
  },
  {
    "id": 68718,
    "name": "Django Unchained",
    "media_type": "movie"
  },
  {
    "id": 414419,
    "name": "Kill Bill: The Whole Bloody Affair",
    "media_type": "movie"
  },
  {
    "id": 16869,
    "name": "Inglourious Basterds",
    "media_type": "movie"
  },
  {
    "id": 1991,
    "name": "Death Proof",
    "media_type": "movie"
  },
  {
    "id": 285923,
    "name": "Grindhouse",
    "media_type": "movie"
  },
  {
    "id": 187,
    "name": "Sin City",
    "media_type": "movie"
  },
  {
    "id": 393,
    "name": "Kill Bill: Vol. 2",
    "media_type": "movie"
  },
  {
    "id": 24,
    "name": "Kill Bill: Vol. 1",
    "media_type": "movie"
  },
  {
    "id": 184,
    "name": "Jackie Brown",
    "media_type": "movie"
  },
  {
    "id": 5,
    "name": "Four Rooms",
    "media_type": "movie"
  },
  {
    "id": 252407,
    "name": "Me and Him",
    "media_type": "movie"
  },
  {
    "id": 680,
    "name": "Pulp Fiction",
    "media_type": "movie"
  },
  {
    "id": 500,
    "name": "Reservoir Dogs",
    "media_type": "movie"
  }
];

export const graph = new Graph();


let debounceTimer;
let searchResults = [];
let inputData = {};
let currentMode = "STANDARD";
let currentStartData;
let currentGoalData;
let startTime = 0;
let tInterval = null;
let difference = 0;
let updatedTime = 0;
let gamemodes = ["STANDARD", "DETOUR", "ENDLESS"];
let sigmaInstance = null;
let lastCenterNodeId = null;
let hoveredNodes = new Set();
let hoveredNeighbors = new Set();
let selectedNodes = new Set();       // <-- Tracks multiple selected nodes
let selectedNeighbors = new Set();   // <-- Tracks neighbors of all selected nodes



let bgMusic = window.bgMusic;
if (!bgMusic) {
    const audioUrl = new URL('sounds/background.mp3', window.location.href).href;
    bgMusic = new Audio(audioUrl);
    bgMusic.loop = true;
    
    // Fall back to 0 (or your preferred default) instead of 0.5/1.0 if not set
    const musicVol = localStorage.getItem('musicVolume');
    const masterVol = localStorage.getItem('masterVolume');
    const mVal = musicVol !== null ? parseFloat(musicVol) : 0.5; 
    const maVal = masterVol !== null ? parseFloat(masterVol) : 0; // Changed default fallback to 0
    bgMusic.volume = Math.min(1, Math.max(0, mVal * maVal));
    console.log("Audio initialized. Volume:", bgMusic.volume);

    bgMusic.onerror = (e) => {
        console.error("Audio error: Could not load 'sounds/background.mp3'.", e);
    };

    

    // Always attempt to play; if blocked, wait for any click/key to unlock it on this page
    bgMusic.play().then(() => {
        console.log("Audio playing successfully.");
    }).catch(() => {
        console.log("Autoplay blocked by browser. Click anywhere on the page to start music.");
        const startOnInteraction = () => {
            bgMusic.play().then(() => {
                console.log("Audio started via user interaction.");
            }).catch(err => console.log("Interaction play failed:", err));
            window.removeEventListener('click', startOnInteraction);
            window.removeEventListener('keydown', startOnInteraction);
        };
        window.addEventListener('click', startOnInteraction);
        window.addEventListener('keydown', startOnInteraction);
    });

    window.bgMusic = bgMusic;
}

function playSoundEffect(filename) {
    const sfx = new Audio(`sounds/${filename}`);
    
    // Pull saved volumes from localStorage
    const masterVol = localStorage.getItem('masterVolume');
    const sfxVol = localStorage.getItem('sfxVolume');
    
    const maVal = masterVol !== null ? parseFloat(masterVol) : 0;
    const sVal = sfxVol !== null ? parseFloat(sfxVol) : 0.5;
    
    // Apply combined volume scaling
    sfx.volume = Math.min(1, Math.max(0, sVal * maVal));
    
    sfx.play().catch(err => {
        console.log("SFX play blocked or failed:", err);
    });
};






// Helper function to execute the search and update results
function executeSearch(inputElement) {
    const searchTerm = inputElement.value.trim();
    if (searchTerm) {
        fetch(`${BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${searchTerm}`)
            .then(response => response.json())
            .then(data => {
                searchResults = data.results;
                searchResults = getTopResults(searchResults);
                console.log(searchResults);
                displaySearchResults(searchResults);
            });
    }
}


// given a tmdb id and type ('movie' or 'person' or 'tv'), fetch the details
async function fetchDetails(id, type) {
    let appendParam = 'credits';
    if (type === 'person') {
        appendParam = 'combined_credits';
    } else if (type === 'tv') {
        appendParam = 'aggregate_credits';
    }
    
    try {
        const response = await fetch(`${BASE_URL}/${type}/${id}?api_key=${TMDB_API_KEY}&append_to_response=${appendParam}`);
        const data = await response.json();
        data.media_type = type;
        
        // Normalize person's combined_credits into data.credits
        if (type === 'person' && data.combined_credits) {
            data.credits = data.combined_credits;
            delete data.combined_credits;
        }
        
        // Normalize TV's aggregate_credits into data.credits to get the full cast/crew list
        if (type === 'tv' && data.aggregate_credits) {
            data.credits = data.aggregate_credits;
            delete data.aggregate_credits;
        }

        const localUrl = `images/${data.id}-${data.name || data.title}.png`;
        console.log(`Checking for local image: ${localUrl}`);
        
        // Default to TMDB image if available
        const tmdbPath = data.poster_path || data.profile_path;
        data.imageUrl = tmdbPath ? `https://image.tmdb.org/t/p/w500${tmdbPath}` : null;

        try {
            const check = await fetch(localUrl, { method: 'HEAD' });
            if (check.ok) {
                // If local file exists, override imageUrl to point to your folder
                data.imageUrl = localUrl;
            }
        } catch (error) {
            // Local file doesn't exist, keep the TMDB URL
        }
        
        return data;
        
    } catch (error) {
        console.error('Error fetching details:', error);
        throw error;
    }
}

// pass in the search results by popularity and grab up to top 10
function getTopResults(searchResults) {
    return searchResults.sort((a, b) => b.popularity - a.popularity).slice(0, 10);
}

// display the search results in the UI
function displaySearchResults(searchResults) {
    const activeInput = document.activeElement;
    if (!activeInput || !activeInput.matches('input')) return;

    document.querySelectorAll('.search-results-dropdown').forEach(d => {
        d.innerHTML = '';
    });

    const container = activeInput.closest('.search-container');
    if (!container) return;

    let dropdown = container.querySelector('.search-results-dropdown');
    
    if (!dropdown) {
        dropdown = document.createElement('ul');
        dropdown.className = 'search-results-dropdown';
        container.appendChild(dropdown);
    }

    dropdown.innerHTML = '';

    if (!searchResults || searchResults.length === 0) {
        dropdown.innerHTML = '<li class="search-result-item">No results found</li>';
        return;
    }

    searchResults.forEach(item => {
        const li = document.createElement('li');
        li.className = 'search-result-item';

        let name = '';
        let imagePath = null;
        let subText = '';

        if (item.media_type === 'movie') {
            name = item.title || item.original_title;
            imagePath = item.poster_path;
            subText = item.release_date ? item.release_date.split('-')[0] : '';
        } else if (item.media_type === 'tv') {
            name = item.name || item.original_name;
            imagePath = item.poster_path;
            subText = item.first_air_date ? item.first_air_date.split('-')[0] : '';
        } else if (item.media_type === 'person') {
            name = item.name;
            imagePath = item.profile_path;
            subText = '';
        }

        const imgHtml = imagePath 
            ? `<img src="https://image.tmdb.org/t/p/w92${imagePath}" style="width: 56px; height: 84px; object-fit: cover; border-radius: 2px; margin-right: 10px;" />` 
            : `<div style="width: 56px; height: 84px; background: #2c3844; border-radius: 2px; margin-right: 10px; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 16px; color: #99AABB;">N/A</div>`;

        li.innerHTML = `
            <div style="display: flex; align-items: center; overflow: hidden;">
                ${imgHtml}
                <div style="overflow: hidden;">
                    <div style="font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #f8f8f8; font-size: 20px;">${name}</div>
                    <div style="font-size: 16px; color: #99AABB;">${subText}</div>
                </div>
            </div>
            <span class="search-result-type" style="font-size: 16px">${item.media_type}</span>
        `;

        li.addEventListener('click', () => {
            if (activeInput && activeInput.id === 'banned-item-search') {
                activeInput.value = '';
                dropdown.innerHTML = '';

                let bannedItems = JSON.parse(localStorage.getItem('bannedItems') || '[]');
                if (!bannedItems.some(i => i.id === item.id && i.media_type === item.media_type)) {
                    let name = '';
                    let imagePath = null;
                    let subText = '';

                    if (item.media_type === 'movie') {
                        name = item.title || item.original_title;
                        imagePath = item.poster_path;
                        subText = item.release_date ? item.release_date.split('-')[0] : '';
                    } else if (item.media_type === 'tv') {
                        name = item.name || item.original_name;
                        imagePath = item.poster_path;
                        subText = item.first_air_date ? item.first_air_date.split('-')[0] : '';
                    } else if (item.media_type === 'person') {
                        name = item.name;
                        imagePath = item.profile_path;
                        subText = '';
                    }

                    bannedItems.push({
                        id: item.id,
                        media_type: item.media_type,
                        name: name,
                        imagePath: imagePath,
                        subText: subText
                    });
                    localStorage.setItem('bannedItems', JSON.stringify(bannedItems));

                    if (typeof window.renderBannedItems === 'function') {
                        window.renderBannedItems();
                    }
                }
            } else {
                activeInput.value = name;
                dropdown.innerHTML = '';
                
                const mediaType = item.media_type === 'tv' ? 'tv' : item.media_type;
                
                fetchDetails(item.id, mediaType).then(data => {
                    inputData[activeInput.id] = data;
                    console.log(`Saved data for [${activeInput.id}]:`, inputData[activeInput.id]);
                });
            }
        });

        dropdown.appendChild(li);
    });
}

// Automatically search and fetch details for the top result of a given input's text
async function resolveInputData(inputElement) {
    const searchTerm = inputElement.value.trim();
    if (!searchTerm) return null;

    try {
        const searchResponse = await fetch(`${BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(searchTerm)}`);
        const searchData = await searchResponse.json();
        
        const topResults = getTopResults(searchData.results || []);
        if (topResults.length === 0) return null;

        const topItem = topResults[0];
        const mediaType = topItem.media_type === 'tv' ? 'tv' : topItem.media_type;

        const detailData = await fetchDetails(topItem.id, mediaType);
        inputData[inputElement.id] = detailData;
        
        inputElement.value = topItem.title || topItem.name || searchTerm;

        return detailData;
    } catch (error) {
        console.error("Error auto-resolving input data:", error);
        return null;
    }
}

// Close dropdowns if the user clicks anywhere outside of the search container
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
        document.querySelectorAll('.search-results-dropdown').forEach(dropdown => {
            dropdown.innerHTML = '';
        });
    }
});



function start() {
    // Start the stopwatch
    startTime = Date.now() - difference;
    tInterval = setInterval(updateDisplay, 10); // Update every 10ms for precision
}

function stop() {
    // Stop the stopwatch
    clearInterval(tInterval);
    difference = Date.now() - startTime; // Save elapsed time
    window.difference = difference;

    // Force the visual display to match the final calculated difference exactly
    let updatedTime = new Date(difference);
    let minutes = updatedTime.getUTCMinutes();
    let seconds = updatedTime.getUTCSeconds();
    let milliseconds = updatedTime.getUTCMilliseconds();

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    milliseconds = milliseconds < 100 ? (milliseconds < 10 ? "00" + milliseconds : "0" + milliseconds) : milliseconds;

    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").textContent = seconds;
    document.getElementById("milliseconds").textContent = milliseconds;
}

function reset() {
    // Stop the timer, reset values, and update display to zero
    clearInterval(tInterval);
    difference = 0;
    window.difference = difference;
    document.getElementById("minutes").textContent = "00";
    document.getElementById("seconds").textContent = "00";
    document.getElementById("milliseconds").textContent = "000";
}

function updateDisplay() {
    updatedTime = new Date(Date.now() - startTime);

    let minutes = updatedTime.getUTCMinutes();
    let seconds = updatedTime.getUTCSeconds();
    let milliseconds = updatedTime.getUTCMilliseconds();
    // Format time to ensure leading zeros
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    milliseconds = milliseconds < 100 ? milliseconds < 10 ? "00" + milliseconds : "0" + milliseconds : milliseconds;

    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").textContent = seconds;
    document.getElementById("milliseconds").textContent = milliseconds;
}

// Listen for typing on ANY input to show/hide its specific clear button
document.addEventListener('input', (e) => {
    if (e.target.tagName === 'INPUT') {
        // Find the clear button next to this specific input
        const clearBtn = e.target.parentElement.querySelector('.clear-btn');
        if (clearBtn) {
            clearBtn.style.display = e.target.value.length > 0 ? 'block' : 'none';
        }
    }
});

// Listen for clicks on ANY clear button
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('clear-btn')) {
        // Find the input right next to the clicked 'X'
        const input = e.target.parentElement.querySelector('input');
        
        if (input) {
            input.value = '';            // Clear the text
            input.focus();               // Keep the user's cursor in the box
            e.target.style.display = 'none'; // Hide the 'X'
            
            // CRITICAL: Manually trigger an 'input' event so other scripts 
            // (like your standard.js search filter) know the text just changed to blank.
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }
});

const originalInputValueDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
if (originalInputValueDescriptor) {
    Object.defineProperty(HTMLInputElement.prototype, 'value', {
        get: function() {
            return originalInputValueDescriptor.get.call(this);
        },
        set: function(val) {
            const oldValue = this.value;
            originalInputValueDescriptor.set.call(this, val);
            if (oldValue !== val) {
                this.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
    });
}



function switchView(viewId, params = {}) {
    document.querySelectorAll('.app-view').forEach(view => {
        view.style.display = 'none';
    });
    document.getElementById('save-text').innerText = 'Save';
    document.getElementById('share-text').innerText = 'Share';

    reset();

    const timerSection = document.getElementById('footer-timer-section');
    const settingsSection = document.getElementById('footer-settings-section');
    const statsSection = document.getElementById('footer-stats-section');

    
    document.getElementById('timer-return-btn').style.display = 'none';
    
    if (timerSection) timerSection.style.display = 'none';
    if (settingsSection) settingsSection.style.display = 'none';
    if (statsSection) statsSection.style.display = 'none';

    if (viewId === 'view-settings') {
        if (settingsSection) settingsSection.style.display = 'flex';
    } else if (viewId === 'view-stats') {
        if (statsSection) statsSection.style.display = 'flex';
    } else {
        if (timerSection) timerSection.style.display = 'flex';
    }

    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.style.display = 'flex';
        window.scrollTo(0, 0);

        if (viewId === 'view-home' && typeof window.initHome === 'function') {
            window.initHome();
        } else if (viewId === 'view-settings' && typeof window.initSettings === 'function') {
            window.initSettings();
        } else if (viewId === 'view-standard' && typeof window.initStandard === 'function') {
            window.currentMode = 'STANDARD';
            window.initStandard(params.start, params.goal);
        } else if (viewId === 'view-detours' && typeof window.initDetours === 'function') {
            window.initDetours();
        } else if (viewId === 'view-stats' && typeof window.initStats === 'function') {
            window.initStats();
        }
    }
}


// Auto-load home view on initial page load
document.addEventListener('DOMContentLoaded', () => {
    switchView('view-home');
});


const githubLink = document.getElementById('github-link');
const letterboxdLink = document.getElementById('letterboxd-link');
const infoLink = document.getElementById('info-link');


githubLink.addEventListener('click', () => {
    window.open('https://github.com/RoastedPotato05/cinema-speedrun', '_blank');
});

letterboxdLink.addEventListener('click', () => {
    window.open('https://letterboxd.com/RoastedPotato05', '_blank');
});

infoLink.addEventListener('click', () => {
    const infoPopup = document.getElementById('info-popup');
    const overlay = document.getElementById('overlay');
    if (infoPopup) {
        infoPopup.style.display = 'block';
    }
    if (overlay) {
        overlay.style.display = 'block';
    }

    const infoExit = document.getElementById('info-exit');
    if (infoExit) {
        infoExit.addEventListener('click', () => {
            if (infoPopup) {
                infoPopup.style.display = 'none';
            }
            if (overlay) {
                overlay.style.display = 'none';
            }
        });
    }
});



function showInputError(inputElement, message) {
    if (!inputElement) return;

    const container = inputElement.closest('.search-container') || inputElement.parentElement;
    if (container && getComputedStyle(container).position === 'static') {
        container.style.position = 'relative';
    }

    inputElement.classList.add('search-input-error');

    let msgEl = container.querySelector('.input-error-msg');
    if (!msgEl) {
        msgEl = document.createElement('div');
        msgEl.className = 'input-error-msg';
        container.appendChild(msgEl);
    }
    
    msgEl.innerText = message;
    msgEl.style.opacity = '1';

    if (inputElement.errorTimeout) {
        clearTimeout(inputElement.errorTimeout);
    }

    inputElement.errorTimeout = setTimeout(() => {
        inputElement.classList.remove('search-input-error');
        msgEl.style.opacity = '0';
        
        setTimeout(() => {
            if (msgEl.parentElement && msgEl.style.opacity === '0') {
                msgEl.remove();
            }
        }, 1000);
    }, 2000);
}

// initialize statistics
let stats = JSON.parse(localStorage.getItem('stats')) || {
    wins: 0,
    winStreak: 0,
    shortestPath: null,
    averagePath: null,
    longestPath: null,
    fastestTime: null,
    averageTime: null,
    slowestTime: null,
    mostVisited: {},
    savedRuns: []
};
localStorage.setItem('stats', JSON.stringify(stats));



export function msToTime(ms) {
    ms = Math.round(ms); // Round to nearest millisecond
    let minutes = Math.floor(ms / 60000);
    let seconds = Math.floor((ms % 60000) / 1000);
    let milliseconds = ms % 1000;

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    milliseconds = milliseconds < 100 ? (milliseconds < 10 ? "00" + milliseconds : "0" + milliseconds) : milliseconds;

    return `${minutes}:${seconds}.${milliseconds}`;
}



export function updateGraph(path) {
    if (!path || !Array.isArray(path)) return;

    let newlyAddedNodes = [];

    // 1. Update sizes & counts
    path.forEach((item, index) => {
        const nodeId = String(item.id);

        if (graph.hasNode(nodeId)) {
            const currentViewed = graph.getNodeAttribute(nodeId, "viewed") || 1;
            const newViewed = currentViewed + 1;
            graph.setNodeAttribute(nodeId, "viewed", newViewed);
            graph.setNodeAttribute(nodeId, "size", Math.min(40, 8 + newViewed * 3));
        } else {
            const initialViewed = 1;
            const initialSize = 8 + initialViewed * 3;
            
            graph.addNode(nodeId, {
                id: item.id,
                name: item.name,
                label: item.name,
                media_type: item.media_type,
                imagePath: item.imagePath,
                subText: item.subText,
                viewed: initialViewed,
                x: 0,
                y: 0,
                size: initialSize,
                color: determineNodeColor(item.media_type)
            });

            newlyAddedNodes.push({ nodeId, index });
        }
    });

    function determineNodeColor(mediaType) {
      switch (mediaType) {
          case 'movie':
              return "#659157"; 
          case 'tv':
              return "#edae49"; 
          case 'person':
              return "#884e88"; 
          default:
              return "#99AABB";
      }
    }

    const textContainer = document.getElementById('stats-graph-container-text');
    if (textContainer) {
        textContainer.style.display = graph.order === 0 ? 'flex' : 'none';
    }

    // 2. Sequential links
    for (let i = 0; i < path.length - 1; i++) {
        const sourceId = String(path[i].id);
        const targetId = String(path[i + 1].id);

        if (!graph.hasEdge(sourceId, targetId) && !graph.hasEdge(targetId, sourceId)) {
            graph.addEdge(sourceId, targetId, { size: 2, color: "#99AABB" });
        }
    }

    // 3. Find highest visited page (center node)
    let currentCenterNode = null;
    let maxViewed = -1;

    graph.forEachNode((node, attributes) => {
        const viewed = attributes.viewed || 1;
        if (viewed > maxViewed) {
            maxViewed = viewed;
            currentCenterNode = node;
        }
    });

    // 4. Always re-run the full layout on update
    if (currentCenterNode) {
        lastCenterNodeId = currentCenterNode;
        runConcentricLayout(currentCenterNode);
    }

    // If stats tab is already active in the background, refresh canvas rendering directly
    if (sigmaInstance) {
        sigmaInstance.refresh();
    }

    saveGraph();
}

// Mounts the Graphology instance to the container without re-calculating layouts
export function mountStatsGraph(container) {
    if (!container || graph.order === 0) return;

    // Target the specific inner canvas wrapper we created in initStats
    const canvasTarget = container.querySelector('#sigma-canvas-wrapper') || container;

    if (sigmaInstance) {
        sigmaInstance.refresh();
        return;
    }

    sigmaInstance = new Sigma(graph, canvasTarget, {
        renderEdgeLabels: false,
        renderNodeLabels: true,
        allowInvalidContainer: true,
        defaultNodeColor: "#edae49",
        defaultEdgeColor: "#99AABB",
        labelFont: "Graphik, sans-serif",
        labelColor: { color: "#99AABB" },
        labelRenderedSizeThreshold: 4,
        labelDensity: Infinity,
        autoRescale: false,
        defaultDrawNodeLabel: (context, data, settings) => {
            if (!data.label) return;

            const font = settings.labelFont || "sans-serif";
            const fontSize = settings.labelSize || 13;
            const weight = "300";
            const padding = 6; // Gap between node top border and label text

            context.font = `${weight} ${fontSize}px ${font}`;
            context.fillStyle = settings.labelColor?.color || "#f8f8f8";
            context.textAlign = "center";
            context.textBaseline = "bottom";

            // data.x centers horizontally; (data.y - data.size - padding) places it above the node
            context.fillText(
                data.label, 
                data.x, 
                data.y - data.size - padding
            );
        },
        defaultDrawNodeHover: (context, data, settings) => {
            const size = data.size;
            const x = data.x;
            const y = data.y;

            const font = settings.labelFont || "sans-serif";
            const fontSize = settings.labelSize || 13;
            const weight = "300";
            const padding = 6;

            // 1. Draw highlighted node ring & fill
            context.beginPath();
            context.arc(x, y, size + 4, 0, Math.PI * 2, false);
            context.strokeStyle = "#ffffff";
            context.lineWidth = 1.5;
            context.stroke();
            context.closePath();

            context.beginPath();
            context.arc(x, y, size, 0, Math.PI * 2, false);
            context.fillStyle = data.color || settings.defaultNodeColor;
            context.fill();
            context.closePath();

            // Setup label font
            context.font = `${weight} ${fontSize}px ${font}`;
            context.fillStyle = settings.labelColor?.color || "#f8f8f8";
            context.textAlign = "center";
            context.textBaseline = "bottom";

            

            // 2. Draw hovered node label (forced display threshold = 0)
            // if (data.label) {
            //     context.fillText(data.label, x, y - size - padding);
            // }

            // 3. Draw connected neighbor labels (forced display threshold = 0)
            if (hoveredNeighbors && hoveredNeighbors.size > 0 && sigmaInstance) {
                hoveredNeighbors.forEach((neighborId) => {
                    const nData = sigmaInstance.getNodeDisplayData(neighborId);
                    const nLabel = graph.getNodeAttribute(neighborId, "label");
                    if (nData && nLabel) {
                        context.fillText(nLabel, nData.x, nData.y - nData.size - padding);
                    }
                });
            }
        },

        // Dynamic Node Styling in mountStatsGraph
        nodeReducer: (node, data) => {
            const isHovered = hoveredNodes.has(node);
            const isNeighborOfHovered = hoveredNeighbors.has(node);
            
            const isSelected = selectedNodes.has(node);
            const isNeighborOfSelected = selectedNeighbors.has(node);

            // If selected, clear the label entirely and let afterRender draw the custom info box
            if (isSelected) {
                return { 
                    ...data, 
                    label: "",       // Clear the label string so nothing renders by default
                    forceLabel: false, 
                    zIndex: 1
                };
            }

            if (isHovered || isNeighborOfHovered || isNeighborOfSelected) {
                return { 
                    ...data, 
                    forceLabel: true, 
                    zIndex: 1
                };
            }

            if (selectedNodes.size > 0) {
                return {
                    ...data,
                    color: "#2c3844",
                    label: "",
                    zIndex: 0
                };
            }

            if (hoveredNodes.size === 0) return data;

            return {
                ...data,
                color: "#2c3844",
                label: "", 
                zIndex: 0
            };
        },

        // Dynamic Edge Styling
        edgeReducer: (edge, data) => {
            const extremities = graph.extremities(edge);
            const [u, v] = extremities;
            
            const isConnectedToHovered = extremities.some(n => hoveredNodes.has(n));
            const isInternalEdge = selectedNodes.has(u) && selectedNodes.has(v);
            const isConnectedToSelected = extremities.some(n => selectedNodes.has(n));

            if (isConnectedToHovered || isConnectedToSelected) {
                return { 
                    ...data, 
                    color: isInternalEdge ? "#ffcc00" : "#99AABB", 
                    size: isInternalEdge ? 4 : 3, 
                    zIndex: 1 
                };
            }

            if (selectedNodes.size > 0 || hoveredNodes.size > 0) {
                return { ...data, color: "#161c2233", zIndex: 0 };
            }

            return data;
        }
    });

    // Add this right after your `sigmaInstance = new Sigma(...)` block
window.sigmaInstance = sigmaInstance;

sigmaInstance.on("afterRender", () => {
    const canvases = sigmaInstance.getCanvases();
    if (!canvases || !canvases.labels) return;
    
    const context = canvases.labels.getContext("2d");
    if (!context) return;

    const camera = sigmaInstance.getCamera();
    const ratio = camera.getState().ratio;
    const zoomScale = Math.sqrt(ratio);
    const container = sigmaInstance.getContainer();

    // Ensure a wrapper for all popups exists behind the canvas layers
    let popupContainer = document.getElementById("node-info-popups-wrapper");
    if (!popupContainer) {
        popupContainer = document.createElement("div");
        popupContainer.id = "node-info-popups-wrapper";
        popupContainer.style.position = "absolute";
        popupContainer.style.top = "0";
        popupContainer.style.left = "0";
        popupContainer.style.width = "100%";
        popupContainer.style.height = "100%";
        popupContainer.style.pointerEvents = "none";
        popupContainer.style.zIndex = "0";
        container.appendChild(popupContainer);
    }

    // Clear previous frame's popups so they re-position smoothly on pan/zoom
    popupContainer.innerHTML = "";

    // 1. Draw Info Boxes & Selection Rings for all selected nodes
    if (selectedNodes && selectedNodes.size > 0) {
        selectedNodes.forEach((nodeId) => {
            const nData = sigmaInstance.getNodeDisplayData(nodeId);
            const attrs = graph.getNodeAttributes(nodeId);
            if (!nData || !attrs) return;

            const pos = sigmaInstance.graphToViewport({ x: attrs.x, y: attrs.y });
            const radius = (nData.size / zoomScale);

            context.save();
            
            // Draw selection ring on canvas
            context.beginPath();
            context.arc(pos.x, pos.y, radius + 4, 0, Math.PI * 2, false);
            context.strokeStyle = "#ffffff";
            context.lineWidth = 3.5;
            context.stroke();
            context.closePath();
            context.restore();

            // Create individual info box element for this node
            const infoBox = document.createElement("div");
            infoBox.style.position = "absolute";
            infoBox.style.pointerEvents = "none";

            const cardWidth = 240;
            const cardHeight = 96 * 0.75;
            
            // Position centered horizontally, directly above the node
            infoBox.style.left = `${pos.x - (cardWidth / 2)}px`;
            infoBox.style.top = `${pos.y - radius - cardHeight - 24}px`;

            // Extract attributes safely
            const name = attrs.name || attrs.label || "Unknown";
            const subText = `${attrs.media_type || ""}${attrs.subText ? ' • ' + attrs.subText : ''}`;
            const visitCount = attrs.viewed || 0;
            const imageSrc = attrs.imagePath || "";

            // Render HTML Snippet
            infoBox.innerHTML = `
              <div class="media-info-card">
                <div class="thumbnail-container">
                  ${imageSrc ? `<img src="${imageSrc}" alt="Poster" class="media-poster" />` : '<span class="fallback-text">N/A</span>'}
                </div>
                <div class="content-container">
                  <div class="media-title">${name}</div>
                  <div class="media-subtext">${subText.toUpperCase()}</div>
                  <div class="media-stats">Visits: ${visitCount}</div>
                </div>
              </div>

              <style>
                .media-info-card {
                  display: flex;
                  align-items: center;
                  gap: 12px;
                  width: 240px;
                  height: 96px * 0.75;
                  padding: 8px;
                  background-color: #202830;
                  border: 2px solid #99AABB;
                  border-radius: 6px;
                  box-sizing: border-box;
                  font-family: "Graphik", sans-serif;
                }
                .thumbnail-container {
                  flex-shrink: 0;
                  width: calc(56px * 0.75);
                  height: calc(80px * 0.75);
                  border: 1px solid #99AABB;
                  border-radius: 2px;
                  overflow: hidden;
                  background-color: #202830;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
                .media-poster {
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                }
                .fallback-text {
                  color: #99AABB;
                  font-size: 14px;
                  font-weight: 600;
                }
                .content-container {
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  overflow: hidden;
                  gap: 4px;
                  width: calc(100% - 68px);
                }
                .media-title {
                  color: #f8f8f8;
                  font-size: 16px;
                  font-weight: 600;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
                .media-subtext {
                  color: #99AABB;
                  font-size: 13px;
                  font-weight: 400;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
                .media-stats {
                  color: #edae49;
                  font-size: 13px;
                  font-weight: 600;
                }
              </style>
            `;

            popupContainer.appendChild(infoBox);
        });
    }

    // 2. Draw thin border for active search result node
    if (currentSearchNode && graph.hasNode(currentSearchNode)) {
        const nData = sigmaInstance.getNodeDisplayData(currentSearchNode);
        const attrs = graph.getNodeAttributes(currentSearchNode);
        if (nData && attrs) {
            const pos = sigmaInstance.graphToViewport({ x: attrs.x, y: attrs.y });
            const radius = (nData.size / zoomScale);

            context.save();
            context.beginPath();
            context.arc(pos.x, pos.y, radius + 4, 0, Math.PI * 2, false);
            context.strokeStyle = "#ffffff";
            context.lineWidth = 1.5;
            context.stroke();
            context.closePath();
            context.restore();
        }
    }
});

    // Register Hover Event Listeners
        sigmaInstance.on("enterNode", ({ node }) => {
        hoveredNodes.add(node);
        updateHoveredNeighbors();
        sigmaInstance.refresh();
    });

    sigmaInstance.on("leaveNode", ({ node }) => {
        if (node === currentSearchNode) return; // Keeps the search highlight active even when leaving the node
        hoveredNodes.delete(node);
        updateHoveredNeighbors();
        sigmaInstance.refresh();
    });

    sigmaInstance.on("clickNode", ({ node }) => {
      if (selectedNodes.has(node)) {
            selectedNodes.delete(node);
        } else {
            selectedNodes.add(node);
            
            
            
            // Optionally center camera on the newly added node
            // const nodeDisplayData = sigmaInstance.getNodeDisplayData(node);
            // if (nodeDisplayData) {
            //     sigmaInstance.getCamera().animate(
            //         { x: nodeDisplayData.x, y: nodeDisplayData.y, ratio: sigmaInstance.getCamera().getState().ratio },
            //         { duration: 300 }
            //     );
            // }
        }
        updateSelectedNeighbors();
        sigmaInstance.refresh();
    });

    sigmaInstance.on("clickStage", () => {
        if (selectedNodes.size > 0) {
            selectedNodes.clear();
            selectedNeighbors.clear();
            sigmaInstance.refresh();
        }
    });

    let currentSearchNode = null;

    const searchInput = document.getElementById("graph-search-input");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.trim().toLowerCase();
            
            // Remove previous search result from hoveredNodes if it exists
            if (currentSearchNode) {
                hoveredNodes.delete(currentSearchNode);
                currentSearchNode = null;
            }

            if (!query) {
                updateHoveredNeighbors();
                if (sigmaInstance) sigmaInstance.refresh();
                return;
            }

            let foundNodeId = null;
            graph.forEachNode((node, attributes) => {
                const label = (attributes.label || attributes.name || "").toLowerCase();
                if (node.toLowerCase() === query || label === query || label.includes(query)) {
                    foundNodeId = node;
                }
            });

            if (foundNodeId) {
                currentSearchNode = foundNodeId;
                hoveredNodes.add(foundNodeId);

                // Smoothly pan camera to the matching node
                const nodeDisplayData = sigmaInstance.getNodeDisplayData(foundNodeId);
                if (nodeDisplayData) {
                    sigmaInstance.getCamera().animate(
                        { x: nodeDisplayData.x, y: nodeDisplayData.y, ratio: sigmaInstance.getCamera().getState().ratio },
                        { duration: 400 }
                    );
                }
            }
            
            updateHoveredNeighbors();
            if (sigmaInstance) sigmaInstance.refresh();
        });
    }
}

function updateSelectedNeighbors() {
    selectedNeighbors.clear();
    selectedNodes.forEach(node => {
        graph.neighbors(node).forEach(neighbor => {
            if (!selectedNodes.has(neighbor)) {
                selectedNeighbors.add(neighbor);
            }
        });
    });
}

function updateHoveredNeighbors() {
    hoveredNeighbors.clear();
    hoveredNodes.index = 0;
    hoveredNodes.forEach(node => {
        graph.neighbors(node).forEach(n => hoveredNeighbors.add(n));
    });
}

function runConcentricLayout(centerNode) {
    if (!centerNode || !graph.hasNode(centerNode)) return;

    const LAYER_RADIUS = 150; // Increased slightly so outer ring labels have room

    // 1. BFS to determine exact hop depth (layer)
    const depthMap = new Map();
    const layers = new Map();
    const queue = [{ node: centerNode, depth: 0 }];

    depthMap.set(centerNode, 0);
    layers.set(0, [centerNode]);

    while (queue.length > 0) {
        const { node, depth } = queue.shift();
        graph.forEachNeighbor(node, (neighbor) => {
            if (!depthMap.has(neighbor)) {
                const nextDepth = depth + 1;
                depthMap.set(neighbor, nextDepth);
                if (!layers.has(nextDepth)) layers.set(nextDepth, []);
                layers.get(nextDepth).push(neighbor);
                queue.push({ node: neighbor, depth: nextDepth });
            }
        });
    }

    // Catch disconnected nodes (assign to Ring 1)
    graph.forEachNode((node) => {
        if (!depthMap.has(node)) {
            depthMap.set(node, 1);
            if (!layers.has(1)) layers.set(1, []);
            layers.get(1).push(node);
        }
    });

    // 2. Initial angular setup with WEDGE FAN-OUT
    const angles = new Map();
    angles.set(centerNode, 0);

    const sortedDepths = Array.from(layers.keys()).sort((a, b) => a - b);

    sortedDepths.forEach((depth) => {
        if (depth === 0) return;
        const nodes = layers.get(depth);
        const count = nodes.length;

        if (depth === 1) {
            // Space Layer 1 evenly across all 360 degrees
            nodes.forEach((node, index) => {
                angles.set(node, (index / count) * 2 * Math.PI);
            });
        } else {
            // Group nodes by their primary parent target angle
            const nodeTargets = nodes.map((node) => {
                let sumX = 0;
                let sumY = 0;
                let parentCount = 0;

                graph.forEachNeighbor(node, (neighbor) => {
                    if (depthMap.get(neighbor) < depth && angles.has(neighbor)) {
                        const a = angles.get(neighbor);
                        sumX += Math.cos(a);
                        sumY += Math.sin(a);
                        parentCount++;
                    }
                });

                let targetAngle = parentCount > 0 ? Math.atan2(sumY, sumX) : Math.random() * 2 * Math.PI;
                if (targetAngle < 0) targetAngle += 2 * Math.PI;

                return { node, targetAngle };
            });

            // Sort nodes by parent target angle to maintain non-crossing layout order
            nodeTargets.sort((a, b) => a.targetAngle - b.targetAngle);

            // Spread out sorted nodes evenly around the ring so no two start on identical angles
            nodeTargets.forEach((item, index) => {
                const evenAngle = (index / count) * 2 * Math.PI;
                // Blend 80% parent direction + 20% even ring distribution
                let initialAngle = item.targetAngle * 0.8 + evenAngle * 0.2;
                angles.set(item.node, initialAngle);
            });
        }
    });

    // 3. Angular Force Relaxation (Enforce minimum arc spacing on each ring)
    const iterations = 60;
    const ATTRACTION_WEIGHT = 0.08; // Gentle pull toward parent spoke
    const REPULSION_WEIGHT = 0.1;  // Strong push to prevent node overlap on the same ring

    for (let iter = 0; iter < iterations; iter++) {
        sortedDepths.forEach((depth) => {
            if (depth === 0) return;
            const nodes = layers.get(depth);
            const count = nodes.length;

            // Minimum required arc distance between adjacent nodes on this ring
            const minSpacing = (2 * Math.PI) / count;

            nodes.forEach((node) => {
                let force = 0;
                const currentAngle = angles.get(node);

                // Inter-layer attraction: pull toward connected neighbors
                graph.forEachNeighbor(node, (neighbor) => {
                    if (angles.has(neighbor) && neighbor !== centerNode) {
                        let diff = angles.get(neighbor) - currentAngle;
                        diff = Math.atan2(Math.sin(diff), Math.cos(diff)); // Shortest arc [-PI, PI]
                        force += diff * ATTRACTION_WEIGHT;
                    }
                });

                // Intra-layer repulsion: strongly push nodes apart if closer than minSpacing
                nodes.forEach((other) => {
                    if (other !== node) {
                        let diff = angles.get(other) - currentAngle;
                        diff = Math.atan2(Math.sin(diff), Math.cos(diff));

                        if (Math.abs(diff) < minSpacing && Math.abs(diff) > 0.0001) {
                            const pushDirection = diff < 0 ? 1 : -1;
                            const overlapAmount = minSpacing - Math.abs(diff);
                            force += overlapAmount * pushDirection * REPULSION_WEIGHT;
                        }
                    }
                });

                let newAngle = (currentAngle + force + 2 * Math.PI) % (2 * Math.PI);
                angles.set(node, newAngle);
            });
        });
    }

    // 4. Strict Snap to Radial Circles (r = depth * LAYER_RADIUS)
    graph.setNodeAttribute(centerNode, "x", 0);
    graph.setNodeAttribute(centerNode, "y", 0);

    sortedDepths.forEach((depth) => {
        if (depth === 0) return;
        
        const exactRadius = depth * LAYER_RADIUS;
        const nodes = layers.get(depth);

        nodes.forEach((node) => {
            const theta = angles.get(node);
            graph.setNodeAttribute(node, "x", exactRadius * Math.cos(theta));
            graph.setNodeAttribute(node, "y", exactRadius * Math.sin(theta));
        });
    });
}


// Save current graph state to localStorage
export function saveGraph() {
    try {
        const exportedData = graph.export();
        localStorage.setItem('graphData', JSON.stringify(exportedData));
    } catch (e) {
        console.error("Failed to save graph to localStorage:", e);
    }
}

// Load saved graph state from localStorage on startup
export function loadGraph() {
    const savedGraph = localStorage.getItem('graphData');
    if (savedGraph) {
        try {
            graph.clear(); // Ensure clean slate before importing
            graph.import(JSON.parse(savedGraph));
        } catch (e) {
            console.error("Failed to parse stored graph data:", e);
        }
    }
}

// Immediately load stored graph data when script runs
loadGraph();












// At the bottom of shared.js
window.fetchDetails = fetchDetails;
window.executeSearch = executeSearch;
window.resolveInputData = resolveInputData;
window.start = start;
window.stop = stop;
window.reset = reset;
window.updateDisplay = updateDisplay;
window.switchView = switchView;
window.showInputError = showInputError;
window.playSoundEffect = playSoundEffect;
window.msToTime = msToTime;
window.updateGraph = updateGraph;
window.mountStatsGraph = mountStatsGraph;
window.saveGraph = saveGraph;
window.loadGraph = loadGraph;


window.TMDB_API_KEY = TMDB_API_KEY;
window.BASE_URL = BASE_URL;
window.BANNED_MCU = BANNED_MCU;
window.BANNED_BIG_3 = BANNED_BIG_3;
window.graph = graph;

window.debounceTimer = debounceTimer;
window.searchResults = searchResults;
window.inputData = inputData;
window.gamemodes = gamemodes;
window.currentMode = currentMode;
window.currentStartData = currentStartData;
window.currentGoalData = currentGoalData;
window.startTime = startTime;
window.tInterval = tInterval;
window.difference = difference;
window.updatedTime = updatedTime;
window.gamemodes = gamemodes;



