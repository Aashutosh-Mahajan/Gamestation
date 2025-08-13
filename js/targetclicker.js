 const gameArea = document.getElementById('gameArea');
    const scoreDisplay = document.getElementById('score');
    const timerDisplay = document.getElementById('timer');
    const levelDisplay = document.getElementById('level');
    const levelDisplayTop = document.getElementById('levelDisplay');
    const comboDisplay = document.getElementById('combo');
    const highScoreDisplay = document.getElementById('highScore');
    const levelProgressBar = document.getElementById('levelProgressBar');
    const startBtn = document.getElementById('startBtn');
    const endScreen = document.getElementById('endScreen');
    const finalScore = document.getElementById('finalScore');
    const levelComplete = document.getElementById('levelComplete');
    const performance = document.getElementById('performance');
    const powerUpIndicator = document.getElementById('powerUpIndicator');
    const comboDisplayCenter = document.getElementById('comboDisplay');

    let score = 0;
    let timeLeft = 60;
    let currentLevel = 1;
    let levelProgress = 0;
    let combo = 0;
    let maxCombo = 0;
    let gameInterval;
    let targetTimeout;
    let gameActive = false;
    let highScore = localStorage.getItem('targetClickerHighScore') || 0;
    let targetsHitInLevel = 0;
    let powerUpActive = false;
    let powerUpTimeLeft = 0;
    let targetSpeed = 1200;
    let multiTargets = false;

    // Level requirements and rewards
    const levels = {
      1: { requirement: 10, reward: 'Bonus Targets Unlocked!', speed: 1200 },
      2: { requirement: 25, reward: 'Speed Targets Added!', speed: 1000 },
      3: { requirement: 45, reward: 'Multi-Target Mode!', speed: 900 },
      4: { requirement: 70, reward: 'Mega Targets Appear!', speed: 800 },
      5: { requirement: 100, reward: 'Power-Up Frenzy!', speed: 700 },
      6: { requirement: 140, reward: 'Lightning Speed!', speed: 600 },
      7: { requirement: 190, reward: 'Master Level!', speed: 500 },
      8: { requirement: 250, reward: 'Legendary Status!', speed: 400 },
      9: { requirement: 320, reward: 'Ultimate Challenge!', speed: 350 },
      10: { requirement: 400, reward: 'CHAMPION MODE!', speed: 300 }
    };

    // Display saved high score
    highScoreDisplay.textContent = `Best: ${highScore}`;

    function randomPosition(size, max) {
      return Math.floor(Math.random() * (max - size));
    }

    function createScorePopup(x, y, points, type = 'normal') {
      const popup = document.createElement('div');
      popup.className = 'score-popup';
      popup.textContent = `+${points}`;
      popup.style.left = x + 'px';
      popup.style.top = y + 'px';
      
      if (type === 'bonus') popup.style.color = '#feca57';
      else if (type === 'mega') popup.style.color = '#a29bfe';
      else if (type === 'speed') popup.style.color = '#74b9ff';
      
      gameArea.appendChild(popup);
      
      setTimeout(() => {
        if (popup.parentNode) popup.remove();
      }, 1000);
    }

    function showCombo(comboCount) {
      if (comboCount >= 5) {
        comboDisplayCenter.textContent = `${comboCount}x COMBO!`;
        comboDisplayCenter.style.display = 'block';
        setTimeout(() => {
          comboDisplayCenter.style.display = 'none';
        }, 2000);
      }
    }

    function createTarget(type = 'normal') {
      const target = document.createElement('div');
      target.className = `target ${type}`;

      const areaWidth = gameArea.clientWidth;
      const areaHeight = gameArea.clientHeight;
      let size = 50;
      let points = 1;
      let lifetime = targetSpeed;

      switch (type) {
        case 'bonus':
          size = 60;
          points = 5;
          target.textContent = '★';
          lifetime = targetSpeed * 1.5;
          break;
        case 'speed':
          size = 40;
          points = 3;
          lifetime = targetSpeed * 0.6;
          break;
        case 'mega':
          size = 80;
          points = 10;
          target.textContent = '💎';
          lifetime = targetSpeed * 2;
          break;
        default:
          points = 1;
      }

      target.style.left = randomPosition(size, areaWidth) + 'px';
      target.style.top = randomPosition(size, areaHeight) + 'px';

      target.onclick = function(e) {
        if (!gameActive) return;
        
        e.stopPropagation();
        target.classList.add('hit');
        
        // Update score and combo
        let finalPoints = points;
        if (powerUpActive) finalPoints *= 2;
        
        score += finalPoints;
        combo++;
        maxCombo = Math.max(maxCombo, combo);
        targetsHitInLevel++;
        
        // Create score popup
        createScorePopup(
          parseInt(target.style.left) + size/2,
          parseInt(target.style.top) + size/2,
          finalPoints,
          type
        );
        
        updateDisplay();
        checkLevelUp();
        showCombo(combo);
        
        setTimeout(() => {
          if (target.parentNode) target.remove();
        }, 100);
      };

      gameArea.appendChild(target);

      // Remove target after lifetime
      setTimeout(() => {
        if (gameActive && target.parentNode) {
          target.remove();
          combo = 0; // Reset combo on miss
          updateDisplay();
        }
      }, lifetime);
    }

    function showTargets() {
      if (!gameActive) return;

      // Clear existing targets occasionally to prevent buildup
      const existingTargets = document.querySelectorAll('.target');
      if (existingTargets.length > 8) {
        existingTargets.forEach(target => target.remove());
      }

      // Determine target types based on level
      let targetType = 'normal';
      const rand = Math.random();

      if (currentLevel >= 2 && rand < 0.15) targetType = 'bonus';
      else if (currentLevel >= 3 && rand < 0.25) targetType = 'speed';
      else if (currentLevel >= 4 && rand < 0.1) targetType = 'mega';

      createTarget(targetType);

      // Multi-target mode for higher levels
      if (currentLevel >= 3 && Math.random() < 0.3) {
        setTimeout(() => createTarget(), 200);
      }

      // Schedule next target
      const nextTargetDelay = targetSpeed + (Math.random() * 300 - 150);
      targetTimeout = setTimeout(showTargets, Math.max(200, nextTargetDelay));
    }

    function updateDisplay() {
      scoreDisplay.textContent = `Score: ${score}`;
      levelDisplay.textContent = `Level: ${currentLevel}`;
      levelDisplayTop.textContent = `Level ${currentLevel}`;
      comboDisplay.textContent = `Combo: ${combo}`;
      
      // Update level progress
      const currentLevelReq = levels[currentLevel]?.requirement || 999;
      const progress = Math.min((targetsHitInLevel / (currentLevelReq - (levels[currentLevel - 1]?.requirement || 0))) * 100, 100);
      levelProgressBar.style.width = progress + '%';
    }

    function checkLevelUp() {
      const levelReq = levels[currentLevel]?.requirement;
      if (levelReq && score >= levelReq && currentLevel < 10) {
        currentLevel++;
        targetsHitInLevel = 0;
        targetSpeed = levels[currentLevel]?.speed || targetSpeed;
        
        // Activate power-up for 10 seconds
        activatePowerUp();
        
        // Show level up notification
        const levelUpDiv = document.createElement('div');
        levelUpDiv.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: linear-gradient(45deg, #00b894, #00cec9);
          color: white;
          padding: 1rem 2rem;
          border-radius: 15px;
          font-size: 1.5rem;
          font-weight: bold;
          z-index: 1000;
          animation: levelUpShow 3s ease-out forwards;
        `;
        levelUpDiv.textContent = `LEVEL ${currentLevel}! ${levels[currentLevel]?.reward || ''}`;
        gameArea.appendChild(levelUpDiv);
        
        setTimeout(() => {
          if (levelUpDiv.parentNode) levelUpDiv.remove();
        }, 3000);
      }
    }

    function activatePowerUp() {
      powerUpActive = true;
      powerUpTimeLeft = 10;
      powerUpIndicator.style.display = 'block';
      
      const powerUpInterval = setInterval(() => {
        powerUpTimeLeft--;
        powerUpIndicator.textContent = `⚡ DOUBLE POINTS ${powerUpTimeLeft}s`;
        
        if (powerUpTimeLeft <= 0) {
          powerUpActive = false;
          powerUpIndicator.style.display = 'none';
          clearInterval(powerUpInterval);
        }
      }, 1000);
    }

    function startGame() {
      score = 0;
      timeLeft = 60;
      currentLevel = 1;
      combo = 0;
      maxCombo = 0;
      targetsHitInLevel = 0;
      gameActive = true;
      targetSpeed = 1200;
      powerUpActive = false;
      
      updateDisplay();
      startBtn.style.display = 'none';
      endScreen.style.display = 'none';
      gameArea.innerHTML = '<div class="power-up-indicator" id="powerUpIndicator"></div><div class="combo-display" id="comboDisplay"></div>';
      
      // Re-get references after clearing innerHTML
      const newPowerUpIndicator = document.getElementById('powerUpIndicator');
      const newComboDisplay = document.getElementById('comboDisplay');
      
      showTargets();

      gameInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = 'Time: ' + timeLeft;
        if (timeLeft <= 0) {
          endGame();
        }
      }, 1000);
    }

    function endGame() {
      gameActive = false;
      clearInterval(gameInterval);
      clearTimeout(targetTimeout);
      gameArea.innerHTML = '<div class="power-up-indicator" id="powerUpIndicator"></div><div class="combo-display" id="comboDisplay"></div>';
      
      // Update high score
      if (score > highScore) {
        highScore = score;
        localStorage.setItem('targetClickerHighScore', highScore);
        highScoreDisplay.textContent = `Best: ${highScore}`;
      }
      
      finalScore.textContent = `Final Score: ${score}`;
      
      // Level completion message
      if (currentLevel >= 10) {
        levelComplete.innerHTML = '<div class="level-complete">🏆 CHAMPION! You\'ve mastered all levels!</div>';
      } else if (currentLevel >= 7) {
        levelComplete.innerHTML = '<div class="level-complete">🌟 LEGENDARY! Amazing performance!</div>';
      } else if (currentLevel >= 5) {
        levelComplete.innerHTML = '<div class="level-complete">⭐ EXPERT! You\'re getting really good!</div>';
      } else if (currentLevel >= 3) {
        levelComplete.innerHTML = '<div class="level-complete">🎯 SKILLED! Nice progression!</div>';
      } else {
        levelComplete.innerHTML = '';
      }
      
      // Performance feedback
      let performanceText = '';
      if (score >= 300) performanceText = '🏆 LEGENDARY! You\'re a clicking god!';
      else if (score >= 200) performanceText = '🌟 AMAZING! Incredible reflexes!';
      else if (score >= 120) performanceText = '⭐ EXCELLENT! You\'re really skilled!';
      else if (score >= 80) performanceText = '🎯 GREAT! Keep up the good work!';
      else if (score >= 50) performanceText = '👍 GOOD! You\'re improving!';
      else if (score >= 25) performanceText = '👌 NOT BAD! Practice makes perfect!';
      else performanceText = '💪 KEEP TRYING! You\'ll get better!';
      
      performanceText += `<br>Max Combo: ${maxCombo}x | Level Reached: ${currentLevel}`;
      performance.innerHTML = performanceText;
      
      endScreen.style.display = 'block';
      startBtn.style.display = 'inline-block';
    }

    startBtn.onclick = startGame;

    // Prevent context menu on right click in game area
    gameArea.addEventListener('contextmenu', e => e.preventDefault());

    // Add some visual flair on page load
    document.addEventListener('DOMContentLoaded', () => {
      updateDisplay();
    });
(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'969fb84b824c613f',t:'MTc1NDMyNzk2OS4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();