// Prevent any script duplication
(function() {
    'use strict';
    
    // Check if dashboard is already loaded
    if (window.DASHBOARD_LOADED) {
        console.log('Dashboard already loaded, preventing duplicate');
        return;
    }
    window.DASHBOARD_LOADED = true;

    // Simple Dashboard Class
    class Dashboard {
        constructor() {
            if (window.dashboardInstance) {
                return window.dashboardInstance;
            }
            
            window.dashboardInstance = this;
            this.charts = {};
            this.data = this.createDataManager();
            this.init();
        }
        
        createDataManager() {
            return {
                sessionCount: parseInt(localStorage.getItem('sessionCount') || '0'),
                totalMinutes: parseInt(localStorage.getItem('totalMinutes') || '0'),
                streakDays: parseInt(localStorage.getItem('streakDays') || '0'),
                sessions: JSON.parse(localStorage.getItem('cravingSessions') || '[]'),
                
                getAverageSessionsPerDay() { 
                    if (this.sessions.length === 0) return '0';
                    const firstSession = new Date(this.sessions[0].timestamp);
                    const lastSession = new Date(this.sessions[this.sessions.length - 1].timestamp);
                    const daysDiff = Math.max(1, Math.ceil((lastSession - firstSession) / (1000 * 60 * 60 * 24)));
                    return (this.sessions.length / daysDiff).toFixed(1);
                },
                
                getYearlyHeatmapData() { 
                    const data = {};
                    this.sessions.forEach(session => {
                        data[session.date] = (data[session.date] || 0) + 1;
                    });
                    return data;
                },
                
                getHourlyDistribution() { 
                    const hours = new Array(24).fill(0);
                    this.sessions.forEach(s => {
                        if (s.hour >= 0 && s.hour < 24) {
                            hours[s.hour]++;
                        }
                    });
                    return hours;
                },
                
                getWeeklyDistribution() { 
                    const days = new Array(7).fill(0);
                    this.sessions.forEach(s => {
                        if (s.dayOfWeek >= 0 && s.dayOfWeek < 7) {
                            days[s.dayOfWeek]++;
                        }
                    });
                    return {
                        labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                        data: days
                    };
                },
                
                getRecentSessions() { 
                    return this.sessions.slice(-10).reverse().map(session => ({
                        ...session,
                        timeAgo: this.getTimeAgo(new Date(session.timestamp))
                    }));
                },
                
                getInsights() { 
                    if (this.sessions.length === 0) {
                        return [{
                            title: "Getting Started",
                            text: "Click 'Load Sample Data' to see your dashboard in action!"
                        }];
                    }
                    
                    const insights = [];
                    const hourly = this.getHourlyDistribution();
                    const weekly = this.getWeeklyDistribution();
                    
                    // Peak hour insight
                    const peakHour = hourly.indexOf(Math.max(...hourly));
                    if (peakHour !== -1 && hourly[peakHour] > 0) {
                        const hourStr = peakHour === 0 ? "midnight" : 
                                       peakHour === 12 ? "noon" :
                                       peakHour < 12 ? `${peakHour} AM` : `${peakHour - 12} PM`;
                        insights.push({
                            title: "Peak Craving Time",
                            text: `Most of your cravings happen around ${hourStr}. Consider planning a healthy activity during this time.`
                        });
                    }
                    
                    // Day pattern insight
                    const maxDayIndex = weekly.data.indexOf(Math.max(...weekly.data));
                    if (weekly.data[maxDayIndex] > 0) {
                        insights.push({
                            title: "Challenging Day",
                            text: `${weekly.labels[maxDayIndex]}days tend to be your most challenging. Extra self-care on these days could help.`
                        });
                    }
                    
                    // Progress insight
                    insights.push({
                        title: "Building Awareness",
                        text: `You've handled ${this.sessionCount} cravings successfully. Each pause builds stronger neural pathways for conscious choice.`
                    });
                    
                    // Streak insight
                    if (this.streakDays >= 7) {
                        insights.push({
                            title: "Momentum Building",
                            text: `Your ${this.streakDays}-day streak shows real commitment. You're rewiring your brain for healthier habits!`
                        });
                    }
                    
                    return insights;
                },
                
                getTimeAgo(date) {
                    const now = new Date();
                    const diff = now - date;
                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                    const hours = Math.floor(diff / (1000 * 60 * 60));
                    const minutes = Math.floor(diff / (1000 * 60));
                    
                    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
                    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
                    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
                    return 'Just now';
                },
                
                generateSampleData() {
                    console.log('Generating sample data...');
                    const sessions = [];
                    const now = new Date();
                    
                    // Generate 90 days of sample data
                    for (let i = 90; i >= 0; i--) {
                        const date = new Date(now);
                        date.setDate(date.getDate() - i);
                        
                        // Random number of sessions per day (0-4), with some days having no sessions
                        const sessionsToday = Math.random() < 0.7 ? Math.floor(Math.random() * 4) + 1 : 0;
                        
                        for (let j = 0; j < sessionsToday; j++) {
                            // Weight certain hours more heavily
                            let hour;
                            const rand = Math.random();
                            if (rand < 0.3) {
                                hour = 10 + Math.floor(Math.random() * 4); // 10 AM - 2 PM
                            } else if (rand < 0.6) {
                                hour = 15 + Math.floor(Math.random() * 4); // 3 PM - 7 PM
                            } else {
                                hour = 20 + Math.floor(Math.random() * 3); // 8 PM - 11 PM
                            }
                            
                            const sessionDate = new Date(date);
                            sessionDate.setHours(hour, Math.floor(Math.random() * 60), 0, 0);
                            
                            sessions.push({
                                id: Date.now() + Math.random(),
                                timestamp: sessionDate.toISOString(),
                                date: sessionDate.toDateString(),
                                hour: sessionDate.getHours(),
                                dayOfWeek: sessionDate.getDay(),
                                completed: true
                            });
                        }
                    }
                    
                    // Update the data manager
                    this.sessions = sessions;
                    this.sessionCount = sessions.length;
                    this.totalMinutes = sessions.length * 5;
                    this.streakDays = 15;
                    
                    // Save to localStorage
                    localStorage.setItem('sessionCount', this.sessionCount.toString());
                    localStorage.setItem('totalMinutes', this.totalMinutes.toString());
                    localStorage.setItem('streakDays', this.streakDays.toString());
                    localStorage.setItem('cravingSessions', JSON.stringify(this.sessions));
                    
                    console.log(`Generated ${sessions.length} sessions`);
                    console.log('Sample session:', sessions[0]);
                    console.log('Heatmap data sample:', this.getYearlyHeatmapData());
                },
                
                exportData() {
                    const data = {
                        sessions: this.sessions,
                        sessionCount: this.sessionCount,
                        totalMinutes: this.totalMinutes,
                        streakDays: this.streakDays,
                        exportDate: new Date().toISOString(),
                        version: '1.0'
                    };
                    
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `habit-breaker-data-${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                },
                
                resetAllData() {
                    if (confirm('Are you sure you want to delete all your data? This cannot be undone.')) {
                        localStorage.clear();
                        location.reload();
                    }
                }
            };
        }
        
        init() {
            this.updateStats();
            this.createHeatmap();
            this.createCharts();
            this.updateRecentActivity();
            this.updateInsights();
            this.addDemoButton();
        }
        
        updateStats() {
            const updates = {
                'totalCravings': this.data.sessionCount,
                'currentStreak': this.data.streakDays,
                'totalMinutes': this.data.totalMinutes,
                'averageDaily': this.data.getAverageSessionsPerDay()
            };
            
            Object.entries(updates).forEach(([id, value]) => {
                const el = document.getElementById(id);
                if (el) el.textContent = value;
            });
        }
        
        createHeatmap() {
            const container = document.getElementById('heatmapGrid');
            const monthsContainer = document.getElementById('heatmapMonths');
            
            if (!container || !monthsContainer) return;
            
            const heatmapData = this.data.getYearlyHeatmapData();
            console.log('Heatmap data sample:', Object.keys(heatmapData).slice(0, 5));
            
            // Clear containers
            container.innerHTML = '';
            monthsContainer.innerHTML = '';
            
            // Calculate date range (last 52 weeks)
            const today = new Date();
            console.log('Today:', today.toDateString());
            
            // Start from exactly 52 weeks ago (364 days)
            const startDate = new Date(today);
            startDate.setDate(startDate.getDate() - 364);
            
            // Find the Sunday before or on this date
            const dayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
            startDate.setDate(startDate.getDate() - dayOfWeek);
            
            console.log('Start date (Sunday):', startDate.toDateString());
            
            // Create month labels
            const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                               'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            
            const totalWeeks = 53;
            
            // Build the grid and track months
            const monthPositions = [];
            const weeks = [];
            let currentDate = new Date(startDate);
            let lastMonth = -1;
            const maxValue = Math.max(...Object.values(heatmapData), 1);
            
            for (let week = 0; week < totalWeeks; week++) {
                const weekData = [];
                
                // Check the first day of this week to see if we entered a new month
                const firstDayOfWeek = new Date(currentDate);
                const currentMonth = firstDayOfWeek.getMonth();
                
                // If this is a new month, record its position
                if (currentMonth !== lastMonth) {
                    monthPositions.push({
                        name: monthLabels[currentMonth],
                        weekIndex: week,
                        date: firstDayOfWeek.toDateString()
                    });
                    console.log(`Month ${monthLabels[currentMonth]} starts at week ${week} (${firstDayOfWeek.toDateString()})`);
                    lastMonth = currentMonth;
                }
                
                // Create 7 days for this week (Sunday to Saturday)
                for (let day = 0; day < 7; day++) {
                    const dayData = {
                        date: new Date(currentDate),
                        dateString: currentDate.toDateString(),
                        isHidden: currentDate > today
                    };
                    
                    if (!dayData.isHidden) {
                        const sessionCount = heatmapData[dayData.dateString] || 0;
                        dayData.sessionCount = sessionCount;
                        dayData.level = sessionCount === 0 ? 0 : Math.min(4, Math.ceil((sessionCount / maxValue) * 4));
                        
                        const options = { weekday: 'short', month: 'short', day: 'numeric' };
                        dayData.formattedDate = currentDate.toLocaleDateString('en-US', options);
                    }
                    
                    weekData.push(dayData);
                    currentDate.setDate(currentDate.getDate() + 1);
                }
                
                weeks.push(weekData);
            }
            
            console.log('Month positions:', monthPositions);
            
            // Create month labels with exact positioning
            monthPositions.forEach(month => {
                const monthDiv = document.createElement('div');
                monthDiv.className = 'heatmap-month';
                monthDiv.textContent = month.name;
                
                // Calculate exact position based on the flex layout
                // Each week gets equal space, so position = (weekIndex / totalWeeks) * 100%
                const leftPercentage = (month.weekIndex / totalWeeks) * 100;
                monthDiv.style.left = `${leftPercentage}%`;
                
                console.log(`Placing ${month.name} at ${leftPercentage}% (week ${month.weekIndex})`);
                monthsContainer.appendChild(monthDiv);
            });
            
            // Create the grid using the pre-calculated data
            weeks.forEach((weekData, weekIndex) => {
                const weekDiv = document.createElement('div');
                weekDiv.className = 'heatmap-week';
                
                weekData.forEach((dayData, dayIndex) => {
                    const dayDiv = document.createElement('div');
                    dayDiv.className = 'heatmap-day';
                    
                    if (dayData.isHidden) {
                        dayDiv.style.visibility = 'hidden';
                    } else {
                        dayDiv.classList.add(`level-${dayData.level}`);
                        dayDiv.title = `${dayData.formattedDate}: ${dayData.sessionCount} session${dayData.sessionCount !== 1 ? 's' : ''}`;
                        
                        // Add hover events
                        dayDiv.addEventListener('mouseenter', (e) => {
                            this.showTooltip(e, dayData.formattedDate, dayData.sessionCount);
                        });
                        dayDiv.addEventListener('mouseleave', () => {
                            this.hideTooltip();
                        });
                        
                        // Log some sample dates for debugging
                        if (weekIndex % 10 === 0 && dayIndex === 0) {
                            console.log(`Week ${weekIndex}, Day ${dayIndex}: ${dayData.formattedDate}`);
                        }
                    }
                    
                    weekDiv.appendChild(dayDiv);
                });
                
                container.appendChild(weekDiv);
            });
        }
        
        showTooltip(event, dateString, count) {
            this.hideTooltip(); // Remove any existing tooltip
            
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = `${dateString}: ${count} session${count !== 1 ? 's' : ''}`;
            document.body.appendChild(tooltip);
            
            const rect = event.target.getBoundingClientRect();
            tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
            
            this.currentTooltip = tooltip;
        }
        
        hideTooltip() {
            if (this.currentTooltip) {
                this.currentTooltip.remove();
                this.currentTooltip = null;
            }
        }
        
        createCharts() {
            if (typeof Chart === 'undefined') {
                console.warn('Chart.js not loaded, skipping charts');
                return;
            }
            
            this.createTimeChart();
            this.createWeeklyChart();
        }
        
        createTimeChart() {
            const canvas = document.getElementById('timeChart');
            if (!canvas) return;
            
            if (this.charts.timeChart) {
                this.charts.timeChart.destroy();
            }
            
            const hourlyData = this.data.getHourlyDistribution();
            const labels = Array.from({length: 24}, (_, i) => {
                if (i === 0) return '12a';
                if (i === 12) return '12p';
                if (i < 12) return `${i}a`;
                return `${i-12}p`;
            });
            
            this.charts.timeChart = new Chart(canvas, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
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
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                title: function(context) {
                                    const hour = context[0].dataIndex;
                                    if (hour === 0) return '12:00 AM';
                                    if (hour === 12) return '12:00 PM';
                                    if (hour < 12) return `${hour}:00 AM`;
                                    return `${hour - 12}:00 PM`;
                                },
                                label: function(context) {
                                    const count = context.parsed.y;
                                    return `${count} craving${count !== 1 ? 's' : ''}`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: { 
                            beginAtZero: true, 
                            ticks: { 
                                stepSize: 1,
                                callback: function(value) {
                                    return Number.isInteger(value) ? value : '';
                                }
                            },
                            title: {
                                display: true,
                                text: 'Number of Cravings'
                            }
                        },
                        x: { 
                            ticks: { maxRotation: 0 },
                            title: {
                                display: true,
                                text: 'Time of Day'
                            }
                        }
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    }
                }
            });
        }
        
        createWeeklyChart() {
            const canvas = document.getElementById('weeklyChart');
            if (!canvas) return;
            
            if (this.charts.weeklyChart) {
                this.charts.weeklyChart.destroy();
            }
            
            const weeklyData = this.data.getWeeklyDistribution();
            
            this.charts.weeklyChart = new Chart(canvas, {
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
                        borderColor: '#fff',
                        hoverBorderWidth: 3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { 
                                padding: 15, 
                                usePointStyle: true,
                                font: { size: 12 }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const day = context.label;
                                    const count = context.parsed;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
                                    return `${day}: ${count} cravings (${percentage}%)`;
                                }
                            }
                        }
                    },
                    cutout: '50%'
                }
            });
        }
        
        updateRecentActivity() {
            const container = document.getElementById('recentActivity');
            if (!container) return;
            
            const sessions = this.data.getRecentSessions();
            
            if (sessions.length === 0) {
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
            
            container.innerHTML = sessions.map(session => {
                const sessionDate = new Date(session.timestamp);
                const time = sessionDate.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
                const date = sessionDate.toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric'
                });
                
                return `
                    <div class="activity-item">
                        <div class="activity-info">
                            <div class="activity-icon">✅</div>
                            <div class="activity-details">
                                <h4>Craving handled successfully</h4>
                                <p>5-minute session completed at ${time} on ${date}</p>
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
        
        addDemoButton() {
            // Always show the demo button for testing
            const nav = document.querySelector('.dashboard-nav');
            if (!nav || nav.querySelector('.demo-btn')) return;
            
            const btn = document.createElement('button');
            btn.textContent = '🎮 Load Sample Data';
            btn.className = 'nav-btn demo-btn';
            btn.onclick = () => {
                console.log('Demo button clicked');
                this.data.generateSampleData();
                // Refresh the dashboard immediately instead of reloading
                this.refresh();
            };
            nav.appendChild(btn);
        }
        
        refresh() {
            this.data = this.createDataManager();
            this.updateStats();
            this.createHeatmap();
            this.createCharts();
            this.updateRecentActivity();
            this.updateInsights();
        }
    }

    // Global functions for buttons
    window.exportAllData = function() {
        if (window.dashboardInstance) {
            window.dashboardInstance.data.exportData();
        }
    };

    window.resetAllData = function() {
        if (window.dashboardInstance) {
            window.dashboardInstance.data.resetAllData();
        }
    };

    // Initialize only once when DOM is ready
    function initDashboard() {
        if (window.dashboardInstance) {
            console.log('Dashboard instance already exists');
            return;
        }
        
        try {
            new Dashboard();
            console.log('Dashboard initialized successfully');
        } catch (error) {
            console.error('Dashboard initialization error:', error);
        }
    }

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDashboard);
    } else {
        initDashboard();
    }

})();