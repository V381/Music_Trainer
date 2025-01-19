const StatisticsModule = (function() {
    let stats = {
        totalAttempts: 0,
        correctAnswers: 0,
        challengeHistory: [],
        incorrectAnswers: 0,
        noteStats: {},
        sessionStartTime: null,
        practiceTime: 0,
        streaks: {
            current: 0,
            best: 0
        },
        recentAnswers: [],
        bestChallengeScore: {
            notesCompleted: 0,
            accuracy: 0,
            notesPerMinute: 0
        }
    };

    const MAX_RECENT_ANSWERS = 10;

    return {
        init() {
            stats = {
                totalAttempts: 0,
                correctAnswers: 0,
                incorrectAnswers: 0,
                noteStats: {},
                sessionStartTime: new Date(),
                practiceTime: 0,
                streaks: {
                    current: 0,
                    best: 0
                },
                recentAnswers: [],
                // Add these new properties
                challengeHistory: [],
                bestChallengeScore: {
                    notesCompleted: 0,
                    accuracy: 0,
                    notesPerMinute: 0
                }
            };
            
            // Load saved stats if they exist
            const savedStats = localStorage.getItem('musicTrainerStats');
            if (savedStats) {
                const parsedStats = JSON.parse(savedStats);
                // Ensure challengeHistory exists in loaded stats
                stats = {
                    ...parsedStats,
                    sessionStartTime: new Date(),
                    challengeHistory: parsedStats.challengeHistory || [],
                    bestChallengeScore: parsedStats.bestChallengeScore || {
                        notesCompleted: 0,
                        accuracy: 0,
                        notesPerMinute: 0
                    }
                };
            }
        
            this.initializeNoteStats();
            this.startPracticeTimer();
            this.updateStatsDisplay();
        },

        loadStats() {
            const savedStats = localStorage.getItem('musicTrainerStats');
            if (savedStats) {
                stats = JSON.parse(savedStats);
                stats.sessionStartTime = new Date();
            }
        },

        updateChallengeHistory() {
            const container = document.querySelector('.recent-activity');
            if (!container) return;
        
            // Ensure challengeHistory exists
            if (!stats.challengeHistory) {
                stats.challengeHistory = [];
                return;
            }
        
            // Add challenge results to recent activity
            stats.challengeHistory.forEach((challenge, index) => {
                if (index < 5) { // Show only last 5 challenges
                    const item = document.createElement('div');
                    item.className = 'activity-item challenge-result';
                    item.innerHTML = `
                        <div class="activity-icon">
                            <i class="fas fa-stopwatch"></i>
                        </div>
                        <div class="activity-details">
                            <span class="challenge-stats">
                                ${challenge.notesCompleted} notes | ${challenge.accuracy}% accuracy
                            </span>
                            <span class="timestamp">${this.getTimeAgo(new Date(challenge.date))}</span>
                        </div>
                    `;
                    container.appendChild(item);
                }
            });
        
            // Update best scores display if it exists
            const bestScoresContainer = document.querySelector('.best-challenge-scores');
            if (bestScoresContainer && stats.bestChallengeScore) {
                bestScoresContainer.innerHTML = `
                    <div class="stat-item">
                        <div class="stat-label">Best Notes Count</div>
                        <div class="stat-value">${stats.bestChallengeScore.notesCompleted}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Best Accuracy</div>
                        <div class="stat-value">${stats.bestChallengeScore.accuracy}%</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Best Notes/Min</div>
                        <div class="stat-value">${stats.bestChallengeScore.notesPerMinute}</div>
                    </div>
                `;
            }
        },

        saveChallengeResult(result) {
            if (!stats.challengeHistory) {
                stats.challengeHistory = [];
            }
            
            // Add the new result to challenge history
            stats.challengeHistory.unshift(result);
            
            // Keep only the last 10 challenges
            stats.challengeHistory = stats.challengeHistory.slice(0, 10);
            
            // Initialize bestChallengeScore if it doesn't exist
            if (!stats.bestChallengeScore) {
                stats.bestChallengeScore = {
                    notesCompleted: 0,
                    accuracy: 0,
                    notesPerMinute: 0
                };
            }
            
            // Update best scores if necessary
            if (result.notesCompleted > stats.bestChallengeScore.notesCompleted) {
                stats.bestChallengeScore.notesCompleted = result.notesCompleted;
            }
            if (result.accuracy > stats.bestChallengeScore.accuracy) {
                stats.bestChallengeScore.accuracy = result.accuracy;
            }
            if (result.notesPerMinute > stats.bestChallengeScore.notesPerMinute) {
                stats.bestChallengeScore.notesPerMinute = result.notesPerMinute;
            }
            
            // Add to recent activity
            if (!stats.recentAnswers) {
                stats.recentAnswers = [];
            }
            
            stats.recentAnswers.unshift({
                type: 'challenge',
                notesCompleted: result.notesCompleted,
                accuracy: result.accuracy,
                timestamp: new Date()
            });
            
            // Keep only last MAX_RECENT_ANSWERS items
            stats.recentAnswers = stats.recentAnswers.slice(0, MAX_RECENT_ANSWERS);
            
            this.saveStats();
            this.updateStatsDisplay();
            this.updateChallengeHistory();
        },
        

        saveStats() {
            localStorage.setItem('musicTrainerStats', JSON.stringify(stats));
            this.updateStatsDisplay(); // Update display whenever stats are saved
        },

        updateStatsDisplay() {
            // Update Accuracy
            const accuracyElement = document.querySelector('.accuracy-value');
            if (accuracyElement) {
                const accuracy = this.getOverallAccuracy();
                accuracyElement.textContent = `${accuracy.toFixed(1)}%`;
            }

            // Update Current Streak
            const currentStreakElement = document.querySelector('.current-streak');
            if (currentStreakElement) {
                currentStreakElement.textContent = stats.streaks.current;
            }

            // Update Best Streak
            const bestStreakElement = document.querySelector('.best-streak');
            if (bestStreakElement) {
                bestStreakElement.textContent = stats.streaks.best;
            }

            // Update Note Accuracy Chart
            this.updateNoteAccuracyChart();

            // Update Recent Activity
            this.updateRecentActivity();
        },

        updateNoteAccuracyChart() {
            const chartBars = document.querySelectorAll('.chart-bar');
            const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
            
            notes.forEach((note, index) => {
                const bar = chartBars[index];
                if (bar) {
                    const accuracy = this.getAccuracyForNote(note);
                    bar.style.height = `${accuracy}%`;
                    bar.style.backgroundColor = `hsl(${120 * (accuracy / 100)}, 70%, 50%)`;
                }
            });
        },

        updateRecentActivity() {
            const activityContainer = document.querySelector('.recent-activity');
            if (!activityContainer) return;
        
            activityContainer.innerHTML = '';
            
            stats.recentAnswers.slice(0, 5).forEach(answer => {
                const item = document.createElement('div');
                item.className = 'activity-item';
        
                switch(answer.type) {
                    case 'challenge':
                        item.innerHTML = `
                            <div class="activity-icon">
                                <i class="fas fa-stopwatch"></i>
                            </div>
                            <div class="activity-details">
                                <span class="challenge-stats">
                                    ${answer.notesCompleted} notes | ${answer.accuracy}% accuracy
                                </span>
                                <span class="timestamp">${this.getTimeAgo(new Date(answer.timestamp))}</span>
                            </div>
                        `;
                        break;
                    
                    case 'practice':
                    case 'challenge-note':
                        item.innerHTML = `
                            <div class="activity-icon ${answer.correct ? 'correct' : 'incorrect'}">
                                <i class="fas ${answer.correct ? 'fa-check' : 'fa-times'}"></i>
                            </div>
                            <div class="activity-details">
                                <span class="note-name">${answer.note}</span>
                                <span class="timestamp">${this.getTimeAgo(new Date(answer.timestamp))}</span>
                            </div>
                        `;
                        break;
                }
                
                activityContainer.appendChild(item);
            });
        },

        getTimeAgo(date) {
            const seconds = Math.floor((new Date() - date) / 1000);
            if (seconds < 60) return `${seconds}s ago`;
            if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
            return `${Math.floor(seconds / 3600)}h ago`;
        },

        recordAnswer(note, isCorrect, type = 'practice') {
            // Update base statistics
            stats.totalAttempts++;
            
            if (isCorrect) {
                stats.correctAnswers++;
                stats.streaks.current++;
                if (stats.streaks.current > stats.streaks.best) {
                    stats.streaks.best = stats.streaks.current;
                }
            } else {
                stats.incorrectAnswers++;
                stats.streaks.current = 0;
            }
        
            const baseNote = note ? note.replace(/\d+/g, '') : note;
            if (!stats.noteStats[baseNote]) {
                stats.noteStats[baseNote] = { attempts: 0, correct: 0, incorrect: 0 };
            }
        
            if (type === 'practice' && baseNote) {
                stats.noteStats[baseNote].attempts++;
                if (isCorrect) {
                    stats.noteStats[baseNote].correct++;
                } else {
                    stats.noteStats[baseNote].incorrect++;
                }
            }
        
            if (!stats.recentAnswers) {
                stats.recentAnswers = [];
            }
        
            if (type === 'practice') {
                stats.recentAnswers.unshift({
                    type: 'practice',
                    note: baseNote || 'Unknown',
                    correct: isCorrect,
                    timestamp: new Date()
                });
            } else if (type === 'challenge-note') {
                stats.recentAnswers.unshift({
                    type: 'challenge-note',
                    note: baseNote || 'Unknown',
                    correct: isCorrect,
                    timestamp: new Date()
                });
            } else if (type === 'challenge') {
                stats.recentAnswers.unshift({
                    type: 'challenge',
                    notesCompleted: note.notesCompleted,
                    accuracy: note.accuracy,
                    timestamp: new Date()
                });
            }
        
            // Keep only the most recent answers
            stats.recentAnswers = stats.recentAnswers.slice(0, MAX_RECENT_ANSWERS);
        
            // Save and update display
            this.saveStats();
            this.updateStatsDisplay();
        },

        getAccuracyForNote(note) {
            const noteStats = stats.noteStats[note];
            if (!noteStats || noteStats.attempts === 0) return 0;
            return (noteStats.correct / noteStats.attempts) * 100;
        },

        getOverallAccuracy() {
            if (stats.totalAttempts === 0) return 0;
            return (stats.correctAnswers / stats.totalAttempts) * 100;
        },

        resetStats() {
            stats = {
                totalAttempts: 0,
                correctAnswers: 0,
                incorrectAnswers: 0,
                noteStats: {},
                sessionStartTime: new Date(),
                practiceTime: 0,
                streaks: {
                    current: 0,
                    best: 0
                },
                recentAnswers: [],
                challengeHistory: [],
                bestChallengeScore: {
                    notesCompleted: 0,
                    accuracy: 0,
                    notesPerMinute: 0
                }
            };
            this.initializeNoteStats();
            this.saveStats();
            this.updateStatsDisplay();
        },

        initializeNoteStats() {
            ['C', 'D', 'E', 'F', 'G', 'A', 'B'].forEach(note => {
                if (!stats.noteStats[note]) {
                    stats.noteStats[note] = {
                        attempts: 0,
                        correct: 0,
                        incorrect: 0
                    };
                }
            });
        },

        startPracticeTimer() {
            setInterval(() => {
                stats.practiceTime = Math.floor((new Date() - stats.sessionStartTime) / 1000);
                const timeDisplay = document.querySelector('.practice-time');
                if (timeDisplay) {
                    const hours = Math.floor(stats.practiceTime / 3600);
                    const minutes = Math.floor((stats.practiceTime % 3600) / 60);
                    const seconds = stats.practiceTime % 60;
                    timeDisplay.textContent = 
                        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                }
            }, 1000);
        }
    };
})();

