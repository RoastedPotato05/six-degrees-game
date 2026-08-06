// settings.js

let listenersAttached = false;

export function initSettings() {
    const masterVolume = document.getElementById('master-volume');
    const sfxVolume = document.getElementById('sfx-volume');
    const musicVolume = document.getElementById('music-volume');

    // Set slider values from localStorage or defaults
    if (masterVolume) {
        masterVolume.value = localStorage.getItem('masterVolume') !== null ? localStorage.getItem('masterVolume') : 0;
    }
    if (sfxVolume) {
        sfxVolume.value = localStorage.getItem('sfxVolume') !== null ? localStorage.getItem('sfxVolume') : 0.50;
    }
    if (musicVolume) {
        musicVolume.value = localStorage.getItem('musicVolume') !== null ? localStorage.getItem('musicVolume') : 0.50;
    }

    // Load saved checkbox states from localStorage (Only actual checkboxes here)
    const checkboxIds = ['target-name-only', 'no-mcu', 'no-big-3'];
    checkboxIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            const savedVal = localStorage.getItem(id);
            if (savedVal !== null) {
                el.checked = savedVal === 'true';
            }
        }
    });

    // Attach event listeners safely once elements are guaranteed to be active in the DOM
    if (!listenersAttached) {
        if (masterVolume) masterVolume.addEventListener('input', updateVolumeSettings);
        if (musicVolume) musicVolume.addEventListener('input', updateVolumeSettings);
        if (sfxVolume) sfxVolume.addEventListener('input', updateVolumeSettings);

        // Banned items search listeners
        const bannedItemSearch = document.getElementById('banned-item-search');
        if (bannedItemSearch) {
            bannedItemSearch.addEventListener('input', (e) => {
                clearTimeout(window.debounceTimer);
                window.debounceTimer = setTimeout(() => window.executeSearch(e.target), 500);
            });

            bannedItemSearch.addEventListener('focus', (e) => {
                if (e.target.value.trim()) {
                    window.executeSearch(e.target);
                }
            });
        }

        // Generic change listeners for checkboxes to save state
        checkboxIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('change', saveCheckboxStates);
            }
        });

        listenersAttached = true;
    }

    renderBannedItems();
    updateButtonStyles(); // Ensure toggle button styles match localStorage on load
}
window.initSettings = initSettings;

const saveCheckboxStates = () => {
    const checkboxIds = ['target-name-only', 'no-mcu', 'no-big-3'];
    checkboxIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            localStorage.setItem(id, el.checked);
        }
    });
};

const updateVolumeSettings = () => {
    const masterVolume = document.getElementById('master-volume');
    const sfxVolume = document.getElementById('sfx-volume');
    const musicVolume = document.getElementById('music-volume');

    const masterVal = masterVolume ? parseFloat(masterVolume.value) : 0;
    const musicVal = musicVolume ? parseFloat(musicVolume.value) : 0.50;
    const sfxVal = sfxVolume ? parseFloat(sfxVolume.value) : 0.50;

    // Save preferences to localStorage
    localStorage.setItem('masterVolume', masterVal);
    localStorage.setItem('musicVolume', musicVal);
    localStorage.setItem('sfxVolume', sfxVal);

    // Dynamically scale and apply to background music
    if (window.bgMusic) {
        window.bgMusic.volume = Math.min(1, Math.max(0, musicVal * masterVal));
    }
};

// Bind return button listener
const settingsReturnBtn = document.getElementById('settings-return-btn');
if (settingsReturnBtn) {
    settingsReturnBtn.addEventListener('click', () => {
        window.switchView('view-home');
    });
}

export function renderBannedItems() {
    const bannedItemContainer = document.getElementById('banned-item-container');
    if (!bannedItemContainer) return;

    let bannedItems = JSON.parse(localStorage.getItem('bannedItems') || '[]');

    if (bannedItems.length === 0) {
        bannedItemContainer.innerHTML = `
            <div id="banned-item-container-text" style="font-family: 'Graphik', sans-serif; font-weight: 400; font-size: 18px; color: #99AABB; justify-content: center; align-items: center; display: flex; height: 100%; box-sizing: border-box;">
                <span>Banned items will appear here</span>
            </div>
        `;
        return;
    }

    bannedItemContainer.innerHTML = '';
    bannedItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'search-result-item';
        itemDiv.style.display = 'flex';
        itemDiv.style.alignItems = 'center';
        itemDiv.style.justifyContent = 'space-between';
        itemDiv.style.padding = '8px';
        itemDiv.style.cursor = 'pointer';
        itemDiv.style.borderBottom = '4px solid #161c22';

        const imgHtml = item.imagePath 
            ? `<img src="https://image.tmdb.org/t/p/w92${item.imagePath}" style="width: 56px; height: 80px; object-fit: cover; border-radius: 2px; margin-right: 10px;" />` 
            : `<div style="width: 56px; height: 80px; background: #161c22; border-radius: 2px; margin-right: 10px; display: flex; align-items: center; justify-content: center; font-size: 16px; color: #99AABB;">N/A</div>`;

        itemDiv.innerHTML = `
            <div style="display: flex; align-items: center; overflow: hidden;">
                ${imgHtml}
                <div style="overflow: hidden;">
                    <div style="font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #f8f8f8; font-size: 20px;">${item.name}</div>
                    <div style="font-size: 16px; color: #99AABB;">${item.subText}</div>
                </div>
            </div>
            <span class="search-result-type" style="font-size: 16px">${item.media_type}</span>
        `;

        itemDiv.addEventListener('click', () => {
            let currentBanned = JSON.parse(localStorage.getItem('bannedItems') || '[]');
            currentBanned = currentBanned.filter(i => !(i.id === item.id && i.media_type === item.media_type));
            localStorage.setItem('bannedItems', JSON.stringify(currentBanned));
            renderBannedItems();
        });

        bannedItemContainer.appendChild(itemDiv);
    });
}
window.renderBannedItems = renderBannedItems;

// --- Custom Toggle Buttons for Media Filter (No TV / No Movies) ---
const btnNoTV = document.getElementById('toggle-no-tv');
const btnNoMovies = document.getElementById('toggle-no-movies');

let currentSetting = localStorage.getItem('mediaFilter') || 'none'; // 'none', 'no-tv', 'no-movies'

function updateButtonStyles() {
    if (!btnNoTV || !btnNoMovies) return;
    
    btnNoTV.classList.remove('custom-toggle-active');
    btnNoMovies.classList.remove('custom-toggle-active');

    if (currentSetting === 'no-tv') {
        btnNoTV.classList.add('custom-toggle-active');
    } else if (currentSetting === 'no-movies') {
        btnNoMovies.classList.add('custom-toggle-active');
    }
}

if (btnNoTV && btnNoMovies) {
    updateButtonStyles();

    btnNoTV.addEventListener('click', () => {
        currentSetting = (currentSetting === 'no-tv') ? 'none' : 'no-tv';
        localStorage.setItem('mediaFilter', currentSetting);
        updateButtonStyles();
    });

    btnNoMovies.addEventListener('click', () => {
        currentSetting = (currentSetting === 'no-movies') ? 'none' : 'no-movies';
        localStorage.setItem('mediaFilter', currentSetting);
        updateButtonStyles();
    });
}