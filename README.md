# Simple Leaderboard System

A lightweight, robust system for tracking user scores and generating a ranked leaderboard.

## Overview
This system provides a RESTful API to submit scores and retrieve a ranked list of users. It also features a sleek, responsive frontend to visualize the competition in real-time.

---

## 🏆 Ranking Logic
The system uses **Standard Competition Ranking** (also known as "1224" ranking). This is the most common method used in sports and games.

### Rules:
1.  **Tie-Breaking**: If two or more users have the same score, they receive the same rank.
2.  **Gap Preservation**: After a tie, the next rank is skipped.
    -   *Example:* If two people tie for 2nd place, the next person will be 4th (not 3rd).
3.  **Score Priority**: Higher scores always receive lower rank numbers (1st is the highest).

### Visual Example:
| User | Score | Rank |
| :--- | :--- | :--- |
| Alice | 100 | **1** |
| Bob | 85 | **2** |
| Charlie | 85 | **2** |
| Dave | 70 | **4** |

---

## 🚀 Getting Started

### 1. Installation
Ensure you have [Node.js](https://nodejs.org/) installed, then run:

```bash
npm install
```

### 2. Run the Server
Start the Express server on `http://localhost:3000`:

```bash
npm start
```

*(Note: Ensure you have added `"start": "node server.js"` to your `package.json` scripts if it's missing.)*

### 3. Usage
-   **Frontend**: Open [http://localhost:3000](http://localhost:3000) in your browser.
-   **Submit Score (API)**:
    -   **Endpoint**: `POST /api/scores`
    -   **Body**: `{"username": "Ninja", "score": 1500}`
-   **Get Leaderboard (API)**:
    -   **Endpoint**: `GET /api/leaderboard`

---

## 🛠️ Tech Stack
-   **Backend**: Node.js, Express.js
-   **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
-   **Styling**: Custom modern CSS with a focus on premium aesthetics and responsiveness.
