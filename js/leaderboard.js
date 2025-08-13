// js/leaderboard.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, push, onValue, query, orderByChild, limitToLast } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { firebaseConfig } from "./firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export function saveScore(gameName, playerName, score) {
  const gameRef = ref(db, `leaderboards/${gameName}`);
  push(gameRef, {
    name: playerName,
    score: score,
    timestamp: Date.now()
  });
}

export function loadLeaderboard(gameName, elementId = "leaderboard") {
  const leaderboardEl = document.getElementById(elementId);
  const q = query(ref(db, `leaderboards/${gameName}`), orderByChild("score"), limitToLast(10));

  onValue(q, (snapshot) => {
    const scores = [];
    snapshot.forEach(child => scores.push(child.val()));
    scores.reverse(); // Highest score first

    leaderboardEl.innerHTML = scores.map((entry, i) =>
      `<li>${i + 1}. ${entry.name} – ${entry.score}</li>`
    ).join('');
  });
}
