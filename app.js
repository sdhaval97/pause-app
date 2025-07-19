// Main application logic
class HabitBreaker {
    constructor() {
        this.sessionCount = parseInt(localStorage.getItem('sessionCount') || '0');
        this.totalMinutes = parseInt(localStorage.getItem('totalMinutes') || '0');
        this.streakDays = parseInt(localStorage.getItem('streakDays') || '0');
        this.currentTimer = null;
        this.isTimerRunning = false;
        
        // Initialize dashboard data tracker
        this.dashboardData = new DashboardData();
        
        this.init();
    }
    
    init() {
        this.updateStats();
        this.updateStreak();
        this.bindEvents();
    }
    
    bindEvents() {
        // Make functions available globally for onclick handlers
        window.startActivity = () => this.startActivity();
        window.completeActivity = () => this.completeActivity();
        
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isTimerRunning) {
                this.completeActivity();
            }
            if (e.key === ' ' && !this.isTimerRunning) {
                e.preventDefault();
                this.startActivity();
            }
        });
    }
    
    updateStats() {
        document.getElementById('totalSessions').textContent = this.sessionCount;
        document.getElementById('totalMinutes').textContent = this.totalMinutes;
        document.getElementById('streakDays').textContent = this.streakDays;
    }
    
    updateStreak() {
        const lastSession = localStorage.getItem('lastSessionDate');
        const today = new Date().toDateString();
        
        if (lastSession === today) {
            // Already had a session today, don't update streak
            return;
        }
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastSession === yesterday.toDateString()) {
            // Continuing streak
            this.streakDays++;
        } else if (lastSession !== null) {
            // Broke streak
            this.streakDays = 1;
        } else {
            // First session
            this.streakDays = 1;
        }
        
        localStorage.setItem('streakDays', this.streakDays.toString());
        localStorage.setItem('lastSessionDate', today);
    }
    
    getRandomActivity() {
        const isReading = Math.random() < 0.5;
        const activities = isReading ? readingMaterials : meditations;
        return activities[Math.floor(Math.random() * activities.length)];
    }
    
    startActivity() {
        if (this.isTimerRunning) return;
        
        const activity = this.getRandomActivity();
        
        // Setup activity screen
        document.getElementById('activityTitle').textContent = activity.title;
        document.getElementById('activityContent').innerHTML = activity.content;
        
        // Switch screens
        this.switchToActivityScreen();
        
        // Start timer
        this.startTimer();
    }
    
    switchToActivityScreen() {
        document.getElementById('mainScreen').style.display = 'none';
        document.getElementById('activityScreen').style.display = 'block';
        document.getElementById('activityScreen').classList.add('active');
    }
    
    switchToMainScreen() {
        document.getElementById('activityScreen').style.display = 'none';
        document.getElementById('activityScreen').classList.remove('active');
        document.getElementById('mainScreen').style.display = 'block';
    }
    
    startTimer() {
        this.isTimerRunning = true;
        let timeLeft = 300; // 5 minutes in seconds
        const timerElement = document.getElementById('timer');
        const progressElement = document.getElementById('progressFill');
        
        this.currentTimer = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            // Update progress bar
            const progress = ((300 - timeLeft) / 300) * 100;
            progressElement.style.width = progress + '%';
            
            if (timeLeft <= 0) {
                clearInterval(this.currentTimer);
                timerElement.textContent = "Complete!";
                progressElement.style.width = '100%';
                this.isTimerRunning = false;
                
                // Auto-complete after showing "Complete!" for 2 seconds
                setTimeout(() => {
                    this.completeActivity();
                }, 2000);
            }
            
            timeLeft--;
        }, 1000);
    }
    
    completeActivity() {
        // Clear timer
        if (this.currentTimer) {
            clearInterval(this.currentTimer);
            this.currentTimer = null;
        }
        this.isTimerRunning = false;
        
        // Update stats
        this.sessionCount++;
        this.totalMinutes += 5;
        this.updateStreak();
        
        // Record session for dashboard
        this.dashboardData.addSession();
        
        // Save to localStorage
        this.saveData();
        
        // Switch back to main screen
        this.switchToMainScreen();
        
        // Update stats display
        this.updateStats();
        
        // Reset timer display and progress bar
        this.resetTimerDisplay();
        
        // Show completion message
        this.showCompletionMessage();
    }
    
    resetTimerDisplay() {
        document.getElementById('timer').textContent = '5:00';
        document.getElementById('progressFill').style.width = '0%';
    }
    
    showCompletionMessage() {
        const messages = [
            "Great job! You chose growth over impulse! 🌱",
            "You're building stronger habits every day! 💪",
            "Another victory for your future self! 🎉",
            "You're becoming the person you want to be! ⭐",
            "Every 'no' makes the next one easier! 🚀"
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        // Create temporary message element
        const messageDiv = document.createElement('div');
        messageDiv.textContent = randomMessage;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #4CAF50, #45a049);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideIn 0.5s ease-out;
        `;
        
        document.body.appendChild(messageDiv);
        
        // Remove message after 3 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
    
    saveData() {
        localStorage.setItem('sessionCount', this.sessionCount.toString());
        localStorage.setItem('totalMinutes', this.totalMinutes.toString());
        localStorage.setItem('streakDays', this.streakDays.toString());
    }
    
    // Method to reset all data (for testing or fresh start)
    resetData() {
        this.sessionCount = 0;
        this.totalMinutes = 0;
        this.streakDays = 0;
        localStorage.clear();
        this.updateStats();
    }
    
    // Method to export data
    exportData() {
        const data = {
            sessionCount: this.sessionCount,
            totalMinutes: this.totalMinutes,
            streakDays: this.streakDays,
            lastSessionDate: localStorage.getItem('lastSessionDate'),
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'habit-breaker-data.json';
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Add CSS for slide-in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new HabitBreaker();
    
    // Make app available globally for debugging
    window.habitBreakerApp = app;
    
    // Add helpful keyboard shortcuts info
    console.log('Habit Breaker App loaded!');
    console.log('Keyboard shortcuts:');
    console.log('- Spacebar: Start activity');
    console.log('- Escape: Complete activity');
    console.log('- Access app instance: window.habitBreakerApp');
});