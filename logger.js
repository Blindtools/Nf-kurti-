const fs = require('fs');
const path = require('path');

class Logger {
    constructor() {
        this.logDir = path.join(__dirname, 'logs');
        this.ensureLogDirectory();
    }

    ensureLogDirectory() {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }

    formatMessage(level, message, data = null) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level: level.toUpperCase(),
            message,
            ...(data && { data })
        };
        return JSON.stringify(logEntry);
    }

    writeToFile(filename, content) {
        const filePath = path.join(this.logDir, filename);
        const logLine = content + '\n';
        
        try {
            fs.appendFileSync(filePath, logLine);
        } catch (error) {
            console.error('Failed to write to log file:', error);
        }
    }

    info(message, data = null) {
        const formatted = this.formatMessage('info', message, data);
        console.log(`ℹ️  ${message}`, data ? data : '');
        this.writeToFile('app.log', formatted);
    }

    error(message, error = null) {
        const errorData = error ? {
            message: error.message,
            stack: error.stack,
            ...(error.code && { code: error.code })
        } : null;
        
        const formatted = this.formatMessage('error', message, errorData);
        console.error(`❌ ${message}`, error ? error : '');
        this.writeToFile('error.log', formatted);
    }

    warn(message, data = null) {
        const formatted = this.formatMessage('warn', message, data);
        console.warn(`⚠️  ${message}`, data ? data : '');
        this.writeToFile('app.log', formatted);
    }

    debug(message, data = null) {
        if (process.env.NODE_ENV === 'development') {
            const formatted = this.formatMessage('debug', message, data);
            console.log(`🐛 ${message}`, data ? data : '');
            this.writeToFile('debug.log', formatted);
        }
    }

    business(action, userJid, message, data = null) {
        const businessData = {
            action,
            userJid: userJid.replace('@s.whatsapp.net', ''),
            message,
            ...(data && { data })
        };
        
        const formatted = this.formatMessage('business', `${action}: ${message}`, businessData);
        console.log(`💼 ${action}: ${message}`);
        this.writeToFile('business.log', formatted);
    }

    connection(status, details = null) {
        const formatted = this.formatMessage('connection', `WhatsApp ${status}`, details);
        console.log(`📱 WhatsApp ${status}`, details ? details : '');
        this.writeToFile('connection.log', formatted);
    }

    // Clean old log files (keep last 7 days)
    cleanOldLogs() {
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
        const now = Date.now();

        try {
            const files = fs.readdirSync(this.logDir);
            files.forEach(file => {
                const filePath = path.join(this.logDir, file);
                const stats = fs.statSync(filePath);
                
                if (now - stats.mtime.getTime() > maxAge) {
                    fs.unlinkSync(filePath);
                    console.log(`🗑️  Cleaned old log file: ${file}`);
                }
            });
        } catch (error) {
            console.error('Error cleaning old logs:', error);
        }
    }

    // Get log statistics
    getStats() {
        try {
            const files = fs.readdirSync(this.logDir);
            const stats = {};
            
            files.forEach(file => {
                const filePath = path.join(this.logDir, file);
                const fileStats = fs.statSync(filePath);
                stats[file] = {
                    size: fileStats.size,
                    modified: fileStats.mtime,
                    lines: fs.readFileSync(filePath, 'utf8').split('\n').length - 1
                };
            });
            
            return stats;
        } catch (error) {
            this.error('Failed to get log stats', error);
            return {};
        }
    }
}

// Create singleton instance
const logger = new Logger();

// Clean old logs on startup
logger.cleanOldLogs();

module.exports = logger;

