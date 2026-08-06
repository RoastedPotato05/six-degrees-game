const currentTitle = document.getElementById('current-title');
const currentPoster = document.getElementById('current-poster');
const castDepartments = document.getElementById('cast/departments');
const nameMovieList = document.getElementById('name/movie-list');
const pathContainer = document.getElementById('path-container');
const targetPoster = document.getElementById('target-poster');
const targetName = document.getElementById('target-name');
const targetInfo = document.getElementById('target-info');
const itemSearch = document.getElementById('item-search');
const timerReturnBtn = document.getElementById('timer-return-btn');

// Ensure list container maintains the wrap layout and scrolling properties
nameMovieList.style.display = 'flex';
nameMovieList.style.flexDirection = 'row';
nameMovieList.style.flexWrap = 'wrap';
nameMovieList.style.gap = '8px';
nameMovieList.style.flex = '1';
nameMovieList.style.minHeight = '0';
nameMovieList.style.overflowY = 'auto';

let path = [];
let startData;
let goalData;

export async function initStandard(startDataParam, goalDataParam) {
    path = [];
    if (window.reset) window.reset();
    if (window.start) window.start();
    if (pathContainer) pathContainer.innerHTML = '';
    if (timerReturnBtn) timerReturnBtn.style.display = 'block';

    startData = startDataParam;
    goalData = goalDataParam;

    if (!goalData) {
        const urlParams = new URLSearchParams(window.location.search);
        const goalParam = urlParams.get('goal');
        const goalDataArray = goalParam ? goalParam.split(',') : [];
        if (goalDataArray.length === 2) {
            goalData = await window.fetchDetails(goalDataArray[0], goalDataArray[1]);
        }
    }

    if (!startData) {
        const urlParams = new URLSearchParams(window.location.search);
        const startParam = urlParams.get('start');
        const startDataArray = startParam ? startParam.split(',') : [];
        if (startDataArray.length === 2) {
            startData = await window.fetchDetails(startDataArray[0], startDataArray[1]);
        }
    }

    if (goalData) {
        // Render the target poster
        const targetPosterPath = goalData.poster_path || goalData.profile_path;
        if (targetPosterPath) {
            if (goalData.imageUrl) {
                targetPoster.innerHTML = `<img src="${goalData.imageUrl}" style="width: 60%; height: auto; aspect-ratio: 56 / 80; object-fit: cover; align-self: flex-start; border-radius: 2px;">`;
            } else {
                targetPoster.innerHTML = `<img src="https://image.tmdb.org/t/p/w500${targetPosterPath}" style="width: 60%; height: auto; aspect-ratio: 56 / 80; object-fit: cover; align-self: flex-start; border-radius: 2px;">`;
            }
        } else {
            targetPoster.innerHTML = `<svg viewBox="0 0 56 80" style="width: 60%; height: auto; align-self: flex-start; border-radius: 2px;">
                <rect width="56" height="80" fill="#2c3844" rx="2"></rect>
                <text x="28" y="43" dominant-baseline="middle" text-anchor="middle" fill="#99AABB" font-family="'Graphik', sans-serif" font-weight="600" font-size="16">N/A</text>
            </svg>`;
        }

        // Render the target name
        targetName.innerText = goalData.title || goalData.name;

        // Render the target info
        const goalType = goalData.media_type;
        if (goalType === 'movie') {
            const directors = (goalData.credits?.crew || []).filter(c => c.job === 'Director').map(c => c.name);
            const topCast = (goalData.credits?.cast || []).slice(0, 3).map(c => c.name);

            const directorsHtml = directors.map(d => `<span style="display: block; line-height: 1.2; margin-bottom: 16px; color: #884e88; font-family: 'Graphik', sans-serif; font-weight: 400; font-size: 20px; text-align: right;">${d}</span>`).join('');
            const topCastHtml = topCast.map(c => `<span style="display: block; line-height: 1.2; margin-bottom: 16px; color: #884e88; font-family: 'Graphik', sans-serif; font-weight: 400; font-size: 20px; text-align: right;">${c}</span>`).join('');

            targetInfo.style.border = 'none';
            targetInfo.style.padding = 0;
            targetInfo.innerHTML = `
                <div style="border: 2px solid #99AABB; padding: 10px;">
                    ${directorsHtml}
                    <span style="display: block; font-family: 'Graphik', sans-serif; font-weight: 400; font-size: 12px; margin-top: -10px; text-align: right;" class="text-gray">DIRECTOR(S)</span>
                </div>
                <div style="border: 2px solid #99AABB; padding: 10px; margin-top: 20px;">
                    ${topCastHtml}
                    <span style="display: block; font-family: 'Graphik', sans-serif; font-weight: 400; font-size: 12px; margin-top: -10px; text-align: right;" class="text-gray">CAST</span>
                </div>
            `;
        } else if (goalType === 'tv') {
            const topCast = (goalData.credits?.cast || []).slice(0, 5).map(c => c.name);
            const topCastHtml = topCast.map(c => `<span style="display: block; line-height: 1.2; margin-bottom: 16px; color: #884e88; font-family: 'Graphik', sans-serif; font-weight: 400; font-size: 22px; text-align: right;">${c}</span>`).join('');

            targetInfo.innerHTML = `
                <div style="border: 2px solid #99AABB; padding: 10px;">
                    ${topCastHtml}
                    <span style="display: block; font-family: 'Graphik', sans-serif; font-weight: 400; font-size: 16px; margin-top: -10px; text-align: right;" class="text-gray">CAST</span>
                </div>
            `;
        } else if (goalType === 'person') {
            const dept = goalData.known_for_department || '';
            let rawItems = [];
            if (dept.toLowerCase() === 'acting') {
                rawItems = goalData.credits?.cast || [];
            } else {
                rawItems = (goalData.credits?.crew || [])
                    .filter(c => c.department && c.department.toLowerCase() === dept.toLowerCase());
            }
            
            rawItems.sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0));
            const topItems = rawItems.slice(0, 5).map(c => c.title || c.name);
            const topItemsHtml = topItems.map(i => `<span style="display: block; line-height: 1.2; margin-bottom: 16px; color: #884e88; font-family: 'Graphik', sans-serif; font-weight: 400; font-size: 22px; text-align: right;">${i}</span>`).join('');

            targetInfo.innerHTML = `
                <div style="border: 2px solid #99AABB; padding: 10px;">
                    ${topItemsHtml}
                    <span style="display: block; font-family: 'Graphik', sans-serif; font-weight: 400; font-size: 16px; margin-top: -10px; text-align: right;" class="text-gray">KNOWN FOR ${dept.toUpperCase()}</span>
                </div>
            `;
        }
    }

    if (startData) {
        await loadStep(startData.id, startData.media_type);
    }
}
window.initStandard = initStandard;




