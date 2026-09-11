

export async function initStats() {
    // Fetch stats data from the server
    let stats = JSON.parse(localStorage.getItem('stats')) || {
        wins: 0,
        winStreak: 0,
        shortestPath: 0,
        averagePath: 0,
        longestPath: 0,
        fastestTime: 0,
        averageTime: 0,
        slowestTime: 0,
        mostVisited: {},
        savedRuns: []
    };
    console.log('Stats data retrieved from localStorage:', stats);

    let wins = stats.wins || 0;
    let winStreak = stats.winStreak || 0;
    let shortestPath = stats.shortestPath || 0;
    let averagePath = stats.averagePath || 0;
    let longestPath = stats.longestPath || 0;
    let fastestTime = stats.fastestTime || 0;
    let averageTime = stats.averageTime || 0;
    let slowestTime = stats.slowestTime || 0;
    let savedRuns = stats.savedRuns || [];

    // Update the stats display
    document.getElementById('wins').textContent = wins;
    document.getElementById('win-streak').textContent = winStreak;
    document.getElementById('shortest-path').textContent = shortestPath;
    document.getElementById('average-path').textContent = averagePath.toFixed(3);
    document.getElementById('longest-path').textContent = longestPath;
    document.getElementById('fastest-time').textContent = window.msToTime(fastestTime);
    document.getElementById('average-time').textContent = window.msToTime(averageTime);
    document.getElementById('slowest-time').textContent = window.msToTime(slowestTime);



    // Clear out any previous bars and reset the container with its default placeholder text
    const mostVisitedContainer = document.getElementById('most-visited-container');
    mostVisitedContainer.innerHTML = `
        <div id="most-visited-container-text" style="font-family: 'Graphik', sans-serif; font-weight: 400; font-size: 18px; color: #99AABB; justify-content: center; align-items: center; display: flex; height: 100%; box-sizing: border-box;">
            <span>Most visited items will appear here</span>
        </div>
    `;

    // if there are items in mostVisited dict, hide most-visited-text, sort the items by count descending, and display them in the most-visited-container[cite: 8]
    if (stats.mostVisited && Object.keys(stats.mostVisited).length > 0) {
        const mostVisitedText = document.getElementById('most-visited-container-text');
        mostVisitedText.style.display = 'none';

        // Sort the items by count descending
        const sortedItems = Object.entries(stats.mostVisited).sort((a, b) => b[1] - a[1]);
        const maxCount = sortedItems[0][1];

        // Display the sorted items in the most-visited-container
        sortedItems.slice(0, 10).forEach(([key, count]) => {
            const item = document.createElement('div');
            item.style.cssText = 'display: flex; flex-direction: row; align-items: center; width: 100%; box-sizing: border-box; padding: 0px 10px; gap: 10px;';

            const keyDiv = document.createElement('div');
            keyDiv.style.cssText = 'font-family: \'Graphik\', sans-serif; font-weight: 400; font-size: 18px; color: #99AABB; flex: 0 0 140px; width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;';
            keyDiv.textContent = key;

            const barBoundingBox = document.createElement('div');
            barBoundingBox.style.cssText = 'display: flex; flex: 1; height: 16px; background-color: #161c22; box-sizing: border-box; position: relative; overflow: hidden;';

            const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
            const barInner = document.createElement('div');
            barInner.style.cssText = `width: ${percentage}%; height: 100%; background-color: #659157; box-sizing: border-box;`;
            barBoundingBox.appendChild(barInner);

            const countDiv = document.createElement('div');
            countDiv.style.cssText = 'font-family: \'Graphik\', sans-serif; font-weight: 400; font-size: 18px; color: #99AABB; flex-shrink: 0; white-space: nowrap; text-align: left; min-width: 20px;';
            countDiv.textContent = count;

            item.appendChild(keyDiv);
            item.appendChild(barBoundingBox);
            item.appendChild(countDiv);

            mostVisitedContainer.appendChild(item);
        });
    }

    const container = document.getElementById('saved-runs-container');
    if (!container) return;

    

    if (savedRuns.length === 0) {
        container.innerHTML = `
            <div id="saved-runs-container-text" style="font-family: 'Graphik', sans-serif; font-weight: 400; font-size: 18px; color: #99AABB; justify-content: center; align-items: center; display: flex; height: 100%; box-sizing: border-box;">
                <span>Saved runs will appear here</span>
            </div>
        `;
        return;
    }

    container.innerHTML = '';

    for (let i = savedRuns.length - 1; i >= 0; i--) {
        const run = savedRuns[i];
        const runIndex = i;

        const runDiv = document.createElement('div');
        runDiv.className = 'saved-run-item';
        runDiv.style.cssText = `
            display: flex;
            flex-direction: column;
            padding: 8px 10px;
            border-bottom: 2px solid #99AABB33;
            cursor: pointer;
            background-color: #202830;
            transition: background-color 0.1s ease-in-out;
            box-sizing: border-box;
            width: 100%;
        `;

        runDiv.addEventListener('mouseenter', () => {
            runDiv.style.backgroundColor = '#161c22';
        });
        runDiv.addEventListener('mouseleave', () => {
            runDiv.style.backgroundColor = '#202830';
        });

        const formatRunTime = (ms) => {
            if (typeof ms !== 'number') return { minutes: '00', seconds: '00', milliseconds: '000' };
            let date = new Date(ms);
            let minutes = String(date.getUTCMinutes()).padStart(2, '0');
            let seconds = String(date.getUTCSeconds()).padStart(2, '0');
            let milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');
            return { minutes, seconds, milliseconds };
        };

        const timeObj = formatRunTime(run.time);
        const pathLength = run.path ? run.path.length - 1 : 0;
        const gamemode = run.gamemode || 'STANDARD';
        const gamemodeClass = gamemode === 'STANDARD' ? 'text-orange' : (gamemode === 'DETOUR' ? 'text-green' : 'text-purple');

        const renderItemSide = (item, isGoal = false) => {
            if (!item) return '';
            const imgHtml = item.imageUrl 
                ? `<img src="${item.imageUrl}" style="width: 56px; height: 84px; object-fit: cover; border-radius: 2px; flex-shrink: 0;" />`
                : `<div style="width: 56px; height: 84px; background: #2c3844; border-radius: 2px; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #99AABB; flex-shrink: 0;">N/A</div>`;
            
            const title = item.title || item.name || 'Unknown';
            const subText = item.media_type.toUpperCase() || '';
            const year = item.release_date ? item.release_date.split('-')[0] : (item.first_air_date ? item.first_air_date.split('-')[0] : '');

            if (isGoal) {
                return `
                    <div style="display: flex; align-items: center; gap: 10px; justify-content: flex-end; text-align: right; flex: 1; overflow: hidden; min-width: 0;">
                        <div style="overflow: hidden; display: flex; flex-direction: column; align-items: flex-end; flex: 1; min-width: 0;">
                            <div style="font-family: 'Graphik', sans-serif; font-weight: 600; font-size: 16px; color: #f8f8f8; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; width: 100%;">Titled: ${title}</div>
                            ${subText ? `<div style="font-family: 'Graphik', sans-serif; font-weight: 400; font-size: 13px; color: #99AABB; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%;">Sub: ${subText}</div>` : ''}
                            ${year ? `<div style="font-family: 'Graphik', sans-serif; font-weight: 400; font-size: 12px; color: #99AABB;">${year}</div>` : ''}
                        </div>
                        ${imgHtml}
                    </div>
                `.replace('Titled: ', '').replace('Sub: ', ''); // Clean helper strings back out
            } else {
                return `
                    <div style="display: flex; align-items: center; gap: 10px; justify-content: flex-start; text-align: left; flex: 1; overflow: hidden; min-width: 0;">
                        ${imgHtml}
                        <div style="overflow: hidden; display: flex; flex-direction: column; align-items: flex-start; flex: 1; min-width: 0;">
                            <div style="font-family: 'Graphik', sans-serif; font-weight: 600; font-size: 16px; color: #f8f8f8; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; width: 100%;">${title}</div>
                            ${subText ? `<div style="font-family: 'Graphik', sans-serif; font-weight: 400; font-size: 13px; color: #99AABB; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%;">${subText}</div>` : ''}
                            ${year ? `<div style="font-family: 'Graphik', sans-serif; font-weight: 400; font-size: 12px; color: #99AABB;">${year}</div>` : ''}
                        </div>
                    </div>
                `;
            }
        };

        const headerDiv = document.createElement('div');
        headerDiv.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            box-sizing: border-box;
        `;

        headerDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-family: 'Graphik', sans-serif; font-weight: 600; font-size: 40px; color: #f8f8f8; letter-spacing: 1px;">
                    <span class="text-green">${timeObj.minutes}</span>:<span class="text-orange">${timeObj.seconds}</span>.<span class="text-purple">${timeObj.milliseconds}</span>
                </span>
                <div style="display: flex; flex-direction: column; gap: 1px;">
                    <span style="font-family: 'Graphik', sans-serif; font-weight: 400; font-size: 14px; color: #99AABB;">Length: ${pathLength}</span>
                    <span class="${gamemodeClass}" style="font-family: 'Graphik', sans-serif; font-weight: 600; font-size: 14px;">${gamemode}</span>
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
                <button class="share-run-btn primary-blue" data-index="${runIndex}" style=" display: flex; align-items: center; justify-content: center; background: #2f67b1; border-radius: 3px; border: none; cursor: pointer; font-size: 24px; font-weight: 600; color: #fff; padding: 4px; width: 36px; height: 36px;"><span style="position: relative; top: -2px;">⮺</span></button>
                <button class="delete-run-btn primary-orange" data-index="${runIndex}" style=" display: flex; align-items: center; justify-content: center; background: #edae49; border-radius: 3px; border: none; cursor: pointer; font-size: 18px; color: #fff; padding: 4px; width: 36px; height: 36px;"><img src="images/trash.png" style="width: 30px; height: 30px;"></button>
                <span class="dropdown-arrow" style="font-family: 'Graphik', sans-serif; font-weight: 600; font-size: 16px; color: #99AABB; display: inline-block; transform: scale(1, 1); user-select: none;">⌵</span>
            </div>
        `;

        const detailsPreviewDiv = document.createElement('div');
        detailsPreviewDiv.className = 'run-preview-content';
        detailsPreviewDiv.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 10px;
            width: 100%;
            box-sizing: border-box;
            gap: 10px;
        `;

        detailsPreviewDiv.innerHTML = `
            ${renderItemSide(run.start, false)}
            <div style="font-family: 'Graphik', sans-serif; font-weight: 600; font-size: 24px; color: #99AABB; padding: 0 10px; flex-shrink: 0;">➔</div>
            ${renderItemSide(run.goal, true)}
        `;

        const expandedPathDiv = document.createElement('div');
        expandedPathDiv.className = 'run-expanded-content';
        expandedPathDiv.style.cssText = `
            display: none;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: center;
            gap: 8px;
            margin-top: 10px;
            width: 100%;
            box-sizing: border-box;
        `;

        if (run.path && Array.isArray(run.path)) {
            run.path.forEach((pathItem, pathIdx) => {
                const pill = document.createElement('div');
                const textColorClass = pathIdx === 0 ? 'text-orange' : (pathIdx === run.path.length - 1 ? 'text-green' : '');
                pill.className = textColorClass;
                pill.style.cssText = `
                    background-color: #2c3844;
                    ${textColorClass ? '' : 'color: #99AABB;'}
                    font-family: 'Graphik', sans-serif;
                    font-weight: ${pathIdx === 0 || pathIdx === run.path.length - 1 ? '600' : '400'};
                    font-size: 14px;
                    padding: 6px 12px;
                    border-radius: 3px;
                    display: inline-flex;
                    align-items: center;
                    box-sizing: border-box;
                `;
                pill.textContent = pathItem.title || pathItem.name || 'Item';
                expandedPathDiv.appendChild(pill);

                // Add an arrow between items (skip after the last item)
                if (pathIdx < run.path.length - 1) {
                    const arrow = document.createElement('div');
                    arrow.style.cssText = `
                        font-family: 'Graphik', sans-serif;
                        font-weight: 600;
                        font-size: 14px;
                        color: #99AABB;
                        user-select: none;
                    `;
                    arrow.textContent = '➔';
                    expandedPathDiv.appendChild(arrow);
                }
            });
        }

        runDiv.appendChild(headerDiv);
        runDiv.appendChild(detailsPreviewDiv);
        runDiv.appendChild(expandedPathDiv);

        let isExpanded = false;
        const arrowSpan = headerDiv.querySelector('.dropdown-arrow');
        const deleteBtn = headerDiv.querySelector('.delete-run-btn');
        const shareBtn = headerDiv.querySelector('.share-run-btn');

        if (shareBtn) {
            console.log('Share button found for run index:', runIndex);
        }
        if (deleteBtn) {
            console.log('Delete button found for run index:', runIndex);
        }

        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            let stats = JSON.parse(localStorage.getItem('stats') || '{}');
            let currentRuns = stats.savedRuns || [];
            currentRuns.splice(runIndex, 1);
            stats.savedRuns = currentRuns;
            localStorage.setItem('stats', JSON.stringify(stats));
            initStats();
        });

        deleteBtn.addEventListener('mouseenter', (e) => {
            e.stopPropagation();
            deleteBtn.style.backgroundColor = '#b48130'; // Hover color
            runDiv.style.backgroundColor = '#202830';    // Reset row background so button stands out
        });

        deleteBtn.addEventListener('mouseleave', (e) => {
            e.stopPropagation();
            deleteBtn.style.backgroundColor = '#edae49'; // Default color
            runDiv.style.backgroundColor = '#161c22';    // Restore row hover background
        });

        shareBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const runData = savedRuns[runIndex];
            navigator.clipboard.writeText(runData.path.map(item => item.name).join(' -> '));
        });

        shareBtn.addEventListener('mouseenter', (e) => {
            e.stopPropagation();
            shareBtn.style.backgroundColor = '#13468a';
            runDiv.style.backgroundColor = '#202830'; // Reset row background so button stands out
        });

        shareBtn.addEventListener('mouseleave', (e) => {
            e.stopPropagation();
            shareBtn.style.backgroundColor = '#2f67b1';
            runDiv.style.backgroundColor = '#161c22'; // Restore row hover background
        });

        runDiv.addEventListener('click', () => {
            isExpanded = !isExpanded;
            if (isExpanded) {
                detailsPreviewDiv.style.display = 'none';
                expandedPathDiv.style.display = 'flex';
                arrowSpan.style.transform = 'scale(1, -1)'; // Flip the arrow
            } else {
                detailsPreviewDiv.style.display = 'flex';
                expandedPathDiv.style.display = 'none';
                arrowSpan.style.transform = 'scale(1, 1)'; // Reset the arrow
            }
        });

        container.appendChild(runDiv);
    }

}

window.initStats = initStats;



const statsReturnBtn = document.getElementById('stats-return-btn');
if (statsReturnBtn) {
    statsReturnBtn.addEventListener('click', () => {
        window.switchView('view-home');
    });
}


let clearConfirmTimeout = null;
let isConfirmingClear = false;

const statsClearBtn = document.getElementById('stats-clear-btn');
if (statsClearBtn) {
    statsClearBtn.addEventListener('click', () => {
        if (!isConfirmingClear) {
            // First click: trigger warning state and show warning message
            isConfirmingClear = true;
            statsClearBtn.classList.add('stats-clear-warning');

            let msgEl = document.getElementById('stats-clear-msg');
            if (!msgEl) {
                msgEl = document.createElement('div');
                msgEl.id = 'stats-clear-msg';
                msgEl.className = 'stats-clear-error-msg';
                msgEl.textContent = 'WARNING: This will clear ALL of your local data\nPress again to confirm';
                
                // Append directly to the body to completely escape footer overflow clipping
                document.body.appendChild(msgEl);

                // Compute exact viewport coordinates to float right above the button
                const rect = statsClearBtn.getBoundingClientRect();
                msgEl.style.cssText = `
                    position: fixed;
                    left: ${rect.left + (rect.width / 2)}px;
                    bottom: ${window.innerHeight - rect.top + 12}px;
                    transform: translateX(-50%);
                    background-color: #161c22;
                    border: 4px solid #edae49;
                    color: #edae49;
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-family: 'Graphik', sans-serif;
                    font-size: 13px;
                    font-weight: 600;
                    text-align: center;
                    white-space: pre-line;
                    z-index: 9999;
                    pointer-events: none;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.4);
                `;
            }

            // Reset after 5 seconds if not confirmed
            clearConfirmTimeout = setTimeout(() => {
                isConfirmingClear = false;
                statsClearBtn.classList.remove('stats-clear-warning');
                if (msgEl) msgEl.remove();
            }, 5000);
        } else {
            // Second click: execute data clear
            clearTimeout(clearConfirmTimeout);
            isConfirmingClear = false;
            statsClearBtn.classList.remove('stats-clear-warning');
            const msgEl = document.getElementById('stats-clear-msg');
            if (msgEl) msgEl.remove();

            // Clear stats and local data
            localStorage.removeItem('stats');
            
            // Refresh stats UI to reset values back to 0 or N/A
            initStats();
        }
    });
}