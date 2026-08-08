

export async function initStats() {
    // Fetch stats data from the server
    let stats = JSON.parse(localStorage.getItem('stats'));
    console.log('Stats data retrieved from localStorage:', stats);

    let wins = stats.wins || 0;
    let winStreak = stats.winStreak || 0;
    let shortestPath = stats.shortestPath || 'N/A';
    let averagePath = stats.averagePath || 'N/A';
    let longestPath = stats.longestPath || 'N/A';
    let fastestTime = stats.fastestTime || 'N/A';
    let averageTime = stats.averageTime || 'N/A';
    let slowestTime = stats.slowestTime || 'N/A';

    // Update the stats display
    document.getElementById('wins').textContent = wins;
    document.getElementById('win-streak').textContent = winStreak;
    document.getElementById('shortest-path').textContent = shortestPath;
    document.getElementById('average-path').textContent = averagePath;
    document.getElementById('longest-path').textContent = longestPath;
    document.getElementById('fastest-time').textContent = fastestTime;
    document.getElementById('average-time').textContent = averageTime;
    document.getElementById('slowest-time').textContent = slowestTime;


    // Clear out any previous bars and reset the container with its default placeholder text
    const mostVisitedContainer = document.getElementById('most-visited-container');
    mostVisitedContainer.innerHTML = `
        <div id="most-visited-container-text" style="display: flex; font-family: 'Graphik', sans-serif; font-weight: 400; font-size: 18px; color: #99AABB; justify-content: center; align-items: center; height: 100%; box-sizing: border-box;">
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
            barBoundingBox.style.cssText = 'display: flex; flex: 1; height: 16px; background-color: #161c22; border: 1px solid #99AABB; box-sizing: border-box; position: relative; overflow: hidden;';

            const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
            const barInner = document.createElement('div');
            barInner.style.cssText = `width: ${percentage}%; height: 100%; background-color: #659157; box-sizing: border-box;`;
            barBoundingBox.appendChild(barInner);

            const countDiv = document.createElement('div');
            countDiv.style.cssText = 'font-family: \'Graphik\', sans-serif; font-weight: 400; font-size: 18px; color: #99AABB; flex-shrink: 0; white-space: nowrap; text-align: right;';
            countDiv.textContent = count;

            item.appendChild(keyDiv);
            item.appendChild(barBoundingBox);
            item.appendChild(countDiv);

            mostVisitedContainer.appendChild(item);
        });
    }

}

window.initStats = initStats;



const statsReturnBtn = document.getElementById('stats-return-btn');
if (statsReturnBtn) {
    statsReturnBtn.addEventListener('click', () => {
        window.switchView('view-home');
    });
}