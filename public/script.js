document.addEventListener('DOMContentLoaded', () => {
    const scoreForm = document.getElementById('scoreForm');
    const leaderboardBody = document.getElementById('leaderboardBody');
    const usernameInput = document.getElementById('username');
    const scoreInput = document.getElementById('score');

    // Fetch and render the leaderboard
    const fetchLeaderboard = async () => {
        try {
            const response = await fetch('/api/leaderboard');
            const data = await response.json();
            renderLeaderboard(data);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        }
    };

    // Render entries into the table
    const renderLeaderboard = (data) => {
        leaderboardBody.innerHTML = '';
        
        if (data.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `<td colspan="4" style="text-align: center; color: var(--text-secondary);">No scores yet. Be the first!</td>`;
            leaderboardBody.appendChild(emptyRow);
            return;
        }

        data.forEach((entry, index) => {
            const row = document.createElement('tr');
            row.className = `row-${entry.rank}`;
            
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

    // Handle form submission
    scoreForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const score = parseInt(scoreInput.value);

        if (!username || isNaN(score)) return;

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
        }
    });

    // Initial load
    fetchLeaderboard();
});
