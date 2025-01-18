const AnimationModule = (function() {
    const animationConfig = {
        correctDuration: 600,
        incorrectDuration: 400,
        scoreUpdateDuration: 500,
        feedbackDuration: 1000
    };

    const createFeedbackOverlay = () => {
        const overlay = document.createElement('div');
        overlay.className = 'feedback-overlay';
        document.body.appendChild(overlay);
        return overlay;
    };

    return {
        init() {
            if (!document.querySelector('.feedback-overlay')) {
                createFeedbackOverlay();
            }
            this.setupNoteButtonAnimations();
        },

        animateCorrectAnswer(noteElement) {
            return new Promise((resolve) => {
                noteElement.classList.add('correct-answer');
                this.createParticles(noteElement, 'correct');
                setTimeout(() => {
                    noteElement.classList.remove('correct-answer');
                    resolve();
                }, animationConfig.correctDuration);
            });
        },

        animateIncorrectAnswer(noteElement) {
            return new Promise((resolve) => {
                noteElement.classList.add('incorrect-answer');
                setTimeout(() => {
                    noteElement.classList.remove('incorrect-answer');
                    resolve();
                }, animationConfig.incorrectDuration);
            });
        },

        animateScore(scoreElement, isPositive) {
            scoreElement.classList.add('score-update');
            scoreElement.style.color = isPositive ? '#28a745' : '#dc3545';
            
            setTimeout(() => {
                scoreElement.classList.remove('score-update');
                setTimeout(() => {
                    scoreElement.style.color = isPositive ? 'green' : 'red';
                }, 200);
            }, animationConfig.scoreUpdateDuration);
        },

        showFeedback(isCorrect, note = '') {
            const overlay = document.querySelector('.feedback-overlay') || createFeedbackOverlay();
            const message = isCorrect ? '✨ Correct! ✨' : `❌ Incorrect! The note was ${note}`;
            
            overlay.className = `feedback-overlay ${isCorrect ? 'correct' : 'incorrect'}`;
            overlay.textContent = message;
            overlay.classList.add('show');

            setTimeout(() => {
                overlay.classList.remove('show');
            }, animationConfig.feedbackDuration);
        },

        createParticles(element, type) {
            const rect = element.getBoundingClientRect();
            const particleCount = 12;

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = `particle ${type}-particle`;
                particle.style.left = rect.left + rect.width / 2 + 'px';
                particle.style.top = rect.top + rect.height / 2 + 'px';
                
                const angle = (i / particleCount) * 360;
                const velocity = 2 + Math.random() * 2;
                particle.style.setProperty('--angle', angle + 'deg');
                particle.style.setProperty('--velocity', velocity);

                document.body.appendChild(particle);
                
                setTimeout(() => {
                    particle.remove();
                }, 1000);
            }
        },

        setupNoteButtonAnimations() {
            const noteButtons = document.querySelectorAll('.zz li');
            noteButtons.forEach(button => {
                button.addEventListener('mousedown', () => {
                    button.classList.add('clicked');
                });
                
                button.addEventListener('mouseup', () => {
                    button.classList.remove('clicked');
                });
                
                button.addEventListener('mouseleave', () => {
                    button.classList.remove('clicked');
                });
            });
        },

        animateNoteTransition(oldNote, newNote) {
            return new Promise((resolve) => {
                oldNote.style.opacity = '1';
                oldNote.style.transform = 'scale(1)';

                oldNote.style.opacity = '0';
                oldNote.style.transform = 'scale(0.8)';

                setTimeout(() => {
                    oldNote.src = newNote.src;
                    oldNote.className = newNote.className;
                    
                    oldNote.style.opacity = '1';
                    oldNote.style.transform = 'scale(1)';
                    resolve();
                }, 300);
            });
        },

        shakeEffect(element) {
            element.classList.add('shake');
            setTimeout(() => {
                element.classList.remove('shake');
            }, 500);
        },

        pulseEffect(element) {
            element.classList.add('pulse');
            setTimeout(() => {
                element.classList.remove('pulse');
            }, 500);
        }
    };
})();

