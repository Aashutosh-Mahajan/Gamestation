document.addEventListener('DOMContentLoaded', () => {
    loadLeaderboard();
            // Game variables
            let flippedCards = [];
            let matchedPairs = 0;
            let totalPairs = 6;
            let isProcessing = false;
            let gameStarted = false;
            let gameEnded = false;
            let flipCount = 0;
            let timeLeft = 60; // seconds
            let timerInterval = null;
            let currentLevel = 1;
            let maxLevels = 10;
            let score = 0;
            let totalScore = 0;
            let totalFlips = 0;
            let totalMatches = 0;
            
            // Level configurations
            const levelConfig = [
                { pairs: 6, time: 60 },   // Level 1
                { pairs: 8, time: 75 },   // Level 2
                { pairs: 10, time: 90 },  // Level 3
                { pairs: 12, time: 100 }, // Level 4
                { pairs: 14, time: 110 }, // Level 5
                { pairs: 16, time: 120 }, // Level 6
                { pairs: 18, time: 130 }, // Level 7
                { pairs: 20, time: 140 }, // Level 8
                { pairs: 22, time: 150 }, // Level 9
                { pairs: 24, time: 160 }  // Level 10
            ];
            
            // DOM elements
            const gameBoard = document.getElementById('game-board');
            const timeDisplay = document.getElementById('time');
            const flipsDisplay = document.getElementById('flips');
            const matchesDisplay = document.getElementById('matches');
            const scoreDisplay = document.getElementById('score');
            const currentLevelDisplay = document.getElementById('current-level');
            const levelProgressDisplay = document.getElementById('level-progress');
            const maxLevelsDisplay = document.getElementById('max-levels');
            const progressFill = document.getElementById('progress-fill');
            
            const levelCompleteModal = document.getElementById('level-complete-modal');
            const completedLevelDisplay = document.getElementById('completed-level');
            const levelTimeLeftDisplay = document.getElementById('level-time-left');
            const levelFlipsDisplay = document.getElementById('level-flips');
            const timeBonusDisplay = document.getElementById('time-bonus');
            const levelScoreDisplay = document.getElementById('level-score');
            
            const levelFailedModal = document.getElementById('level-failed-modal');
            const failedLevelDisplay = document.getElementById('failed-level');
            const failedMatchesDisplay = document.getElementById('failed-matches');
            const failedFlipsDisplay = document.getElementById('failed-flips');
            const failedScoreDisplay = document.getElementById('failed-score');
            
            const gameCompleteModal = document.getElementById('game-complete-modal');
            const totalLevelsDisplay = document.getElementById('total-levels');
            const totalFlipsDisplay = document.getElementById('total-flips');
            const totalMatchesDisplay = document.getElementById('total-matches');
            const finalScoreDisplay = document.getElementById('final-score');
            
            const levelNotification = document.getElementById('level-notification');
            const notificationLevelDisplay = document.getElementById('notification-level');
            const notificationMessageDisplay = document.getElementById('notification-message');
            
            const restartBtn = document.getElementById('restart-btn');
            const resetGameBtn = document.getElementById('reset-game-btn');
            const nextLevelBtn = document.getElementById('next-level-btn');
            const retryLevelBtn = document.getElementById('retry-level-btn');
            const backToMenuBtn = document.getElementById('back-to-menu-btn');
            const playAgainBtn = document.getElementById('play-again-btn');
            
            // Card icons (using emoji for simplicity)
            const icons = [
                '🚀', '🌟', '🎮', '🎯', '🎨', '🎭', '🎪', '🎡',
                '🏆', '🎸', '🎹', '🎬', '📷', '🔮', '💎', '🎁',
                '🦄', '🐉', '🌈', '🍕', '🍦', '🌮', '🧁', '🍩',
                '🐱', '🐶', '🦊', '🐼', '🐯', '🦁', '🐘', '🦒',
                '🌍', '🌞', '⚡', '🔥', '💧', '🌪️', '❄️', '🌱',
                '🏀', '⚽', '🏈', '⚾', '🎾', '🏐', '🎱', '🏓'
            ];
            
            // Initialize game
            initGame();
            
            // Event listeners
            restartBtn.addEventListener('click', () => {
                restartLevel();
            });
            
            resetGameBtn.addEventListener('click', () => {
                resetGame();
            });
            
            nextLevelBtn.addEventListener('click', () => {
                levelCompleteModal.classList.add('hidden');
                startNextLevel();
            });
            
            retryLevelBtn.addEventListener('click', () => {
                levelFailedModal.classList.add('hidden');
                restartLevel();
            });
            
            backToMenuBtn.addEventListener('click', () => {
                levelFailedModal.classList.add('hidden');
                resetGame();
            });
            
            playAgainBtn.addEventListener('click', () => {
                gameCompleteModal.classList.add('hidden');
                resetGame();
            });
            
            // Functions
            function initGame() {
                // Set initial values
                currentLevel = 1;
                totalScore = 0;
                totalFlips = 0;
                totalMatches = 0;
                
                // Update displays
                updateLevelDisplay();
                
                // Start first level
                startLevel(currentLevel);
            }
            
            function startLevel(level) {
                // Reset level state
                resetLevelState();
                
                // Get level configuration
                const config = levelConfig[level - 1];
                totalPairs = config.pairs;
                timeLeft = config.time;
                
                // Update displays
                updateTimeDisplay();
                updateMatchesDisplay();
                
                // Create cards
                createCards();
                
                // Show level notification
                showLevelNotification(level);
            }
            
            function resetLevelState() {
                flippedCards = [];
                matchedPairs = 0;
                isProcessing = false;
                gameStarted = false;
                gameEnded = false;
                flipCount = 0;
                score = 0;
                
                if (timerInterval) {
                    clearInterval(timerInterval);
                    timerInterval = null;
                }
                
                // Reset displays
                flipsDisplay.textContent = '0';
                scoreDisplay.textContent = '0';
            }
            
            function updateLevelDisplay() {
                currentLevelDisplay.textContent = currentLevel;
                levelProgressDisplay.textContent = currentLevel;
                maxLevelsDisplay.textContent = maxLevels;
                
                // Update progress bar
                const progressPercentage = ((currentLevel - 1) / maxLevels) * 100;
                progressFill.style.width = `${progressPercentage}%`;
            }
            
            function updateTimeDisplay() {
                const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
                const seconds = (timeLeft % 60).toString().padStart(2, '0');
                
                timeDisplay.textContent = `${minutes}:${seconds}`;
                
                // Add warning class if time is running low (less than 10 seconds)
                if (timeLeft <= 10) {
                    timeDisplay.classList.add('timer-warning');
                } else {
                    timeDisplay.classList.remove('timer-warning');
                }
            }
            
            function updateMatchesDisplay() {
                matchesDisplay.textContent = `${matchedPairs}/${totalPairs}`;
            }
            
            function createCards() {
                gameBoard.innerHTML = '';
                
                // Create pairs of cards
                let selectedIcons = icons.slice(0, totalPairs);
                let cardPairs = [...selectedIcons, ...selectedIcons];
                
                // Shuffle cards
                cardPairs.sort(() => Math.random() - 0.5);
                
                // Set grid columns based on number of pairs
                if (totalPairs <= 8) {
                    gameBoard.className = 'grid grid-cols-4 gap-3 sm:gap-4 md:gap-5 animate__animated animate__fadeIn';
                } else if (totalPairs <= 12) {
                    gameBoard.className = 'grid grid-cols-4 sm:grid-cols-6 gap-3 sm:gap-4 md:gap-5 animate__animated animate__fadeIn';
                } else {
                    gameBoard.className = 'grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-4 md:gap-5 animate__animated animate__fadeIn';
                }
                
                // Create card elements
                cardPairs.forEach((icon, index) => {
                    const card = document.createElement('div');
                    card.className = 'card aspect-square animate__animated animate__fadeIn';
                    card.style.animationDelay = `${index * 0.05}s`;
                    card.dataset.icon = icon;
                    card.dataset.index = index;
                    
                    card.innerHTML = `
                        <div class="card-inner w-full h-full">
                            <div class="card-front">
                                <div class="card-logo"></div>
                            </div>
                            <div class="card-back">
                                <div class="card-icon">${icon}</div>
                            </div>
                        </div>
                    `;
                    
                    card.addEventListener('click', () => flipCard(card));
                    gameBoard.appendChild(card);
                });
            }
            
            function flipCard(card) {
                // Prevent flipping if already processing a pair or card is already flipped/matched
                if (isProcessing || card.classList.contains('flipped') || card.classList.contains('matched') || gameEnded) {
                    return;
                }
                
                // Start game timer on first flip
                if (!gameStarted) {
                    startGame();
                }
                
                // Flip the card
                card.classList.add('flipped');
                flippedCards.push(card);
                flipCount++;
                flipsDisplay.textContent = flipCount;
                
                // Check for match if two cards are flipped
                if (flippedCards.length === 2) {
                    isProcessing = true;
                    
                    const card1 = flippedCards[0];
                    const card2 = flippedCards[1];
                    
                    if (card1.dataset.icon === card2.dataset.icon) {
                        // Match found
                        setTimeout(() => {
                            card1.classList.add('matched');
                            card2.classList.add('matched');
                            card1.classList.add('animate__animated', 'animate__pulse');
                            card2.classList.add('animate__animated', 'animate__pulse');
                            flippedCards = [];
                            isProcessing = false;
                            matchedPairs++;
                            updateMatchesDisplay();
                            updateScore(true);
                            
                            // Check if level is complete
                            if (matchedPairs === totalPairs) {
                                levelComplete();
                            }
                        }, 500);
                    } else {
                        // No match
                        setTimeout(() => {
                            card1.classList.remove('flipped');
                            card2.classList.remove('flipped');
                            flippedCards = [];
                            isProcessing = false;
                            updateScore(false);
                        }, 1000);
                    }
                }
            }
            
            function startGame() {
                gameStarted = true;
                
                // Start countdown timer
                timerInterval = setInterval(() => {
                    timeLeft--;
                    updateTimeDisplay();
                    
                    if (timeLeft <= 0) {
                        // Time's up
                        clearInterval(timerInterval);
                        levelFailed();
                    }
                }, 1000);
            }
            
            function updateScore(isMatch) {
                // Score calculation based on matches and level
                if (isMatch) {
                    // Base points for a match (increases with level)
                    const basePoints = 100 * currentLevel;
                    
                    // Add to score
                    score += basePoints;
                } else {
                    // Small penalty for mismatches
                    score = Math.max(0, score - 10);
                }
                
                scoreDisplay.textContent = score;
            }
            
            function levelComplete() {
                gameEnded = true;
                clearInterval(timerInterval);
                
                // Calculate time bonus
                const timeBonus = timeLeft * 10 * currentLevel;
                
                // Update total stats
                totalScore += score + timeBonus;
                totalFlips += flipCount;
                totalMatches += matchedPairs;
                
                // Update level complete modal
                completedLevelDisplay.textContent = currentLevel;
                
                const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
                const seconds = (timeLeft % 60).toString().padStart(2, '0');
                levelTimeLeftDisplay.textContent = `${minutes}:${seconds}`;
                
                levelFlipsDisplay.textContent = flipCount;
                timeBonusDisplay.textContent = `+${timeBonus}`;
                levelScoreDisplay.textContent = score + timeBonus;
                
                // Show level complete modal after a short delay
                setTimeout(() => {
                    levelCompleteModal.classList.remove('hidden');
                }, 1000);
            }
            
            function levelFailed() {
                gameEnded = true;
                
                // Update level failed modal
                failedLevelDisplay.textContent = currentLevel;
                failedMatchesDisplay.textContent = `${matchedPairs}/${totalPairs}`;
                failedFlipsDisplay.textContent = flipCount;
                failedScoreDisplay.textContent = totalScore;
                
                // Show level failed modal
                levelFailedModal.classList.remove('hidden');
            }
            
            function startNextLevel() {
                // Check if all levels are completed
                if (currentLevel >= maxLevels) {
                    gameComplete();
                    return;
                }
                
                // Increment level
                currentLevel++;
                
                // Update level display
                updateLevelDisplay();
                
                // Start new level
                startLevel(currentLevel);
            }
            
            function restartLevel() {
                // Start the current level again
                startLevel(currentLevel);
            }
            
            function resetGame() {
                // Reset to level 1
                initGame();
            }
            
            function gameComplete() {
                // Update game complete modal
                totalLevelsDisplay.textContent = maxLevels;
                totalFlipsDisplay.textContent = totalFlips;
                totalMatchesDisplay.textContent = totalMatches;
                finalScoreDisplay.textContent = totalScore;
                const playerName = prompt("Enter your name for the leaderboard:");
pushScoreToFirebase(playerName || 'Anonymous', totalScore);
                
                // Show game complete modal
                gameCompleteModal.classList.remove('hidden');
            }
            function pushScoreToFirebase(playerName, score) {
  const leaderboardRef = firebase.database().ref('memoryflip/leaderboard');
  const newEntryRef = leaderboardRef.push();
  newEntryRef.set({
    name: playerName,
    score: score,
    timestamp: firebase.database.ServerValue.TIMESTAMP
  });
}
            function loadLeaderboard() {
  const leaderboardRef = firebase.database().ref('memoryflip/leaderboard');
  leaderboardRef.orderByChild('score').limitToLast(10).once('value', snapshot => {
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = '';
    const entries = [];
    snapshot.forEach(child => {
      entries.push(child.val());
    });
    entries.reverse(); // Highest first
    entries.forEach(entry => {
      const li = document.createElement('li');
      li.textContent = `${entry.name}: ${entry.score}`;
      leaderboardList.appendChild(li);
    });
  });
}
function pushScoreToFirebase(playerName, score) {
  const leaderboardRef = firebase.database().ref('memoryflip/leaderboard');
  const newEntryRef = leaderboardRef.push();
  newEntryRef.set({
    name: playerName,
    score: score,
    timestamp: firebase.database.ServerValue.TIMESTAMP
  });
}

// Call after DOMContentLoaded
loadLeaderboard();

            function showLevelNotification(level) {
                notificationLevelDisplay.textContent = level;
                
                // Set custom message based on level
                if (level === 1) {
                    notificationMessageDisplay.textContent = "Match all cards before time runs out!";
                } else if (level <= 3) {
                    notificationMessageDisplay.textContent = "More cards, but you can do it!";
                } else if (level <= 6) {
                    notificationMessageDisplay.textContent = "Getting tougher! Stay focused!";
                } else {
                    notificationMessageDisplay.textContent = "Master level! Good luck!";
                }
                function loadLeaderboard() {
  const leaderboardRef = firebase.database().ref('memoryflip/leaderboard');
  leaderboardRef.orderByChild('score').limitToLast(10).once('value', snapshot => {
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = '';
    const entries = [];
    snapshot.forEach(child => {
      entries.push(child.val());
    });
    entries.reverse(); // Highest first
    entries.forEach(entry => {
      const li = document.createElement('li');
      li.textContent = `${entry.name}: ${entry.score}`;
      leaderboardList.appendChild(li);
    });
  });
}

                // Show notification
                levelNotification.classList.remove('hidden');
                levelNotification.classList.add('animate__fadeIn');
                
                // Hide after 2 seconds
                setTimeout(() => {
                    levelNotification.classList.remove('animate__fadeIn');
                    levelNotification.classList.add('animate__fadeOut');
                    
                    setTimeout(() => {
                        levelNotification.classList.remove('animate__fadeOut');
                        levelNotification.classList.add('hidden');
                    }, 500);
                }, 2000);
            }
        });
(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'968f8745f0f18ee2',t:'MTc1NDE1ODE4OC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();