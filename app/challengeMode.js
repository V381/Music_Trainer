const ChallengeMode = (function() {
    let isActive = false;
    let timeLeft = 60; // 1 minute challenge
    let timerInterval;
    let notesCompleted = 0;
    let correctAnswers = 0;
    
    const CHALLENGE_DURATION = 60; // seconds
    
    return {
        init() {
            const challengeBtn = document.querySelector('.challengeMode');
            challengeBtn.addEventListener('click', () => this.toggleChallenge());
            
            // Add keyboard shortcut (press 'T' for timer challenge)
            document.addEventListener('keydown', (e) => {
                if (e.key.toLowerCase() === 't' && !isActive) {
                    this.toggleChallenge();
                }
            });
        },
        
        toggleChallenge() {
            if (isActive) return; // Prevent starting new challenge while one is active
            
            isActive = true;
            timeLeft = CHALLENGE_DURATION;
            notesCompleted = 0;
            correctAnswers = 0;
            
            // Show timer and reset display
            const timerContainer = document.querySelector('.timer-container');
            const challengeStats = document.querySelector('.challenge-stats');
            timerContainer.classList.remove('hidden');
            challengeStats.classList.remove('hidden');
            this.updateDisplay();
            
            // Start timer
            timerInterval = setInterval(() => {
                timeLeft--;
                this.updateDisplay();
                
                if (timeLeft <= 0) {
                    this.endChallenge();
                }
            }, 1000);
            
            // Reset score for the challenge
            document.querySelector('.positive > p').textContent = '0';
            document.querySelector('.negative > p').textContent = '0';
            
            // Generate first note
            Module.randomAlgorithm();
        },
        
        updateDisplay() {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            
            document.querySelector('.timer .minutes').textContent = 
                minutes.toString().padStart(2, '0');
            document.querySelector('.timer .seconds').textContent = 
                seconds.toString().padStart(2, '0');
            
            document.querySelector('.notes-completed span').textContent = 
                notesCompleted;
            document.querySelector('.accuracy span').textContent = 
                `${correctAnswers === 0 ? 0 : Math.round((correctAnswers / notesCompleted) * 100)}%`;
        },
        
        recordAnswer(isCorrect) {
            if (!isActive) return;
            
            notesCompleted++;
            if (isCorrect) correctAnswers++;
            this.updateDisplay();
        },
        
        endChallenge() {
            isActive = false;
            clearInterval(timerInterval);
        
            // Calculate final results
            const finalResults = {
                notesCompleted: notesCompleted,
                correctAnswers: correctAnswers,
                accuracy: correctAnswers === 0 ? 0 : Math.round((correctAnswers / notesCompleted) * 100),
                notesPerMinute: Math.round(notesCompleted)
            };
        
            // Create results modal
            const modal = document.createElement('div');
            modal.className = 'challenge-results-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h2>Challenge Complete!</h2>
                    <div class="results">
                        <p>Notes Completed: ${finalResults.notesCompleted}</p>
                        <p>Correct Answers: ${finalResults.correctAnswers}</p>
                        <p>Accuracy: ${finalResults.accuracy}%</p>
                        <p>Notes Per Minute: ${finalResults.notesPerMinute}</p>
                    </div>
                    <button class="close-modal">Close</button>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Hide timer
            document.querySelector('.timer-container').classList.add('hidden');
            
            // Add modal close handler
            modal.querySelector('.close-modal').addEventListener('click', () => {
                modal.remove();
            });
            
            // Save challenge results to statistics
            StatisticsModule.saveChallengeResult({
                notesCompleted: finalResults.notesCompleted,
                correctAnswers: finalResults.correctAnswers,
                accuracy: finalResults.accuracy,
                notesPerMinute: finalResults.notesPerMinute,
                date: new Date(),
                type: 'challenge'  // Add this type identifier
            });
        },
        
        isInProgress() {
            return isActive;
        }
    };
})();

// Initialize challenge mode
document.addEventListener('DOMContentLoaded', () => {
    ChallengeMode.init();
});