    function getRandomInt(max) {
        const array = new Uint32Array(1);
        window.crypto.getRandomValues(array);
        return array[0] % max;
    }

    class LightSyncGame {
        constructor() {
            this.sequence = [];
            this.playerSequence = [];
            this.score = 0;
            this.isPlaying = false;
            this.isPlayerTurn = false;

            this.buttons = document.querySelectorAll('.game-button');
            this.startButton = document.getElementById('startButton');
            this.scoreDisplay = document.getElementById('score');

            this.initEventListeners();
        }

        initEventListeners() {
            this.startButton.addEventListener('click', () => this.startGame());

            this.buttons.forEach(button => {
                button.addEventListener('click', (e) => {
                    if (this.isPlayerTurn) {
                        this.handlePlayerInput(e.target.dataset.color);
                    }
                });
            });
        }

        startGame() {
            this.sequence = [];
            this.playerSequence = [];
            this.score = 0;
            this.isPlaying = true;
            this.updateScore();
            this.startButton.textContent = 'PLAYING...';
            this.startButton.disabled = true;

            setTimeout(() => {
                this.nextRound();
            }, 1000);
        }

        nextRound() {
            this.playerSequence = [];
            this.addToSequence();
            this.playSequence();
        }

        addToSequence() {
            const colors = ['red', 'blue', 'green', 'yellow'];
            let randomColor;
            let attempts = 0;
            do {
                randomColor = colors[getRandomInt(colors.length)];
                attempts++;
            } while (
                this.sequence.slice(-2).every(c => c === randomColor) && attempts < 10
            );

            if (this.sequence.length > 5 && Math.random() < 0.1) {
                this.shuffleSequence();
            }

            this.sequence.push(randomColor);
        }

        shuffleSequence() {
            for (let i = this.sequence.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.sequence[i], this.sequence[j]] = [this.sequence[j], this.sequence[i]];
            }
        }

        playSequence() {
            this.isPlayerTurn = false;
            let delay = 0;

            this.sequence.forEach((color, index) => {
                setTimeout(() => {
                    this.lightUpButton(color);

                    if (index === this.sequence.length - 1) {
                        setTimeout(() => {
                            this.isPlayerTurn = true;
                        }, 600);
                    }
                }, delay);
                delay += 800;
            });
        }

        lightUpButton(color) {
            const button = document.querySelector(`[data-color="${color}"]`);
            button.classList.add('active');

            setTimeout(() => {
                button.classList.remove('active');
            }, 400);
        }

        handlePlayerInput(color) {
            this.playerSequence.push(color);
            this.lightUpButton(color);

            const currentIndex = this.playerSequence.length - 1;

            if (this.playerSequence[currentIndex] !== this.sequence[currentIndex]) {
                this.gameOver();
                return;
            }

            if (this.playerSequence.length === this.sequence.length) {
                this.score += 10;
                this.updateScore();
                this.isPlayerTurn = false;

                setTimeout(() => {
                    this.nextRound();
                }, 1000);
            }
        }

        gameOver() {
            this.isPlaying = false;
            this.isPlayerTurn = false;
            this.startButton.textContent = 'GAME OVER - RESTART';
            this.startButton.disabled = false;

            // Flash all buttons red briefly
            this.buttons.forEach(button => {
                button.style.background = 'linear-gradient(135deg, #ff4757, #ff3742)';
                setTimeout(() => {
                    button.style.background = '';
                }, 300);
            });
        }

        updateScore() {
            this.scoreDisplay.textContent = this.score;
        }
    }
    

    document.addEventListener('DOMContentLoaded', () => {
        new LightSyncGame();
    });
(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'968e9d37e31448da',t:'MTc1NDE0ODYwMS4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();