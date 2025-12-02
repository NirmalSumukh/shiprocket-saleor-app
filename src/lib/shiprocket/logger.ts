type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private level: LogLevel;

  constructor() {
    this.level = (process.env.LOG_LEVEL as LogLevel) || 'info';
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.level);
  }

  debug(message: string, meta?: any) {
    if (this.shouldLog('debug')) {
      console.debug('[ShipRocket Debug]', message, meta || '');
    }
  }

  info(message: string, meta?: any) {
    if (this.shouldLog('info')) {
      console.info('[ShipRocket Info]', message, meta || '');
    }
  }

  warn(message: string, meta?: any) {
    if (this.shouldLog('warn')) {
      console.warn('[ShipRocket Warn]', message, meta || '');
    }
  }

  error(message: string, error?: any) {
    if (this.shouldLog('error')) {
      console.error('[ShipRocket Error]', message, error || '');
    }
  }
}

export const logger = new Logger();
