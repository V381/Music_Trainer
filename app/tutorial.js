const TutorialModule = (function() {
    const tutorialSteps = [
        {
            element: '.line1 img',
            title: 'Welcome to Music Trainer! 🎵',
            content: 'This app will help you learn to read sheet music. Let\'s get started with a quick tour!',
            position: 'bottom'
        },
        {
            element: '.treble img',
            title: 'The Treble Clef',
            content: 'This is the treble clef. It tells us which notes are on each line and space.',
            position: 'right'
        },
        {
            element: '.line1 img',
            title: 'The Note',
            content: 'This is your target note. Your goal is to identify which note it is!',
            position: 'bottom'
        },
        {
            element: '.zz',
            title: 'Note Buttons',
            content: 'Click these buttons or use your keyboard (A-G) to identify the note.',
            position: 'top'
        },
        {
            element: '.score',
            title: 'Your Score',
            content: 'Keep track of your correct (green) and incorrect (red) answers here.',
            position: 'left'
        },
        {
            element: '.newNote',
            title: 'New Note',
            content: 'Click here or press Space to get a new random note.',
            position: 'bottom'
        },
        {
            element: '.ledger',
            title: 'Ledger Lines',
            content: 'Toggle additional lines to practice notes outside the staff.',
            position: 'bottom'
        },
        {
            element: '.bassClef',
            title: 'Bass Clef',
            content: 'Switch between Treble and Bass clef to practice both.',
            position: 'bottom'
        },
        {
            element: '.challengeMode',
            title: 'Challenge Mode',
            content: 'Test your skills with timed challenges!',
            position: 'bottom'
        },
        {
            element: '.statsMenu',
            title: 'Statistics',
            content: 'Track your progress and see detailed stats about your practice.',
            position: 'left'
        }
    ];

    let currentStep = 0;
    let overlay;
    let tooltip;

    function createTutorialElements() {
        overlay = document.createElement('div');
        overlay.className = 'tutorial-overlay';
        
        tooltip = document.createElement('div');
        tooltip.className = 'tutorial-tooltip';
        
        document.body.appendChild(overlay);
        document.body.appendChild(tooltip);
    }

    function showStep(stepIndex) {
        const step = tutorialSteps[stepIndex];
        const element = document.querySelector(step.element);
        
        if (!element) return;

        const rect = element.getBoundingClientRect();
        element.classList.add('tutorial-highlight');
        
        tooltip.innerHTML = `
            <h3>${step.title}</h3>
            <p>${step.content}</p>
            <div class="tutorial-controls">
                <span class="tutorial-progress">${stepIndex + 1}/${tutorialSteps.length}</span>
                <div class="tutorial-buttons">
                    ${stepIndex > 0 ? '<button class="tutorial-prev">Previous</button>' : ''}
                    ${stepIndex < tutorialSteps.length - 1 
                        ? '<button class="tutorial-next">Next</button>'
                        : '<button class="tutorial-finish">Finish</button>'}
                </div>
            </div>
        `;

        positionTooltip(rect, step.position);

        const prevBtn = tooltip.querySelector('.tutorial-prev');
        const nextBtn = tooltip.querySelector('.tutorial-next');
        const finishBtn = tooltip.querySelector('.tutorial-finish');

        if (prevBtn) prevBtn.addEventListener('click', () => navigateStep(-1));
        if (nextBtn) nextBtn.addEventListener('click', () => navigateStep(1));
        if (finishBtn) finishBtn.addEventListener('click', endTutorial);
    }

    function positionTooltip(targetRect, position) {
        const tooltipRect = tooltip.getBoundingClientRect();
        const margin = 10;

        let top, left;

        switch (position) {
            case 'top':
                top = targetRect.top - tooltipRect.height - margin;
                left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
                break;
            case 'bottom':
                top = targetRect.bottom + margin;
                left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
                break;
            case 'left':
                top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
                left = targetRect.left - tooltipRect.width - margin;
                break;
            case 'right':
                top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
                left = targetRect.right + margin;
                break;
        }

        tooltip.style.top = `${Math.max(0, top)}px`;
        tooltip.style.left = `${Math.max(0, left)}px`;
    }

    function navigateStep(direction) {
        const currentElement = document.querySelector(tutorialSteps[currentStep].element);
        currentElement.classList.remove('tutorial-highlight');
        
        currentStep += direction;
        showStep(currentStep);
    }

    function endTutorial() {
        const currentElement = document.querySelector(tutorialSteps[currentStep].element);
        currentElement.classList.remove('tutorial-highlight');
        
        overlay.remove();
        tooltip.remove();
        
        localStorage.setItem('musicTrainerTutorialCompleted', 'true');
    }

    return {
        init() {
            if (localStorage.getItem('musicTrainerTutorialCompleted')) {
                return;
            }

            createTutorialElements();
            showStep(0);
        },

        reset() {
            localStorage.removeItem('musicTrainerTutorialCompleted');
            currentStep = 0;
            this.init();
        }
    };
})();