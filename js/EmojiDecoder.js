 // Game data
        const questions = [
            { emojis: "🧊🚢🌊", answer: "titanic", category: "Movie" },
            { emojis: "🧠🛑", answer: "brain freeze", category: "Phrase" },
            { emojis: "🌟⚔️", answer: "star wars", category: "Movie" },
            { emojis: "🍎📱", answer: "iphone", category: "Technology" },
            { emojis: "🦁👑", answer: "lion king", category: "Movie" },
            { emojis: "🕷️👨", answer: "spider man", category: "Superhero" },
            { emojis: "🌙🌟", answer: "moonlight", category: "Word" },
            { emojis: "🔥🚒", answer: "fire truck", category: "Vehicle" },
            { emojis: "🎂🎉", answer: "birthday", category: "Celebration" },
            { emojis: "☀️🌻", answer: "sunflower", category: "Nature" },
            { emojis: "🍕🇮🇹", answer: "pizza", category: "Food" },
            { emojis: "🏠🔑", answer: "house key", category: "Object" },
            { emojis: "🌈☔", answer: "rainbow", category: "Weather" },
            { emojis: "🎵🎤", answer: "karaoke", category: "Activity" },
            { emojis: "🐝🍯", answer: "honey", category: "Food" },
            { emojis: "📚🎓", answer: "graduation", category: "Education" },
            { emojis: "🚗💨", answer: "fast car", category: "Vehicle" },
            { emojis: "🌊🏄", answer: "surfing", category: "Sport" },
            { emojis: "🎪🤡", answer: "circus", category: "Entertainment" },
            { emojis: "⚡🌩️", answer: "lightning", category: "Weather" }
        ];

        let currentQuestionIndex = 0;
        let score = 0;
        let gameStarted = false;

        function showRules() {
            document.getElementById('welcomeScreen').classList.add('hidden');
            document.getElementById('rulesScreen').classList.remove('hidden');
        }

        function startGame() {
            document.getElementById('rulesScreen').classList.add('hidden');
            document.getElementById('gameScreen').classList.remove('hidden');
            gameStarted = true;
            currentQuestionIndex = 0;
            score = 0;
            updateScore();
            loadQuestion();
        }

        function loadQuestion() {
            const question = questions[currentQuestionIndex];
            document.getElementById('emojiDisplay').textContent = question.emojis;
            document.getElementById('category').textContent = question.category;

            document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
            document.getElementById('guessInput').value = '';
            document.getElementById('guessInput').focus();
            
            // Reset UI
            document.getElementById('feedback').classList.add('hidden');
            document.getElementById('nextBtn').classList.add('hidden');
            document.getElementById('submitBtn').classList.remove('hidden');
            document.getElementById('guessInput').disabled = false;
            
            // Update progress bar
            const progress = ((currentQuestionIndex) / questions.length) * 100;
            document.getElementById('progressBar').style.width = progress + '%';
        }

        function handleKeyPress(event) {
            if (event.key === 'Enter') {
                submitGuess();
            }
        }

        function submitGuess() {
            const guess = document.getElementById('guessInput').value.toLowerCase().trim();
            const correctAnswer = questions[currentQuestionIndex].answer.toLowerCase();
            const feedback = document.getElementById('feedback');
            
            if (!guess) {
                alert('Please enter a guess!');
                return;
            }
            
            feedback.classList.remove('hidden');
            document.getElementById('submitBtn').classList.add('hidden');
            document.getElementById('guessInput').disabled = true;
            
            if (guess === correctAnswer) {
                score++;
                feedback.innerHTML = `
                    <div class="success-gradient text-white p-4 rounded-2xl pulse-animation">
                        <div class="text-3xl mb-2">🎉 Correct!</div>
                        <div class="poppins text-lg">Great job! The answer was "${questions[currentQuestionIndex].answer}"</div>
                    </div>
                `;
                updateScore();
            } else {
                feedback.innerHTML = `
                    <div class="bg-red-500 text-white p-4 rounded-2xl">
                        <div class="text-3xl mb-2">❌ Not quite!</div>
                        <div class="poppins text-lg">The correct answer was "${questions[currentQuestionIndex].answer}"</div>
                    </div>
                `;
            }
            
            if (currentQuestionIndex < questions.length - 1) {
                document.getElementById('nextBtn').classList.remove('hidden');
            } else {
                setTimeout(endGame, 2000);
            }
        }

        function nextQuestion() {
            currentQuestionIndex++;
            loadQuestion();
        }

        function updateScore() {
            document.getElementById('score').textContent = score;
        }

        function endGame() {
            document.getElementById('gameScreen').classList.add('hidden');
            document.getElementById('finalScreen').classList.remove('hidden');
            document.getElementById('finalScore').textContent = `${score}/${questions.length}`;
            
            let message = '';
            const percentage = (score / questions.length) * 100;
            
            if (percentage === 100) {
                message = "🏆 Perfect! You're an Emoji Master!";
            } else if (percentage >= 80) {
                message = "🌟 Excellent! You really know your emojis!";
            } else if (percentage >= 60) {
                message = "👍 Good job! Keep practicing!";
            } else if (percentage >= 40) {
                message = "🤔 Not bad! Try again to improve!";
            } else {
                message = "💪 Keep trying! Practice makes perfect!";
            }
            
            document.getElementById('scoreMessage').textContent = message;
        }

        function restartGame() {
            document.getElementById('finalScreen').classList.add('hidden');
            document.getElementById('welcomeScreen').classList.remove('hidden');
            currentQuestionIndex = 0;
            score = 0;
            gameStarted = false;
        }

        function shareScore() {
            const text = `I just scored ${score}/${questions.length} on the Emoji Decoder Game! 🎉 Can you beat my score? 🧩`;
            if (navigator.share) {
                navigator.share({
                    title: 'Emoji Decoder Game Score',
                    text: text
                });
            } else {
                // Fallback for browsers that don't support Web Share API
                navigator.clipboard.writeText(text).then(() => {
                    alert('Score copied to clipboard! Share it with your friends! 📋');
                });
            }
        }
(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'969e5540e6c0cc07',t:'MTc1NDMxMzQyNi4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();
