// Prevent multiple script loading
if (typeof window.dashboardScriptLoaded !== 'undefined') {
    console.log('Dashboard script already loaded, skipping...');
} else {
    window.dashboardScriptLoaded = true;

    // Dashboard main functionality
    class Dashboard {
        constructor() {
            // Prevent multiple initialization
            if (window.dashboardInstance) {
                console.warn('Dashboard already initialized');
                return window.dashboardInstance;
            }
            
            this.data = this.createDataManager();
            this.charts = {};
            
            // Mark as initialized
            window.dashboardInstance = this;
            
            this.init();
        }
        
        createDataManager() {
            // Create a simple data manager if DashboardData class doesn't exist
            if (typeof DashboardData === 'undefined') {
                console.warn('DashboardData class not found, using fallback');
                return {
                    sessionCount: parseInt(localStorage.getItem('sessionCount') || '0'),
                    totalMinutes: parseInt(localStorage.getItem('totalMinutes') || '0'),
                    streakDays: parseInt(localStorage.getItem('streakDays') || '0'),
                    sessions: JSON.parse(localStorage.getItem('cravingSessions') || '[]'),
                    
                    getAverageSessionsPerDay: () => '0',
                    getYearlyHeatmapData: () => ({}),
                    getHourlyDistribution: () => new Array(24).fill(0),
                    getWeeklyDistribution: () => ({
                        labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                        data: new Array(7).fill(0)
                    }),
                    getRecentSessions: () => [],
                    getInsights: () => [{
                        title: "Getting Started",
                        text: "Start using the app to see your progress here!"
                    }],
                    generateSampleData: function() {
                        // Generate sample data
                        const sampleSessions = [];
                        const now = new Date();
                        
                        for (let i = 30; i >= 0; i--) {
                            const date = new Date(now);
                            date.setDate(date.getDate() - i);
                            
                            const sessionsToday = Math.floor(Math.random() * 4);
                            for (let j = 0; j < sessionsToday; j++) {
                                const hour = 10 + Math.floor(Math.random() * 10);
                                const sessionDate = new Date(date);
                                sessionDate.setHours(hour, Math.floor(Math.random() * 60), 0, 0);
                                
                                sampleSessions.push({
                                    id: Date.now() + Math.random(),
                                    timestamp: sessionDate.toISOString(),
                                    date: sessionDate.toDateString(),
                                    hour: sessionDate.getHours(),
                                    dayOfWeek: sessionDate.getDay(),
                                    completed: true
                                });
                            }
                        }
                        
                        this.sessions = sampleSessions;
                        this.sessionCount = sampleSessions.length;
                        this.totalMinutes = sampleSessions.length * 5;
                        this.streakDays = 7;
                        
                        localStorage.setItem('sessionCount', this.sessionCount.toString());
                        localStorage.setItem('totalMinutes', this.totalMinutes.toString());
                        localStorage.setItem('streakDays', this.streakDays.toString());
                        localStorage.setItem('cravingSessions', JSON.stringify(this.sessions));
                        
                        // Update methods after generating data
                        this.getAverageSessionsPerDay = () => (this.sessionCount / 30).toFixed(1);
                        this.getYearlyHeatmapData = () => {
                            const data = {};
                            this.sessions.forEach(session => {
                                data[session.date] = (data[session.date] || 0) + 1;
                            });
                            return data;
                        };
                        this.getHourlyDistribution = () => {
                            const hourCounts = new Array(24).fill(0);
                            this.sessions.forEach(session => {
                                hourCounts[session.hour]++;
                            });
                            return hourCounts;
                        };
                        this.getWeeklyDistribution = () => {
                            const dayCounts = new Array(7).fill(0);
                            this.sessions.forEach(session => {
                                dayCounts[session.dayOfWeek]++;
                            });
                            return {
                                labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                                data: dayCounts
                            };
                        };
                        this.getRecentSessions = (limit = 10) => {
                            return this.sessions.slice(-limit).reverse().map(session => ({
                                ...session,
                                timeAgo: this.getTimeAgo(new Date(session.timestamp))
                            }));
                        };
                        this.getInsights = () => {
                            const insights = [];
                            const hourlyData = this.getHourlyDistribution();
                            const peakHour = hourlyData.indexOf(Math.max(...hourlyData));
                            
                            if (peakHour !== -1 && hourlyData[peakHour] > 0) {
                                const hourString = peakHour === 0 ? "midnight" : 
                                                 peakHour === 12 ? "noon" :
                                                 peakHour < 12 ? `${peakHour} AM` : `${peakHour - 12} PM`;
                                insights.push({
                                    title: "Peak Craving Time",
                                    text: `Most of your cravings happen around ${hourString}. Consider planning a healthy activity during this time.`
                                });
                            }
                            
                            insights.push({
                                title: "Great Progress!",
                                text: `You've handled ${this.sessionCount} cravings successfully. Each time you pause instead of react, you're building stronger habits.`
                            });
                            
                            return insights;
                        };
                        this.getTimeAgo = (date) => {
                            const now = new Date();
                            const diffMs = now - date;
                            const diffMins = Math.floor(diffMs / (1000 * 60));
                            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                            
                            if (diffMins < 60) return `${diffMins} minutes ago`;
                            if (diffHours < 24) return `${diffHours} hours ago`;
                            if (diffDays === 1) return "yesterday";
                            return `${diffDays} days ago`;
                        };
                    },
                    exportData: function() {
                        const data = {
                            sessions: this.sessions,
                            stats: {
                                sessionCount: this.sessionCount,
                                totalMinutes: this.totalMinutes,
                                streakDays: this.streakDays
                            },
                            exportDate: new Date().toISOString()
                        };
                        
                        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `habit-breaker-data-${new Date().toISOString().split('T')[0]}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                    },
                    resetAllData: function() {
                        if (confirm('Are you sure you want to delete all your data? This cannot be undone.')) {
                            localStorage.clear();
                            location.reload();
                        }
                    }
                };
            }
            
            return new DashboardData();
        }
        
        init() {
            // Clear any existing content first
            this.clearExistingContent();
            
            this.updateStats();
            this.createHeatmap();
            this.createTimeChart();
            this.createWeeklyChart();
            this.updateRecentActivity();
            this.updateInsights();
            
            // Add sample data button for demo
            this.addDemoButton();
        }
        
        clearExistingContent() {
            const containers = ['heatmapGrid', 'heatmapMonths', 'recentActivity', 'insightsGrid'];
            containers.forEach(id => {
                const element = document.getElementById(id);
                if (element) element.innerHTML = '';
            });
        }
        
        updateStats() {
            const elements = {
                totalCravings: this.data.sessionCount,
                currentStreak: this.data.streakDays,
                totalMinutes: this.data.totalMinutes,
                averageDaily: this.data.getAverageSessionsPerDay()
            };
            
            Object.entries(elements).forEach(([id, value]) => {
                const el = document.getElementById(id);
                if (el) el.textContent = value;
            });
        }
        
        createHeatmap() {
            const heatmapData = this.data.getYearlyHeatmapData();
            const container = document.getElementById('heatmapGrid');
            const monthsContainer = document.getElementById('heatmapMonths');
            
            if (!container || !monthsContainer) return;
            
            container.innerHTML = '';
            monthsContainer.innerHTML = '';
            
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const now = new Date();
            const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
            
            // Create month labels
            for (let i = 0; i < 12; i++) {
                const monthDiv = document.createElement('div');
                monthDiv.className = 'heatmap-month';
                monthDiv.textContent = months[(oneYearAgo.getMonth() + i) % 12];
                monthsContainer.appendChild(monthDiv);
            }
            
            // Create day squares
            const maxSessions = Math.max(...Object.values(heatmapData), 1);
            for (let d = new Date(oneYearAgo); d <= now; d.setDate(d.getDate() + 1)) {
                const dayDiv = document.createElement('div');
                dayDiv.className = 'heatmap-day';
                
                const dateString = d.toDateString();
                const sessionCount = heatmapData[dateString] || 0;
                const level = sessionCount === 0 ? 0 : Math.min(4, Math.ceil((sessionCount / maxSessions) * 4));
                dayDiv.classList.add(`level-${level}`);
                
                dayDiv.addEventListener('mouseenter', (e) => this.showTooltip(e, dateString, sessionCount));
                dayDiv.addEventListener('mouseleave', () => this.hideTooltip());
                
                container.appendChild(dayDiv);
            }
        }
        
        createTimeChart() {
            const ctx = document.getElementById('timeChart');
            if (!ctx || typeof Chart === 'undefined') return;
            
            if (this.charts.timeChart) this.charts.timeChart.destroy();
            
            const hourlyData = this.data.getHourlyDistribution();
            const labels = Array.from({length: 24}, (_, i) => 
                i === 0 ? '12 AM' : i === 12 ? '12 PM' : i < 12 ? `${i} AM` : `${i - 12} PM`
            );
            
            this.charts.timeChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Cravings',
                        data: hourlyData,
                        backgroundColor: 'rgba(102, 126, 234, 0.6)',
                        borderColor: 'rgba(102, 126, 234, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, ticks: { stepSize: 1 } },
                        x: { ticks: { maxRotation: 45 } }
                    }
                }
            });
        }
        
        createWeeklyChart() {
            const ctx = document.getElementById('weeklyChart');
            if (!ctx || typeof Chart === 'undefined') return;
            
            if (this.charts.weeklyChart) this.charts.weeklyChart.destroy();
            
            const weeklyData = this.data.getWeeklyDistribution();
            
            this.charts.weeklyChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: weeklyData.labels,
                    datasets: [{
                        data: weeklyData.data,
                        backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'],
                        borderWidth: 2,
                        borderColor: '#fff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { padding: 20, usePointStyle: true }
                        }
                    }
                }
            });
        }
        
        updateRecentActivity() {
            const container = document.getElementById('recentActivity');
            if (!container) return;
            
            const recentSessions = this.data.getRecentSessions(10);
            
            if (recentSessions.length === 0) {
                container.innerHTML = `
                    <div class="activity-item">
                        <div class="activity-info">
                            <div class="activity-icon">🌱</div>
                            <div class="activity-details">
                                <h4>No sessions yet</h4>
                                <p>Start your journey by handling your first craving!</p>
                            </div>
                        </div>
                    </div>
                `;
                return;
            }
            
            container.innerHTML = recentSessions.map(session => {
                const sessionDate = new Date(session.timestamp);
                const timeString = sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                return `
                    <div class="activity-item">
                        <div class="activity-info">
                            <div class="activity-icon">✅</div>
                            <div class="activity-details">
                                <h4>Craving handled successfully</h4>
                                <p>5-minute session completed at ${timeString}</p>
                            </div>
                        </div>
                        <div class="activity-time">${session.timeAgo}</div>
                    </div>
                `;
            }).join('');
        }
        
        updateInsights() {
            const container = document.getElementById('insightsGrid');
            if (!container) return;
            
            const insights = this.data.getInsights();
            container.innerHTML = insights.map(insight => `
                <div class="insight-card">
                    <h3>${insight.title}</h3>
                    <p>${insight.text}</p>
                </div>
            `).join('');
        }
        
        showTooltip(event, dateString, count) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = `${dateString}: ${count} session${count !== 1 ? 's' : ''}`;
            document.body.appendChild(tooltip);
            
            const rect = event.target.getBoundingClientRect();
            tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
            this.currentTooltip = tooltip;
        }
        
        hideTooltip() {
            if (this.currentTooltip) {
                this.currentTooltip.remove();
                this.currentTooltip = null;
            }
        }
        
        addDemoButton() {
            if (this.data.sessionCount > 0) return;
            
            const nav = document.querySelector('.dashboard-nav');
            if (!nav || nav.querySelector('.demo-btn')) return;
            
            const demoButton = document.createElement('button');
            demoButton.textContent = '🎮 Load Sample Data';
            demoButton.className = 'nav-btn demo-btn';
            demoButton.onclick = () => {
                this.data.generateSampleData();
                location.reload();
            };
            nav.appendChild(demoButton);
        }
    }

    // Global functions for buttons
    window.exportAllData = function() {
        if (window.dashboardInstance && window.dashboardInstance.data) {
            window.dashboardInstance.data.exportData();
        }
    };

    window.resetAllData = function() {
        if (window.dashboardInstance && window.dashboardInstance.data) {
            window.dashboardInstance.data.resetAllData();
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDashboard);
    } else {
        initDashboard();
    }

    function initDashboard() {
        if (window.dashboardInstance) {
            console.log('Dashboard already initialized');
            return;
        }
        
        try {
            window.dashboard = new Dashboard();
            console.log('Dashboard loaded! Access via window.dashboard');
        } catch (error) {
            console.error('Error initializing dashboard:', error);
        }
    }
}boardInitialized = false;

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (dashboardInitialized) {
        console.warn('Dashboard already initialized, skipping...');
        return;
    }
    
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js not loaded. Please check the CDN link.');
        return;
    }
    
    try {
        dashboardInitialized = true;
        window.dashboard = new Dashboard();
        console.log('Dashboard loaded! Access via window.dashboard');
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        dashboardInitialized = false;
    }
});