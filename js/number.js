        class NumberSlideGame {
            constructor() {
                this.grid = [];
                this.emptyPos = { row: 3, col: 3 };
                this.moves = 0;
                this.timer = 0;
                this.timerInterval = null;
                this.gameStarted = false;
                this.difficulty = 'easy';
                
                this.initializeGame();
                this.setupEventListeners();
            }

            initializeGame() {
                // Create solved state
                this.grid = [
                    [1, 2, 3, 4],
                    [5, 6, 7, 8],
                    [9, 10, 11, 12],
                    [13, 14, 15, 0]
                ];
                this.renderGrid();
                this.updateStats();
            }

            setupEventListeners() {
                document.getElementById('startBtn').addEventListener('click', () => this.startGame());
                document.getElementById('shuffleBtn').addEventListener('click', () => this.shuffleGrid());
                document.getElementById('restartBtn').addEventListener('click', () => this.restartGame());
                
                // Difficulty selector
                document.querySelectorAll('.difficulty-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
                        e.target.classList.add('active');
                        this.difficulty = e.target.dataset.difficulty;
                    });
                });
            }

            renderGrid() {
                const gridElement = document.getElementById('puzzleGrid');
                gridElement.innerHTML = '';

                for (let row = 0; row < 4; row++) {
                    for (let col = 0; col < 4; col++) {
                        const tile = document.createElement('button');
                        const value = this.grid[row][col];
                        
                        if (value === 0) {
                            tile.className = 'tile empty-tile';
                            tile.textContent = '';
                        } else {
                            tile.className = `tile tile-${value}`;
                            tile.textContent = value;
                            tile.addEventListener('click', () => this.moveTile(row, col));
                        }
                        
                        gridElement.appendChild(tile);
                    }
                }
            }

            moveTile(row, col) {
                if (!this.gameStarted) return;

                const value = this.grid[row][col];
                if (value === 0) return;

                // Check if tile is adjacent to empty space
                const rowDiff = Math.abs(row - this.emptyPos.row);
                const colDiff = Math.abs(col - this.emptyPos.col);
                
                if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
                    // Swap tile with empty space
                    this.grid[this.emptyPos.row][this.emptyPos.col] = value;
                    this.grid[row][col] = 0;
                    this.emptyPos = { row, col };
                    
                    this.moves++;
                    this.updateStats();
                    this.renderGrid();
                    
                    if (this.checkWin()) {
                        this.gameWon();
                    }
                }
            }

            shuffleGrid() {
                const shuffleCount = this.difficulty === 'easy' ? 50 : 
                                   this.difficulty === 'medium' ? 100 : 200;
                
                // Perform random valid moves to shuffle
                for (let i = 0; i < shuffleCount; i++) {
                    const validMoves = this.getValidMoves();
                    if (validMoves.length > 0) {
                        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
                        const value = this.grid[randomMove.row][randomMove.col];
                        this.grid[this.emptyPos.row][this.emptyPos.col] = value;
                        this.grid[randomMove.row][randomMove.col] = 0;
                        this.emptyPos = randomMove;
                    }
                }
                
                this.renderGrid();
            }

            getValidMoves() {
                const moves = [];
                const directions = [
                    { row: -1, col: 0 }, { row: 1, col: 0 },
                    { row: 0, col: -1 }, { row: 0, col: 1 }
                ];
                
                directions.forEach(dir => {
                    const newRow = this.emptyPos.row + dir.row;
                    const newCol = this.emptyPos.col + dir.col;
                    
                    if (newRow >= 0 && newRow < 4 && newCol >= 0 && newCol < 4) {
                        moves.push({ row: newRow, col: newCol });
                    }
                });
                
                return moves;
            }

            startGame() {
                this.shuffleGrid();
                this.gameStarted = true;
                this.moves = 0;
                this.timer = 0;
                this.updateStats();
                this.startTimer();
                document.getElementById('winMessage').style.display = 'none';
                document.getElementById('startBtn').textContent = '🎮 Game Started!';
                document.getElementById('startBtn').style.opacity = '0.7';
            }

            startTimer() {
                if (this.timerInterval) clearInterval(this.timerInterval);
                
                this.timerInterval = setInterval(() => {
                    this.timer++;
                    this.updateStats();
                }, 1000);
            }

            stopTimer() {
                if (this.timerInterval) {
                    clearInterval(this.timerInterval);
                    this.timerInterval = null;
                }
            }

            restartGame() {
                this.stopTimer();
                this.gameStarted = false;
                this.moves = 0;
                this.timer = 0;
                this.initializeGame();
                document.getElementById('winMessage').style.display = 'none';
                document.getElementById('startBtn').textContent = '🎮 Start Sliding';
                document.getElementById('startBtn').style.opacity = '1';
            }

            updateStats() {
                const minutes = Math.floor(this.timer / 60);
                const seconds = this.timer % 60;
                document.getElementById('timer').textContent = 
                    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                document.getElementById('moves').textContent = this.moves;
            }

            checkWin() {
                const target = [
                    [1, 2, 3, 4],
                    [5, 6, 7, 8],
                    [9, 10, 11, 12],
                    [13, 14, 15, 0]
                ];
                
                for (let row = 0; row < 4; row++) {
                    for (let col = 0; col < 4; col++) {
                        if (this.grid[row][col] !== target[row][col]) {
                            return false;
                        }
                    }
                }
                return true;
            }

            gameWon() {
                this.gameStarted = false;
                this.stopTimer();
                document.getElementById('winMessage').style.display = 'block';
                document.getElementById('startBtn').textContent = '🎮 Start Sliding';
                document.getElementById('startBtn').style.opacity = '1';
            }
        }

        // Initialize the game when page loads
        document.addEventListener('DOMContentLoaded', () => {
            new NumberSlideGame();
        });