let currentDisplayItems = [];
let currentIsPersonTarget = false;
let currentIsCrewGrouped = false;

// Active search input listener
if (itemSearch) {
    itemSearch.addEventListener('input', () => {
        applySearchFilter();
    });
}

function applySearchFilter() {
    if (!itemSearch) return;
    const query = itemSearch.value.toLowerCase().trim();

    if (currentIsCrewGrouped) {
        const groupElements = nameMovieList.querySelectorAll('.crew-group-container');
        groupElements.forEach(groupEl => {
            const memberButtons = groupEl.querySelectorAll('.item-btn');
            let hasVisibleMember = false;

            memberButtons.forEach(btn => {
                const text = btn.innerText.toLowerCase();
                if (text.includes(query)) {
                    btn.style.display = '';
                    hasVisibleMember = true;
                } else {
                    btn.style.display = 'none';
                }
            });

            groupEl.style.display = hasVisibleMember ? '' : 'none';
        });
    } else {
        const itemButtons = nameMovieList.querySelectorAll('.item-btn');
        itemButtons.forEach((btn, index) => {
            const item = currentDisplayItems[index];
            if (!item) return;

            const searchableText = currentIsPersonTarget 
                ? (item.name || '').toLowerCase() 
                : (item.title || item.name || '').toLowerCase();

            if (searchableText.includes(query)) {
                btn.style.display = '';
            } else {
                btn.style.display = 'none';
            }
        });
    }
}


