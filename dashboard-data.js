// Dashboard data management
class DashboardData {
    constructor() {
        this.initializeData();
    }
    
    initializeData() {
        // Get existing data or create empty structure
        this.sessions = JSON.parse(localStorage.getItem('cravingSessions') || '[]');
        this.sessionCount = parseInt(localStorage.getItem('sessionCount') || '0');
        this.totalMinutes = parseInt(localStorage.getItem('totalMinutes') || '0');
        this.streakDays = parseInt(localStorage.getItem('streakDays') || '0');
    }
    
    // Add a new session
    addSession(timestamp = new Date()) {
        const session = {
            id: Date.now(),
            timestamp: timestamp.toISOString(),
            date: timestamp.toDateString(),
            hour: timestamp.getHours(),
            dayOfWeek: timestamp.getDay(),
            completed: true
        };
        
        this.sessions.push(session);
        this.saveData();
        return session;
    }
    
    // Save data to localStorage
    saveData() {
        localStorage.setItem('cravingSessions', JSON.stringify(this.sessions));
    }
    
    // Get sessions for a specific date
    getSessionsForDate(date) {
        const dateString = date.toDateString();
        return this.sessions.filter(session => session.date === dateString);
    }
    
    // Get sessions count for each day in the past year
    getYearlyHeatmapData() {
        const data = {};
        const now = new Date();
        const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        
        // Initialize all dates with 0
        for (let d = new Date(oneYearAgo); d <= now; d.setDate(d.getDate() + 1)) {
            const dateString = d.toDateString();
            data[dateString] = 0;
        }
        
        // Count sessions for each date
        this.sessions.forEach(session => {
            if (data.hasOwnProperty(session.date)) {
                data[session.date]++;
            }
        });
        
        return data;
    }
    
    // Get hourly distribution data
    getHourlyDistribution() {
        const hourCounts = new Array(24).fill(0);
        
        this.sessions.forEach(session => {
            hourCounts[session.hour]++;
        });
        
        return hourCounts;
    }
    
    // Get weekly distribution data
    getWeeklyDistribution() {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayCounts = new Array(7).fill(0);
        
        this.sessions.forEach(session => {
            dayCounts[session.dayOfWeek]++;
        });
        
        return {
            labels: dayNames,
            data: dayCounts
        };
    }
    
    // Get recent sessions (last N sessions)
    getRecentSessions(limit = 10) {
        return this.sessions
            .slice(-limit)
            .reverse()
            .map(session => ({
                ...session,
                timeAgo: this.getTimeAgo(new Date(session.timestamp))
            }));
    }
    
    // Calculate average sessions per day
    getAverageSessionsPerDay() {
        if (this.sessions.length === 0) return 0;
        
        const firstSession = new Date(this.sessions[0].timestamp);
        const lastSession = new Date(this.sessions[this.sessions.length - 1].timestamp);
        const daysDiff = Math.max(1, Math.ceil((lastSession - firstSession) / (1000 * 60 * 60 * 24)));
        
        return (this.sessions.length / daysDiff).toFixed(1);
    }
    
    // Get insights based on patterns
    getInsights() {
        const insights = [];
        const hourlyData = this.getHourlyDistribution();
        const weeklyData = this.getWeeklyDistribution();
        
        // Peak hour insight
        const peakHour = hourlyData.indexOf(Math.max(...hourlyData));
        if (peakHour !== -1 && hourlyData[peakHour] > 0) {
            const hourString = this.formatHour(peakHour);
            insights.push({
                title: "Peak Craving Time",
                text: `Most of your cravings happen around ${hourString}. Consider planning a healthy activity during this time.`
            });
        }
        
        // Day pattern insight
        const maxDayIndex = weeklyData.data.indexOf(Math.max(...weeklyData.data));
        if (weeklyData.data[maxDayIndex] > 0) {
            insights.push({
                title: "Challenging Day",
                text: `${weeklyData.labels[maxDayIndex]}s tend to be your most challenging day. Extra self-care on these days could help.`
            });
        }
        
        // Progress insight
        if (this.sessions.length >= 7) {
            const recentWeek = this.sessions.slice(-7).length;
            const previousWeek = this.sessions.slice(-14, -7).length;
            if (recentWeek > previousWeek) {
                insights.push({
                    title: "Increasing Awareness",
                    text: `You've been more mindful lately - ${recentWeek} vs ${previousWeek} sessions last week. This awareness is the first step to change.`
                });
            }
        }
        
        // Streak insight
        if (this.streakDays >= 3) {
            insights.push({
                title: "Building Momentum",
                text: `Your ${this.streakDays}-day streak shows you're building a strong habit of conscious choice. Keep it up!`
            });
        }
        
        // Add motivational insight if no specific patterns
        if (insights.length === 0) {
            insights.push({
                title: "Every Step Counts",
                text: "You're building awareness of your patterns. Each time you pause instead of react, you're rewiring your brain for better habits."
            });
        }
        
        return insights;
    }
    
    // Utility functions
    formatHour(hour) {
        if (hour === 0) return "midnight";
        if (hour === 12) return "noon";
        if (hour < 12) return `${hour} AM`;
        return `${hour - 12} PM`;
    }
    
    getTimeAgo(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffMins < 60) return `${diffMins} minutes ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        if (diffDays === 1) return "yesterday";
        return `${diffDays} days ago`;
    }
    
    // Export all data
    exportData() {
        const exportData = {
            sessions: this.sessions,
            stats: {
                sessionCount: this.sessionCount,
                totalMinutes: this.totalMinutes,
                streakDays: this.streakDays
            },
            exportDate: new Date().toISOString(),
            version: "1.0"
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `habit-breaker-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
    
    // Reset all data
    resetAllData() {
        if (confirm('Are you sure you want to delete all your data? This cannot be undone.')) {
            localStorage.clear();
            this.sessions = [];
            this.sessionCount = 0;
            this.totalMinutes = 0;
            this.streakDays = 0;
            location.reload();
        }
    }
    
    // Generate sample data for demo purposes
    generateSampleData() {
        const sampleSessions = [];
        const now = new Date();
        
        // Generate 3 months of sample data
        for (let i = 90; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            
            // Random number of sessions per day (0-5)
            const sessionsToday = Math.floor(Math.random() * 6);
            
            for (let j = 0; j < sessionsToday; j++) {
                // Random hour weighted towards certain times
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
        this.streakDays = 7; // Sample streak
        
        localStorage.setItem('sessionCount', this.sessionCount.toString());
        localStorage.setItem('totalMinutes', this.totalMinutes.toString());
        localStorage.setItem('streakDays', this.streakDays.toString());
        this.saveData();
    }
}