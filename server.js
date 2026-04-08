const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory data storage (for simplicity)
let scores = [];

/**
 * GET /api/leaderboard
 * Returns the ranked leaderboard
 */
app.get('/api/leaderboard', (req, res) => {
    // Sort scores descending
    const sortedScores = [...scores].sort((a, b) => b.score - a.score);

    // Assign ranks using Standard Competition Ranking (1, 2, 2, 4)
    let currentRank = 1;
    const rankedLeaderboard = sortedScores.map((entry, index) => {
        if (index > 0 && entry.score < sortedScores[index - 1].score) {
            currentRank = index + 1;
        }
        return {
            ...entry,
            rank: currentRank
        };
    });

    res.json(rankedLeaderboard);
});

/**
 * POST /api/scores
 * Submit a new score or update an existing one
 * Body: { "username": "string", "score": number }
 */
app.post('/api/scores', (req, res) => {
    const { username, score } = req.body;

    if (!username || typeof score !== 'number') {
        return res.status(400).json({ error: 'Username and numeric score are required.' });
    }

    // Check if user already exists
    const existingIndex = scores.findIndex(s => s.username === username);

    if (existingIndex > -1) {
        // If the new score is higher, update it
        if (score > scores[existingIndex].score) {
            scores[existingIndex].score = score;
            scores[existingIndex].date = new Date().toISOString();
        }
    } else {
        // Add new user
        scores.push({
            username,
            score,
            date: new Date().toISOString()
        });
    }

    res.status(201).json({ message: 'Score submitted successfully.' });
});

app.listen(PORT, () => {
    console.log(`Leaderboard server running on http://localhost:${PORT}`);
});
