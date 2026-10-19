// settings.js

let listenersAttached = false;
const getSettingElements = (id) => Array.from(document.querySelectorAll(`#${id}, #${id}-mobile`));
const getFirstVisibleSettingElement = (id) => getSettingElements(id).find((element) => element.offsetParent !== null) || getSettingElements(id)[0];

export function initSettings() {
    window.initializingSettings = true;
    // Set slider values from localStorage or defaults
    [['master-volume', 0], ['sfx-volume', 0.50], ['music-volume', 0.50]].forEach((setting) => {
        const id = setting[0];
        const fallback = setting[1];
        getSettingElements(id).forEach((element) => {
            element.value = localStorage.getItem(id) !== null ? localStorage.getItem(id) : fallback;
        });
    });

    // Load saved checkbox states from localStorage (Only actual checkboxes here)
    const checkboxIds = ['target-name-only', 'no-mcu', 'no-big-3'];
    checkboxIds.forEach(id => {
        getSettingElements(id).forEach((el) => {
            const savedVal = localStorage.getItem(id);
            if (savedVal !== null) {
                el.checked = savedVal === 'true';
            }
        });
    });

    // Attach event listeners safely once elements are guaranteed to be active in the DOM
    if (!listenersAttached) {
        ['master-volume', 'music-volume', 'sfx-volume'].forEach((id) => {
            getSettingElements(id).forEach((element) => element.addEventListener('input', updateVolumeSettings));
        });

        // Banned items search listeners
        getSettingElements('banned-item-search').forEach((bannedItemSearch) => {
            bannedItemSearch.addEventListener('input', (e) => {
                clearTimeout(window.debounceTimer);
                window.debounceTimer = setTimeout(() => window.executeSearch(e.target), 500);
            });

            bannedItemSearch.addEventListener('focus', (e) => {
                if (e.target.value.trim()) {
                    window.executeSearch(e.target);
                }
            });
        });

        // Generic change listeners for checkboxes to save state
        checkboxIds.forEach(id => {
            getSettingElements(id).forEach((el) => el.addEventListener('change', saveCheckboxStates));
        });

        listenersAttached = true;
    }

    renderBannedItems();
    updateButtonStyles(); // Ensure toggle button styles match localStorage on load
    window.initializingSettings = false;
}
window.initSettings = initSettings;

const saveCheckboxStates = () => {
    const checkboxIds = ['target-name-only', 'no-mcu', 'no-big-3'];
    checkboxIds.forEach(id => {
        const el = getFirstVisibleSettingElement(id);
        if (el) {
            localStorage.setItem(id, el.checked);
            getSettingElements(id).forEach((other) => { other.checked = el.checked; });
        }
    });
};

const updateVolumeSettings = () => {
    if (window.updatingVolumeSettings) return;
    window.updatingVolumeSettings = true;
    const masterVolume = getFirstVisibleSettingElement('master-volume');
    const sfxVolume = getFirstVisibleSettingElement('sfx-volume');
    const musicVolume = getFirstVisibleSettingElement('music-volume');

    const masterVal = masterVolume ? parseFloat(masterVolume.value) : 0;
    const musicVal = musicVolume ? parseFloat(musicVolume.value) : 0.50;
    const sfxVal = sfxVolume ? parseFloat(sfxVolume.value) : 0.50;

    // Save preferences to localStorage
    localStorage.setItem('masterVolume', masterVal);
    localStorage.setItem('musicVolume', musicVal);
    localStorage.setItem('sfxVolume', sfxVal);
    [['master-volume', masterVal], ['music-volume', musicVal], ['sfx-volume', sfxVal]].forEach((setting) => {
        const id = setting[0];
        const value = setting[1];
        getSettingElements(id).forEach((element) => { element.value = value; });
    });

    // Dynamically scale and apply to background music
    if (window.bgMusic) {
        window.bgMusic.volume = Math.min(1, Math.max(0, musicVal * masterVal));
    }
    window.updatingVolumeSettings = false;
};

// Bind return button listener
const settingsReturnBtn = document.getElementById('settings-return-btn');
if (settingsReturnBtn) {
    settingsReturnBtn.addEventListener('click', () => {
        window.switchView('view-home');
    });
}

export function renderBannedItems() {
    let bannedItems = JSON.parse(localStorage.getItem('bannedItems') || '[]');
    getSettingElements('banned-item-container').forEach((bannedItemContainer) => {
        if (bannedItems.length === 0) {
            bannedItemContainer.innerHTML = '<div style="font-family: Graphik, sans-serif; font-size: 18px; color: #99AABB; display: flex; justify-content: center; align-items: center; height: 100%; min-height: 180px;">Banned items will appear here</div>';
            return;
        }

        bannedItemContainer.innerHTML = '';
        bannedItems.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'search-result-item';
            itemDiv.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:8px;cursor:pointer;border-bottom:4px solid #161c22;';
            const imgHtml = item.imagePath
                ? `<img src="https://image.tmdb.org/t/p/w92${item.imagePath}" style="width:56px;height:80px;object-fit:cover;border-radius:2px;margin-right:10px;" />`
                : '<div style="width:56px;height:80px;background:#161c22;border-radius:2px;margin-right:10px;display:flex;align-items:center;justify-content:center;color:#99AABB;">N/A</div>';
            itemDiv.innerHTML = `<div style="display:flex;align-items:center;overflow:hidden;">${imgHtml}<div style="overflow:hidden;"><div style="font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#f8f8f8;font-size:20px;">${item.name}</div><div style="font-size:16px;color:#99AABB;">${item.subText}</div></div></div><span class="search-result-type" style="font-size:16px">${item.media_type}</span>`;
            itemDiv.addEventListener('click', () => {
                const currentBanned = JSON.parse(localStorage.getItem('bannedItems') || '[]').filter(i => !(i.id === item.id && i.media_type === item.media_type));
                localStorage.setItem('bannedItems', JSON.stringify(currentBanned));
                renderBannedItems();
            });
            bannedItemContainer.appendChild(itemDiv);
        });
    });
}
window.renderBannedItems = renderBannedItems;

