// Dashboard main functionality
class Dashboard {
    constructor() {
        this.data = new DashboardData();
        this.charts = {};
        this.init();
    }
    
    init() {
        this.updateStats();
        this.createHeatmap();
        this.createTimeChart();
        this.createWeeklyChart();
        this.updateRecentActivity();
        this.updateInsights();
        
        // Add sample data button for demo (remove in production)
        this.addDemoButton();
    }
    
    updateStats() {
        document.getElementById('totalCravings').textContent = this.data.sessionCount;
        document.getElementById('currentStreak').textContent = this.data.streakDays;
        document.getElementById('totalMinutes').textContent = this.data.totalMinutes;
        document.getElementById('averageDaily').textContent = this.data.getAverageSessionsPerDay();
    }
    
    createHeatmap() {
        const heatmapData = this.data.getYearlyHeatmapData();
        const container = document.getElementById('heatmapGrid');
        const monthsContainer = document.getElementById('heatmapMonths');
        
        // Clear existing content
        container.innerHTML = '';
        monthsContainer.innerHTML = '';
        
        // Create month labels
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const now = new Date();
        const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        
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
            
            // Calculate intensity level (0-4)
            const level = sessionCount === 0 ? 0 : Math.min(4, Math.ceil((sessionCount / maxSessions) * 4));
            dayDiv.classList.add(`level-${level}`);
            
            // Add tooltip
            dayDiv.addEventListener('mouseenter', (e) => this.showTooltip(e, dateString, sessionCount));
            dayDiv.addEventListener('mouseleave', () => this.hideTooltip());
            
            container.appendChild(dayDiv);
        }
    }
    
    createTimeChart() {
        const ctx = document.getElementById('timeChart').getContext('2d');
        const hourlyData = this.data.getHourlyDistribution();
        
        const labels = [];
        for (let i = 0; i < 24; i++) {
            if (i === 0) labels.push('12 AM');
            else if (i === 12) labels.push('12 PM');
            else if (i < 12) labels.push(`${i} AM`);
            else labels.push(`${i - 12} PM`);
        }
        
        this.charts.timeChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Cravings',
                    data: hourlyData,
                    backgroundColor: 'rgba(102, 126, 234, 0.6)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    },
                    x: {
                        ticks: {
                            maxRotation: 45
                        }
                    }
                }
            }
        });
    }
    
    createWeeklyChart() {
        const ctx = document.getElementById('weeklyChart').getContext('2d');
        const weeklyData = this.data.getWeeklyDistribution();
        
        this.charts.weeklyChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: weeklyData.labels,
                datasets: [{
                    data: weeklyData.data,
                    backgroundColor: [
                        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
                        '#FFEAA7', '#DDA0DD', '#98D8C8'
                    ],
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
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }
    
    updateRecentActivity() {
        const container = document.getElementById('recentActivity');
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
            const timeString = sessionDate.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
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
    
    // Demo functionality - remove in production
    addDemoButton() {
        if (this.data.sessions.length === 0) {
            const demoButton = document.createElement('button');
            demoButton.textContent = '🎮 Load Sample Data';
            demoButton.className = 'nav-btn';
            demoButton.onclick = () => {
                this.data.generateSampleData();
                location.reload();
            };
            
            document.querySelector('.dashboard-nav').appendChild(demoButton);
        }
    }
    
    // Refresh dashboard data
    refresh() {
        this.data.initializeData();
        this.updateStats();
        this.createHeatmap();
        
        // Update charts
        if (this.charts.timeChart) {
            const hourlyData = this.data.getHourlyDistribution();
            this.charts.timeChart.data.datasets[0].data = hourlyData;
            this.charts.timeChart.update();
        }
        
        if (this.charts.weeklyChart) {
            const weeklyData = this.data.getWeeklyDistribution();
            this.charts.weeklyChart.data.datasets[0].data = weeklyData.data;
            this.charts.weeklyChart.update();
        }
        
        this.updateRecentActivity();
        this.updateInsights();
    }
}

// Global functions for buttons
function exportAllData() {
    window.dashboard.data.exportData();
}

function resetAllData() {
    window.dashboard.data.resetAllData();
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
    console.log('Dashboard loaded! Access via window.dashboard');
});