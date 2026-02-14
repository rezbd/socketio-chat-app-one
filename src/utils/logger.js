const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

/**
 * Get formatted timestamp
 */
const getTimestamp = () => {
  return new Date().toISOString();
};

/**
 * Log info message
 */
const info = (message, data = null) => {
  console.log(
    `${colors.blue}[INFO]${colors.reset} ${getTimestamp()} - ${message}`,
    data ? data : ''
  );
};

/**
 * Log success message
 */
const success = (message, data = null) => {
  console.log(
    `${colors.green}[SUCCESS]${colors.reset} ${getTimestamp()} - ${message}`,
    data ? data : ''
  );
};

/**
 * Log warning message
 */
const warn = (message, data = null) => {
  console.warn(
    `${colors.yellow}[WARN]${colors.reset} ${getTimestamp()} - ${message}`,
    data ? data : ''
  );
};

/**
 * Log error message
 */
const error = (message, error = null) => {
  console.error(
    `${colors.red}[ERROR]${colors.reset} ${getTimestamp()} - ${message}`,
    error ? error : ''
  );
};

/**
 * Log debug message (only in development)
 */
const debug = (message, data = null) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(
      `${colors.magenta}[DEBUG]${colors.reset} ${getTimestamp()} - ${message}`,
      data ? data : ''
    );
  }
};

module.exports = {
  info,
  success,
  warn,
  error,
  debug,
};