// --- Custom Toggle Buttons for Media Filter (No TV / No Movies) ---
let currentSetting = localStorage.getItem('mediaFilter') || 'none'; // 'none', 'no-tv', 'no-movies'

function updateButtonStyles() {
    const btnNoTV = getSettingElements('toggle-no-tv');
    const btnNoMovies = getSettingElements('toggle-no-movies');
    btnNoTV.forEach((button) => button.classList.remove('custom-toggle-active'));
    btnNoMovies.forEach((button) => button.classList.remove('custom-toggle-active'));

    if (currentSetting === 'no-tv') {
        btnNoTV.forEach((button) => button.classList.add('custom-toggle-active'));
    } else if (currentSetting === 'no-movies') {
        btnNoMovies.forEach((button) => button.classList.add('custom-toggle-active'));
    }
}

if (getSettingElements('toggle-no-tv').length && getSettingElements('toggle-no-movies').length) {
    updateButtonStyles();

    getSettingElements('toggle-no-tv').forEach((button) => {
        button.addEventListener('click', () => {
            currentSetting = (currentSetting === 'no-tv') ? 'none' : 'no-tv';
            localStorage.setItem('mediaFilter', currentSetting);
            updateButtonStyles();
        });
    });

    getSettingElements('toggle-no-movies').forEach((button) => {
        button.addEventListener('click', () => {
            currentSetting = (currentSetting === 'no-movies') ? 'none' : 'no-movies';
            localStorage.setItem('mediaFilter', currentSetting);
            updateButtonStyles();
        });
    });
}

const exportDataBtns = getSettingElements('export-data-btn');
const importDataBtns = getSettingElements('import-data-btn');
const importPopup = document.getElementById('import-popup');
const importExitBtn = document.getElementById('import-exit');
const importCancelBtn = document.getElementById('import-cancel-btn');
const importLoadBtn = document.getElementById('import-load-btn');
const importDataInput = document.getElementById('import-data-input');
const overlay = document.getElementById('overlay');

function closeImportPopup() {
    if (importPopup) importPopup.style.display = 'none';
    if (overlay) overlay.style.display = 'none';
    if (importDataInput) importDataInput.value = '';
}

function showImportError(message) {
    let error = document.getElementById('import-error');
    if (!error) {
        error = document.createElement('div');
        error.id = 'import-error';
        error.style.cssText = 'margin-top: 10px; color: #edae49; font-size: 15px; font-weight: 600; text-align: center;';
        importDataInput.parentElement.insertBefore(error, importDataInput.nextSibling);
    }
    error.textContent = message;
}

importDataBtns.forEach((importDataBtn) => {
    importDataBtn.addEventListener('click', () => {
        if (importPopup) importPopup.style.display = 'block';
        if (overlay) overlay.style.display = 'block';
        if (importDataInput) importDataInput.focus();
    });
});

[importExitBtn, importCancelBtn].forEach((button) => {
    if (button) button.addEventListener('click', closeImportPopup);
});

exportDataBtns.forEach((exportDataBtn) => {
    exportDataBtn.addEventListener('click', async () => {
        exportDataBtn.style.boxShadow = 'inset 0 0 0 2px #edae49';
        let message = document.getElementById('export-data-msg');
        if (!message) {
            message = document.createElement('div');
            message.id = 'export-data-msg';
            message.style.cssText = 'position: absolute; color: #edae49; background-color: #161c22; border: 2px solid #edae49; border-radius: 6px; padding: 6px 10px; font-family: Graphik, sans-serif; font-size: 13px; font-weight: 600; text-align: center; white-space: pre-line; z-index: 9999; pointer-events: none; left: 50%; bottom: calc(100% + 10px); transform: translateX(-50%);';
        }

        const messageContainer = exportDataBtn.parentElement;
        if (messageContainer) {
            if (getComputedStyle(messageContainer).position === 'static') {
                messageContainer.style.position = 'relative';
            }
            messageContainer.appendChild(message);
        }

        try {
            if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') {
                throw new Error('Clipboard access is not available in this browser.');
            }
            const saveCode = await window.createSaveCode();
            await navigator.clipboard.writeText(saveCode);
            message.textContent = 'Code copied to clipboard!';
        } catch (error) {
            message.textContent = error.message || 'Could not export data.';
        }

        clearTimeout(exportDataBtn.exportTimeout);
        exportDataBtn.exportTimeout = setTimeout(() => {
            exportDataBtn.style.boxShadow = '';
            if (message) message.remove();
        }, 4000);
    });
});

if (importLoadBtn) {
    importLoadBtn.addEventListener('click', async () => {
        const saveCode = importDataInput ? importDataInput.value.trim() : '';
        if (!saveCode) {
            showImportError('Paste a save code before loading data.');
            return;
        }

        const loadingOverlay = document.getElementById('loading-overlay');
        const loadingMessage = loadingOverlay ? loadingOverlay.querySelector('span:last-child') : null;
        if (loadingOverlay) loadingOverlay.style.display = 'flex';
        if (loadingMessage) loadingMessage.textContent = 'Importing local data...';
        showImportError('');

        try {
            await window.importSaveCode(saveCode);
            window.location.reload();
        } catch (error) {
            if (loadingOverlay) loadingOverlay.style.display = 'none';
            showImportError(error.message || 'Could not import save data.');
        }
    });
}