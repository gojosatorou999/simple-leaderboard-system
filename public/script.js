document.addEventListener('DOMContentLoaded', () => {
    const scoreForm = document.getElementById('scoreForm');
    const leaderboardBody = document.getElementById('leaderboardBody');
    const usernameInput = document.getElementById('username');
    const scoreInput = document.getElementById('score');
    const searchBar = document.getElementById('searchBar');
    
    // Stats elements
    const totalPlayersEl = document.getElementById('totalPlayers');
    const peakScoreEl = document.getElementById('peakScore');
    const avgScoreEl = document.getElementById('avgScore');

    let allData = [];

    // Fetch and render the leaderboard
    const fetchLeaderboard = async () => {
        try {
            const response = await fetch('/api/leaderboard');
            allData = await response.json();
            updateStats(allData);
            renderLeaderboard(allData);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        }
    };

    // Update global statistics
    const updateStats = (data) => {
        if (data.length === 0) {
            totalPlayersEl.textContent = '0';
            peakScoreEl.textContent = '0';
            avgScoreEl.textContent = '0';
            return;
        }

        const total = data.length;
        const peak = Math.max(...data.map(d => d.score));
        const avg = Math.round(data.reduce((acc, curr) => acc + curr.score, 0) / total);

        totalPlayersEl.textContent = total.toLocaleString();
        peakScoreEl.textContent = peak.toLocaleString();
        avgScoreEl.textContent = avg.toLocaleString();
    };

    // Render entries into the table
    const renderLeaderboard = (data) => {
        leaderboardBody.innerHTML = '';
        
        const searchTerm = searchBar.value.toLowerCase().trim();
        const filteredData = data.filter(entry => 
            entry.username.toLowerCase().includes(searchTerm)
        );

        if (filteredData.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `<td colspan="4" style="text-align: center; color: var(--text-secondary); padding: 2rem;">No matching players found.</td>`;
            leaderboardBody.appendChild(emptyRow);
            return;
        }

        filteredData.forEach((entry) => {
            const row = document.createElement('tr');
            row.className = `row-${entry.rank <= 3 ? entry.rank : 'default'}`;
            
            // Format date for readability
            const date = new Date(entry.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            // Special badge for top 3
            let rankDisplay = entry.rank;
            if (entry.rank === 1) rankDisplay = `<span class="rank-1">👑 ${entry.rank}</span>`;
            else if (entry.rank === 2) rankDisplay = `<span class="rank-2">🥈 ${entry.rank}</span>`;
            else if (entry.rank === 3) rankDisplay = `<span class="rank-3">🥉 ${entry.rank}</span>`;

            row.innerHTML = `
                <td class="rank-col">${rankDisplay}</td>
                <td><strong>${entry.username}</strong></td>
                <td class="score-col">${entry.score.toLocaleString()}</td>
                <td class="date-col">${date}</td>
            `;
            leaderboardBody.appendChild(row);
        });
    };

    // Handle search input
    searchBar.addEventListener('input', () => {
        renderLeaderboard(allData);
    });

    // Handle form submission
    scoreForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const score = parseInt(scoreInput.value);

        if (!username || isNaN(score)) return;

        // Visual feedback
        const btn = scoreForm.querySelector('button');
        const originalText = btn.textContent;
        btn.textContent = 'Submitting...';
        btn.disabled = true;

        try {
            const response = await fetch('/api/scores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, score })
            });

            if (response.ok) {
                // Clear form and refresh leaderboard
                usernameInput.value = '';
                scoreInput.value = '';
                await fetchLeaderboard();
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error submitting score:', error);
            alert('Could not submit score. Make sure the server is running.');
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    });

    // Initial load
    fetchLeaderboard();

    // Auto-refresh every 30 seconds
    setInterval(fetchLeaderboard, 30000);
});

