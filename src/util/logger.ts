import logger from 'jet-logger';

/**
 * Print an error object to the console if it's truthy. Useful for testing.
 *
 * @param err
 */
export function logError(err?: Error): void {
	if (!!err) {
		logger.err(err);
	}
}

/**
 * Log an info message to the console
 * @param message
 */
export function log(message: any): void {
	logger.info(message);
}
