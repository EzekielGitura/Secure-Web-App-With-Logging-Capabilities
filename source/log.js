// logger.js
class SecurityLogger {
    constructor() {
        this.logs = [];
        this.MAX_LOGS = 1000;
        this.threatClassifications = {
            'low': { color: 'green', priority: 1 },
            'medium': { color: 'yellow', priority: 2 },
            'high': { color: 'orange', priority: 3 },
            'critical': { color: 'red', priority: 4 }
        };
    }

    logEvent(eventData) {
        this.addLog('event', eventData);
    }

    logThreat(threatData) {
        threatData.timestamp = new Date().toISOString();
        this.addLog('threat', threatData);
        this.displayThreatOnDashboard(threatData);
    }

    addLog(type, data) {
        const logEntry = {
            id: this.generateLogId(),
            type: type,
            ...data,
            timestamp: new Date().toISOString()
        };

        this.logs.push(logEntry);

        // Maintain log size
        if (this.logs.length > this.MAX_LOGS) {
            this.logs.shift();
        }

        this.persistLogs();
    }

    generateLogId() {
        return Math.random().toString(36).substr(2, 9);
    }

    persistLogs() {
        // Implement secure log storage
        // Could use IndexedDB or send to backend
        try {
            localStorage.setItem('securityLogs', JSON.stringify(this.logs));
        } catch (error) {
            console.error('Log persistence failed', error);
        }
    }

    displayThreatOnDashboard(threatData) {
        const dashboardElement = document.getElementById('threat-log');
        const threatElement = document.createElement('div');
        
        const classification = this.threatClassifications[threatData.severity] || this.threatClassifications['low'];
        
        threatElement.innerHTML = `
            <div class="threat-entry" style="background-color: ${classification.color};">
                <strong>Threat Type:</strong> ${threatData.type}<br>
                <strong>Severity:</strong> ${threatData.severity}<br>
                <strong>Timestamp:</strong> ${threatData.timestamp}
            </div>
        `;
        
        dashboardElement.prepend(threatElement);
    }

    exportLogsForSOC() {
        // Generate structured log format for Security Operations Center
        const structuredLogs = this.logs.map(log => ({
            log_id: log.id,
            type: log.type,
            severity: log.severity || 'info',
            timestamp: log.timestamp,
            details: JSON.stringify(log)
        }));

        return {
            application: 'Secure Web App',
            exported_at: new Date().toISOString(),
            logs: structuredLogs
        };
    }
}