async function loadStep(id, type) {                         // function for updating after new item is clicked

    window.playSoundEffect('vine_boom.mp3');

    const data = await window.fetchDetails(id, type);
    // console.log("Loaded Step Data:", data);

    // --- 1. Render Poster ---
    const posterPath = data.poster_path || data.profile_path;
    if (data.imageUrl) {
        currentPoster.innerHTML = `<img src="${data.imageUrl}" style="width: 100%; height: auto; aspect-ratio: 56 / 80; object-fit: cover; align-self: flex-start; border-radius: 2px;">`;
    }
    else if (posterPath) {
        currentPoster.innerHTML = `<img src="https://image.tmdb.org/t/p/w500${posterPath}" style="width: 100%; height: auto; aspect-ratio: 56 / 80; object-fit: cover; align-self: flex-start; border-radius: 2px;">`;
    } else {
        currentPoster.innerHTML = `<svg viewBox="0 0 56 80" style="width: 100%; height: auto; align-self: flex-start; border-radius: 2px;">
            <rect width="56" height="80" fill="#2c3844" rx="2"></rect>
            <text x="28" y="43" dominant-baseline="middle" text-anchor="middle" fill="#99AABB" font-family="'Graphik', sans-serif" font-weight="600" font-size="16">N/A</text>
        </svg>`;
    }

    // --- 2. Render Title / Name ---
    currentTitle.innerText = data.title || data.name;

    // --- 3. Render Cast / Departments UI (Separated into Header Container and List Container) ---
    castDepartments.innerHTML = '';
    nameMovieList.innerHTML = '';

    const tabsContainer = document.createElement('div');
    tabsContainer.style.display = 'flex';
    tabsContainer.style.gap = '0px';
    tabsContainer.style.flexWrap = 'wrap';

    castDepartments.appendChild(tabsContainer);

    let name = '';
    let imagePath = null;
    let subText = '';

    document.getElementById('item-search').value = '';

    if (data.media_type === 'movie') {
        name = data.title || data.original_title;
        if (data.imageUrl) {
            imagePath = data.imageUrl;
        } else {
            if (data.poster_path) {
                imagePath = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
            }
            else {
                imagePath = null;
            }
        }
        subText = data.release_date ? data.release_date.split('-')[0] : '';
    } else if (data.media_type === 'tv') {
        name = data.name || data.original_name;
        if (data.imageUrl) {
            imagePath = data.imageUrl;
        } else {
            if (data.poster_path) {
                imagePath = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
            } else {
                imagePath = null;
            }
        }
        subText = data.first_air_date ? data.first_air_date.split('-')[0] : '';
    } else if (data.media_type === 'person') {
        name = data.name;
        if (data.imageUrl) {
            imagePath = data.imageUrl;
        } else {
            if (data.profile_path) {
                imagePath = `https://image.tmdb.org/t/p/w500${data.profile_path}`;
            } else {
                imagePath = null;
            }
        }
        subText = '';
    }

    const newItem = { 
        id: data.id, 
        media_type: data.media_type,
        name: name,
        imagePath: imagePath,
        subText: subText
    };

    if (path.some(item => item.id === newItem.id && item.media_type === newItem.media_type)) {
        const index = path.findIndex(item => item.id === newItem.id && item.media_type === newItem.media_type);
        path = path.slice(0, index + 1);
    } else {
        path.push(newItem);
    }

    pathContainer.innerHTML = '';
    pathContainer.style.display = 'flex';
    pathContainer.style.flexDirection = 'column';
    pathContainer.style.alignItems = 'center';
    pathContainer.style.width = '100%';
    pathContainer.style.boxSizing = 'border-box';
    pathContainer.style.gap = '6px';

    path.forEach((pathItem, idx) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'path-item';
        

        const imgHtml = pathItem.imagePath 
            ? `<img src="${pathItem.imagePath}" style="width: 56px; height: 80px; object-fit: cover; border-radius: 2px; margin-right: 10px;" />` 
            : `<div style="width: 56px; height: 80px; background: #2c3844; border-radius: 2px; margin-right: 10px; display: flex; align-items: center; justify-content: center; font-size: 16px; color: #99AABB;">N/A</div>`;

        itemDiv.innerHTML = `
            <div style="display: flex; align-items: center; overflow: hidden;">
                ${imgHtml}
                <div style="overflow: hidden;">
                    <div style="font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #f8f8f8; font-size: 22px;">${pathItem.name}</div>
                    <div style="font-size: 16px; font-weight: 400; color: #99AABB;">${pathItem.subText}</div>
                </div>
            </div>
            <span class="search-result-type" style="font-size: 16px; font-weight: 400;">${pathItem.media_type}</span>
        `;

        itemDiv.addEventListener('click', () => {
            loadStep(pathItem.id, pathItem.media_type);
        });

        pathContainer.appendChild(itemDiv);

        if (idx < path.length - 1) {
            const arrow = document.createElement('div');
            arrow.innerHTML = '↓';
            arrow.style.color = '#99AABB';
            arrow.style.fontSize = '20px';
            arrow.style.margin = '2px 0';
            arrow.style.textAlign = 'center';
            pathContainer.appendChild(arrow);
        }
    });


    const renderTabContent = (items, isPersonTarget = false) => {
        nameMovieList.innerHTML = '';
        nameMovieList.scrollTop = 0;



        let  bannedItems = JSON.parse(localStorage.getItem('bannedItems') || '[]');

        if (localStorage.getItem('no-mcu') === 'true' && typeof BANNED_MCU !== 'undefined') {
            bannedItems = bannedItems.concat(BANNED_MCU);
        }

        if (localStorage.getItem('no-big-3') === 'true' && typeof BANNED_BIG_3 !== 'undefined') {
            bannedItems = bannedItems.concat(BANNED_BIG_3);
        }


        const mediaFilter = localStorage.getItem('mediaFilter') || 'none';

        items = items.filter(item => {
            const itemType = isPersonTarget ? 'person' : (item.media_type || 'movie');
            
            // Check specific ban lists
            if (bannedItems.some(b => b.id === item.id && b.media_type === itemType)) {
                return false;
            }

            // Check broad media filters
            if (mediaFilter === 'no-tv' && itemType === 'tv') {
                return false;
            }
            if (mediaFilter === 'no-movies' && itemType === 'movie') {
                return false;
            }

            return true;
        });


        
        currentDisplayItems = items;
        currentIsPersonTarget = isPersonTarget;
        currentIsCrewGrouped = false;

        items.forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'item-btn';
            
            if (isPersonTarget) {
                btn.innerText = item.name || '';
                btn.style.padding = '6px 10px';
                btn.style.cursor = 'pointer';
                btn.style.color = '#99AABB';
                btn.style.backgroundColor = '#303943';
                btn.style.borderRadius = '3px';
                btn.style.border = 'none';
                btn.style.fontFamily = "'Graphik', sans-serif";
                btn.style.fontWeight = '400';
                btn.style.fontSize = '16px';
            } else {
                const itemPosterPath = item.poster_path;
                const itemName = item.title || item.name || '';
                btn.title = itemName;
                
                if (itemPosterPath) {
                    if (item.imageUrl) {
                        btn.innerHTML = `<img src="${item.imageUrl}" style="width: 100%; height: 100%; object-fit: cover;">`;
                    } else {
                        btn.innerHTML = `<img src="https://image.tmdb.org/t/p/w500${itemPosterPath}" style="width: 100%; height: 100%; object-fit: cover;">`;
                    }
                } else {
                    btn.innerHTML = `<div style="width: 100%; height: 100%; background: #2c3844; display: flex; align-items: center; justify-content: center; padding: 6px; box-sizing: border-box; text-align: center; color: #99AABB; font-family: 'Graphik', sans-serif; font-weight: 600; font-size: 10px; word-break: break-word; overflow: hidden;">${itemName || 'N/A'}</div>`;
                }
                btn.style.width = '100px';
                btn.style.aspectRatio = '56 / 80';
                btn.style.padding = '0';
                btn.style.overflow = 'hidden';
                btn.style.display = 'flex';
                btn.style.cursor = 'pointer';
                btn.style.border = '2px solid #99AABB';
                btn.style.borderRadius = '2px';
            }
            
            const targetType = isPersonTarget ? 'person' : (item.media_type || 'movie');
            btn.addEventListener('click', () => {
                loadStep(item.id, targetType);
            });
            nameMovieList.appendChild(btn);
        });

        applySearchFilter();
    };

    const renderCrewGrouped = (items) => {
        nameMovieList.innerHTML = '';
        nameMovieList.scrollTop = 0;



        const bannedItems = JSON.parse(localStorage.getItem('bannedItems') || '[]');
        items = items.filter(item => {
            // Crew members are always 'person' media_type inside this list
            return !bannedItems.some(b => b.id === item.id && b.media_type === 'person');
        });



        currentDisplayItems = items;
        currentIsPersonTarget = true;
        currentIsCrewGrouped = true;

        const crewGroups = {};
        items.forEach(member => {
            let job = member.job || (member.jobs && member.jobs[0] && member.jobs[0].job) || 'Other';
            const jobLower = job.toLowerCase().trim();
            if (jobLower === 'story') {
                job = 'Writer';
            } else if (jobLower === 'director of photography') {
                job = 'Cinematographer';
            }
            if (!crewGroups[job]) {
                crewGroups[job] = [];
            }
            if (!crewGroups[job].some(existing => existing.id === member.id)) {
                crewGroups[job].push(member);
            }
        });

        const getJobPriority = (jobName) => {
            const lower = jobName.toLowerCase().trim();
            if (lower === 'director') return 1;
            if (lower === 'producer') return 2;
            if (lower === 'writer' || lower === 'story') return 3;
            if (lower === 'editor') return 4;
            if (lower === ('cinematographer') || lower === ('director of photography')) return 5;
            return 6;
        };

        const sortedJobs = Object.keys(crewGroups).sort((a, b) => {
            const priA = getJobPriority(a);
            const priB = getJobPriority(b);
            if (priA !== priB) {
                return priA - priB;
            }
            return a.localeCompare(b);
        });

        let isFirstGroup = true;
        sortedJobs.forEach(job => {
            const groupItems = crewGroups[job];
            
            const groupContainer = document.createElement('div');
            groupContainer.className = 'crew-group-container';
            groupContainer.style.width = '100%';
            groupContainer.style.display = 'flex';
            groupContainer.style.flexDirection = 'row';
            groupContainer.style.flexWrap = 'wrap';
            groupContainer.style.gap = '8px';

            const headerEl = document.createElement('div');
            headerEl.style.width = '100%';
            headerEl.style.fontFamily = "'Graphik', sans-serif";
            headerEl.style.fontWeight = '600';
            headerEl.style.fontSize = '16px';
            headerEl.style.color = '#99AABB';
            headerEl.style.marginTop = isFirstGroup ? '0px' : '16px';
            headerEl.style.marginBottom = '2px';
            
            let headerText = job.toUpperCase();
            const jobLower = job.toLowerCase();
            if (jobLower === 'director' || jobLower === 'co-director') {
                headerText = groupItems.length === 1 ? 'DIRECTOR' : 'DIRECTORS';
            } else if (jobLower === 'producer') {
                headerText = groupItems.length === 1 ? 'PRODUCER' : 'PRODUCERS';
            } else if (jobLower === 'writer') {
                headerText = groupItems.length === 1 ? 'WRITER' : 'WRITERS';
            } else if (jobLower === 'editor') {
                headerText = groupItems.length === 1 ? 'EDITOR' : 'EDITORS';
            } else {
                if (groupItems.length > 1 && !headerText.endsWith('S')) {
                    headerText += 'S';
                }
            }
            headerEl.innerText = headerText;
            groupContainer.appendChild(headerEl);
            isFirstGroup = false;

            const btnWrap = document.createElement('div');
            btnWrap.style.cssText = 'display: flex; flex-wrap: wrap; gap: 8px; width: 100%;';
            
            groupItems.forEach(item => {
                const btn = document.createElement('button');
                btn.className = 'item-btn';
                btn.innerText = item.name || '';
                btn.style.padding = '6px 10px';
                btn.style.cursor = 'pointer';
                btn.style.color = '#99AABB';
                btn.style.backgroundColor = '#303943';
                btn.style.borderRadius = '3px';
                btn.style.border = 'none';
                btn.style.fontFamily = "'Graphik', sans-serif";
                btn.style.fontWeight = '400';
                btn.style.fontSize = '16px';

                btn.addEventListener('click', () => {
                    loadStep(item.id, 'person');
                });
                btnWrap.appendChild(btn);
            });
            groupContainer.appendChild(btnWrap);

            nameMovieList.appendChild(groupContainer);
        });

        applySearchFilter();
    };

    let tabColor = '#edae49';
    if (type === 'movie' || type === 'tv') {
        // ==========================================
        // FLOW 1: MOVIE / TV SHOW (Cast & Crew tabs)
        // ==========================================
        const castList = data.credits?.cast || [];
        const crewList = data.credits?.crew || [];

        if (castList.length > 0) {
            const castTab = document.createElement('span');
            castTab.innerText = 'CAST';
            castTab.style.cursor = 'pointer';
            castTab.style.fontWeight = '400';
            castTab.style.color = '#ffffff';
            castTab.style.padding = '4px 12px';
            castTab.style.boxSizing = 'border-box';
            castTab.style.borderBottom = '4px solid #ffffff';

            castTab.addEventListener('click', () => {
                Array.from(tabsContainer.children).forEach(c => {
                    c.style.color = tabColor;
                    c.style.borderBottom = '2px solid #99AABB';
                });
                castTab.style.color = '#ffffff';
                castTab.style.borderBottom = '4px solid #ffffff';
                renderTabContent(castList, true);
            });
            tabsContainer.appendChild(castTab);
            
            // Default to Cast
            renderTabContent(castList, true);
        }

        if (crewList.length > 0) {
            const isCrewDefault = (castList.length === 0);
            const crewTab = document.createElement('span');
            crewTab.innerText = 'CREW';
            crewTab.style.cursor = 'pointer';
            crewTab.style.fontWeight = '400';
            crewTab.style.color = isCrewDefault ? '#ffffff' : tabColor;
            crewTab.style.padding = '4px 12px';
            crewTab.style.boxSizing = 'border-box';
            crewTab.style.borderBottom = isCrewDefault ? '4px solid #ffffff' : '2px solid #99AABB';

            crewTab.addEventListener('click', () => {
                Array.from(tabsContainer.children).forEach(c => {
                    c.style.color = tabColor;
                    c.style.borderBottom = '2px solid #99AABB';
                });
                crewTab.style.color = '#ffffff';
                crewTab.style.borderBottom = '4px solid #ffffff';
                renderCrewGrouped(crewList);
            });
            tabsContainer.appendChild(crewTab);

            if (isCrewDefault) {
                renderCrewGrouped(crewList);
            }
        }

    } else if (type === 'person') {
    // ==========================================
    // FLOW 2: PERSON (Actor & Department tabs)
    // ==========================================
    const rawCastMovies = data.credits?.cast || [];
    const crewCredits = data.credits?.crew || [];

    const importantDepartments = ['Directing', 'Production', 'Writing', 'Editing', 'Sound', 'Camera'];
    const categories = {};

    // Helper to filter out exact duplicate credits while preserving distinctions if core metrics differ
    const filterUniqueCredits = (credits) => {
        const unique = [];
        for (const credit of credits) {
            const isDuplicate = unique.some(existing => 
                existing.id === credit.id && 
                existing.popularity === credit.popularity && 
                existing.vote_count === credit.vote_count && 
                existing.poster_path === credit.poster_path
            );
            if (!isDuplicate) {
                unique.push(credit);
            }
        }
        return unique;
    };

    const castMovies = filterUniqueCredits(rawCastMovies);

    if (castMovies.length > 0) {
        categories['ACTING'] = castMovies;
    }

    crewCredits.forEach(credit => {
        if (credit.department && importantDepartments.includes(credit.department)) {
            const deptKey = credit.department.toUpperCase();
            if (!categories[deptKey]) {
                categories[deptKey] = [];
            }
            const isDuplicate = categories[deptKey].some(existing => 
                existing.id === credit.id && 
                existing.popularity === credit.popularity && 
                existing.vote_count === credit.vote_count && 
                existing.poster_path === credit.poster_path
            );
            if (!isDuplicate) {
                categories[deptKey].push(credit);
            }
        }
    });

    // Sort each category list by vote count in descending order
    Object.keys(categories).forEach(deptKey => {
        categories[deptKey].sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0));
    });

    let tabKeys = Object.keys(categories);
    
    // Prioritize known_for_department if available to put that tab first
    if (data.known_for_department) {
        let primaryDept = data.known_for_department.toUpperCase();
        if (primaryDept === 'ACTING') primaryDept = 'ACTING';
        tabKeys.sort((a, b) => (a === primaryDept ? -1 : b === primaryDept ? 1 : 0));
    }

    let firstTab = true;
    tabKeys.forEach(tabName => {
        const tabSpan = document.createElement('span');
        tabSpan.innerText = tabName;
        tabSpan.style.cursor = 'pointer';
        tabSpan.style.fontWeight = '400';
        tabSpan.style.padding = '4px 12px';
        tabSpan.style.boxSizing = 'border-box';
        tabSpan.style.borderBottom = firstTab ? '4px solid #ffffff' : '2px solid #99AABB';
        tabSpan.style.color = firstTab ? '#ffffff' : tabColor;

        const items = categories[tabName];
        
        tabSpan.addEventListener('click', () => {
            Array.from(tabsContainer.children).forEach(c => {
                c.style.color = tabColor;
                c.style.borderBottom = '2px solid #99AABB';
            });
            tabSpan.style.color = '#ffffff';
            tabSpan.style.borderBottom = '4px solid #ffffff';
            renderTabContent(items, false);
        });

        tabsContainer.appendChild(tabSpan);

        if (firstTab) {
            renderTabContent(items, false);
            firstTab = false;
        }
    });
}

    console.log('Data loaded:', data);
    console.log('Goal data:', goalData);
    if ((data.id == goalData.id) && (data.media_type == goalData.media_type)) {
        console.log('Goal data reached');
        runComplete();
    }

}


timerReturnBtn.addEventListener('click', () => {
    window.switchView('view-home');
});



function runComplete() {
    window.playSoundEffect('fnaf.mp3');
    window.playSoundEffect('happy_wheels.mp3');
    window.stop();
}