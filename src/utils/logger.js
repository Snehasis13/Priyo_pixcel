/**
 * Structured Logging Utility
 * Provides console and localStorage logging with different levels
 */

// Log Levels
export const LogLevel = {
    DEBUG: 'DEBUG',
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
};

// Log Level Priority (for filtering)
const LOG_PRIORITY = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
};

// Configuration
const CONFIG = {
    enableConsole: true,
    enableLocalStorage: true,
    maxStoredLogs: 100,
    minLogLevel: LogLevel.DEBUG,
    storageKey: 'priyopixcel_logs',
};

/**
 * Format log entry
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} metadata - Additional metadata
 * @returns {Object} Formatted log entry
 */
const formatLogEntry = (level, message, metadata = {}) => {
    return {
        timestamp: new Date().toISOString(),
        level,
        message,
        metadata,
        url: window.location.href,
        userAgent: navigator.userAgent,
    };
};

/**
 * Save log to localStorage
 * @param {Object} logEntry - Log entry
 */
const saveToStorage = (logEntry) => {
    if (!CONFIG.enableLocalStorage) return;

    try {
        const logs = getStoredLogs();
        logs.push(logEntry);

        // Keep only the most recent logs
        const trimmedLogs = logs.slice(-CONFIG.maxStoredLogs);

        localStorage.setItem(CONFIG.storageKey, JSON.stringify(trimmedLogs));
    } catch (error) {
        console.warn('Failed to save log to localStorage:', error);
    }
};

/**
 * Get stored logs from localStorage
 * @returns {Array} Array of log entries
 */
export const getStoredLogs = () => {
    try {
        const stored = localStorage.getItem(CONFIG.storageKey);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.warn('Failed to retrieve logs from localStorage:', error);
        return [];
    }
};

/**
 * Clear stored logs
 */
export const clearStoredLogs = () => {
    try {
        localStorage.removeItem(CONFIG.storageKey);
    } catch (error) {
        console.warn('Failed to clear logs from localStorage:', error);
    }
};

/**
 * Export logs as JSON
 * @returns {string} JSON string of logs
 */
export const exportLogs = () => {
    const logs = getStoredLogs();
    return JSON.stringify(logs, null, 2);
};

/**
 * Download logs as a file
 */
export const downloadLogs = () => {
    const logs = exportLogs();
    const blob = new Blob([logs], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `priyopixcel-logs-${new Date().toISOString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

/**
 * Core logging function
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} metadata - Additional metadata
 */
const log = (level, message, metadata = {}) => {
    // Check if log level meets minimum threshold
    if (LOG_PRIORITY[level] < LOG_PRIORITY[CONFIG.minLogLevel]) {
        return;
    }

    const logEntry = formatLogEntry(level, message, metadata);

    // Console logging with styling
    if (CONFIG.enableConsole) {
        const styles = {
            DEBUG: 'color: #666; font-weight: normal',
            INFO: 'color: #2196F3; font-weight: normal',
            WARN: 'color: #FF9800; font-weight: bold',
            ERROR: 'color: #F44336; font-weight: bold',
        };

        const style = styles[level] || '';
        console.log(
            `%c[${level}] ${message}`,
            style,
            metadata
        );

        // Also log stack trace for errors
        if (level === LogLevel.ERROR && metadata.error?.stack) {
            console.error(metadata.error.stack);
        }
    }

    // Storage logging
    saveToStorage(logEntry);
};

/**
 * Debug level logging
 * @param {string} message - Log message
 * @param {Object} metadata - Additional metadata
 */
export const debug = (message, metadata = {}) => {
    log(LogLevel.DEBUG, message, metadata);
};

/**
 * Info level logging
 * @param {string} message - Log message
 * @param {Object} metadata - Additional metadata
 */
export const info = (message, metadata = {}) => {
    log(LogLevel.INFO, message, metadata);
};

/**
 * Warning level logging
 * @param {string} message - Log message
 * @param {Object} metadata - Additional metadata
 */
export const warn = (message, metadata = {}) => {
    log(LogLevel.WARN, message, metadata);
};

/**
 * Error level logging
 * @param {string} message - Log message
 * @param {Error|Object} error - Error object or metadata
 */
export const error = (message, errorOrMetadata = {}) => {
    const metadata = errorOrMetadata instanceof Error
        ? {
            error: errorOrMetadata,
            message: errorOrMetadata.message,
            stack: errorOrMetadata.stack,
        }
        : errorOrMetadata;

    log(LogLevel.ERROR, message, metadata);
};

/**
 * Performance timing logger
 * @param {string} label - Timer label
 * @returns {Function} End function to call when complete
 */
export const startTimer = (label) => {
    const startTime = performance.now();

    return () => {
        const endTime = performance.now();
        const duration = endTime - startTime;

        info(`Performance: ${label}`, {
            duration: `${duration.toFixed(2)}ms`,
            startTime,
            endTime,
        });

        return duration;
    };
};

/**
 * Configure logger
 * @param {Object} config - Configuration options
 */
export const configure = (config) => {
    Object.assign(CONFIG, config);
};

/**
 * Get current configuration
 * @returns {Object} Current configuration
 */
export const getConfig = () => {
    return { ...CONFIG };
};

export default {
    LogLevel,
    debug,
    info,
    warn,
    error,
    startTimer,
    configure,
    getConfig,
    getStoredLogs,
    clearStoredLogs,
    exportLogs,
    downloadLogs,
};