const NoteAccuracyChart = {
    init() {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js';
        script.onload = () => this.createChart();
        document.head.appendChild(script);
    },

    createChart() {
        const container = document.querySelector('.stats-section:nth-child(2)');
        if (!container) return;

        container.innerHTML = `
            <h3>Note Accuracy</h3>
            <div class="note-accuracy-chart"></div>
            <div class="chart-legend">
                <div class="legend-item">
                    <div class="legend-color excellent"></div>
                    <span>80-100% Excellent</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color good"></div>
                    <span>60-79% Good</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color fair"></div>
                    <span>40-59% Fair</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color poor"></div>
                    <span>0-39% Needs Practice</span>
                </div>
            </div>
        `;

        this.setupD3Chart();
    },

    setupD3Chart() {
        const chartContainer = document.querySelector('.note-accuracy-chart');
        const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

        const margin = { top: 40, right: 30, bottom: 50, left: 50 };
        const width = chartContainer.clientWidth - margin.left - margin.right;
        const height = 250 - margin.top - margin.bottom;  

        const svg = d3.select('.note-accuracy-chart')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        this.x = d3.scaleBand()
            .range([0, width])
            .padding(0.4)  
            .domain(notes);

        this.y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, 100]);

        svg.append('g')
            .attr('class', 'x-axis axis')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(this.x))
            .selectAll('text')
            .style('text-anchor', 'middle');

        svg.append('g')
            .attr('class', 'y-axis axis')
            .call(d3.axisLeft(this.y)
                .ticks(5)
                .tickFormat(d => `${d}%`));

        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0 - margin.left + 15)
            .attr('x', 0 - (height / 2))
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .style('fill', '#cbcbcb')
            .style('font-size', '12px')
            .text('Accuracy');

        this.svg = svg;
        this.height = height;
        this.width = width;

        svg.append('g')
            .attr('class', 'grid')
            .call(d3.axisLeft(this.y)
                .ticks(5)
                .tickSize(-width)
                .tickFormat(''))
            .style('stroke', '#333')
            .style('stroke-opacity', '0.1');

        this.updateChart();
        this.startUpdateInterval();
    },

    updateChart() {
        const savedStats = localStorage.getItem('musicTrainerStats');
        if (!savedStats) return;

        const stats = JSON.parse(savedStats);
        const noteStats = stats.noteStats || {};

        const data = ['C', 'D', 'E', 'F', 'G', 'A', 'B'].map(note => ({
            note,
            accuracy: noteStats[note] ? 
                Math.round((noteStats[note].correct / noteStats[note].attempts) * 100) || 0 : 0
        }));

        const bars = this.svg.selectAll('.bar')
            .data(data);

        bars.exit().remove();

        bars.transition()
            .duration(750)
            .ease(d3.easeQuadOut)
            .attr('y', d => this.y(d.accuracy))
            .attr('height', d => this.height - this.y(d.accuracy))
            .attr('fill', d => this.getColor(d.accuracy));

        bars.enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => this.x(d.note))
            .attr('width', this.x.bandwidth())
            .attr('y', this.height)
            .attr('height', 0)
            .attr('fill', d => this.getColor(d.accuracy))
            .transition()
            .duration(750)
            .ease(d3.easeQuadOut)
            .attr('y', d => this.y(d.accuracy))
            .attr('height', d => this.height - this.y(d.accuracy));

        const labels = this.svg.selectAll('.bar-label')
            .data(data);

        labels.exit().remove();

        labels.transition()
            .duration(750)
            .attr('y', d => this.y(d.accuracy) - 5)
            .text(d => (d.accuracy > 0 ? `${d.accuracy}%` : ''));

        labels.enter()
            .append('text')
            .attr('class', 'bar-label')
            .attr('x', d => this.x(d.note) + this.x.bandwidth() / 2)
            .attr('y', d => this.y(d.accuracy) - 5)
            .text(d => (d.accuracy > 0 ? `${d.accuracy}%` : ''));
    },

    getColor(accuracy) {
        if (accuracy >= 80) return '#4CAF50';  // Excellent - Green
        if (accuracy >= 60) return '#8BC34A';  // Good - Light Green
        if (accuracy >= 40) return '#FFC107';  // Fair - Yellow
        return '#FF5722';  // Needs Practice - Orange/Red
    },

    updateChart() {
        const savedStats = localStorage.getItem('musicTrainerStats');
        if (!savedStats) return;

        const stats = JSON.parse(savedStats);
        const noteStats = stats.noteStats || {};

        const data = ['C', 'D', 'E', 'F', 'G', 'A', 'B'].map(note => ({
            note,
            accuracy: noteStats[note] ? 
                Math.round((noteStats[note].correct / noteStats[note].attempts) * 100) || 0 : 0
        }));

        const bars = this.svg.selectAll('.bar')
            .data(data);

        bars.exit().remove();

        bars.transition()
            .duration(750)
            .attr('y', d => this.y(d.accuracy))
            .attr('height', d => this.height - this.y(d.accuracy))
            .attr('fill', d => this.getColor(d.accuracy));

        bars.enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => this.x(d.note))
            .attr('width', this.x.bandwidth())
            .attr('y', this.height)
            .attr('height', 0)
            .attr('fill', d => this.getColor(d.accuracy))
            .transition()
            .duration(750)
            .attr('y', d => this.y(d.accuracy))
            .attr('height', d => this.height - this.y(d.accuracy));

        const labels = this.svg.selectAll('.bar-label')
            .data(data);

        labels.exit().remove();

        labels.transition()
            .duration(750)
            .attr('y', d => this.y(d.accuracy) - 5)
            .text(d => `${d.accuracy}%`);

        labels.enter()
            .append('text')
            .attr('class', 'bar-label')
            .attr('x', d => this.x(d.note) + this.x.bandwidth() / 2)
            .attr('y', d => this.y(d.accuracy) - 5)
            .text(d => `${d.accuracy}%`);
    },

    startUpdateInterval() {
        setInterval(() => this.updateChart(), 1000);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    NoteAccuracyChart.init();
});