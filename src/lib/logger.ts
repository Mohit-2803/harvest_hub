type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  ip?: string;
  timestamp?: string;
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  
  private formatMessage(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString();
    const baseLog = {
      level,
      message,
      timestamp,
      environment: process.env.NODE_ENV,
      ...context
    };
    
    return baseLog;
  }

  private log(level: LogLevel, message: string, context?: LogContext) {
    const formattedLog = this.formatMessage(level, message, context);
    
    // In development, use console methods for better DX
    if (this.isDevelopment) {
      switch (level) {
        case 'error':
          console.error('🚨 [ERROR]', message, context || '');
          break;
        case 'warn':
          console.warn('⚠️ [WARN]', message, context || '');
          break;
        case 'debug':
          console.debug('🐛 [DEBUG]', message, context || '');
          break;
        default:
          console.log('ℹ️ [INFO]', message, context || '');
      }
    } else {
      // In production, use structured logging
      console.log(JSON.stringify(formattedLog));
    }
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error | unknown, context?: LogContext) {
    const errorContext = {
      ...context,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error
    };
    
    this.log('error', message, errorContext);
  }

  debug(message: string, context?: LogContext) {
    if (this.isDevelopment || process.env.DEBUG === 'true') {
      this.log('debug', message, context);
    }
  }

  // Specific logging methods for common use cases
  auth = {
    loginAttempt: (email: string, success: boolean, context?: Omit<LogContext, 'userId'>) => {
      this.info(`Login attempt for ${email}: ${success ? 'SUCCESS' : 'FAILED'}`, {
        ...context,
        email,
        success,
        action: 'login_attempt'
      });
    },

    registerAttempt: (email: string, role: string, success: boolean, context?: LogContext) => {
      this.info(`Registration attempt for ${email} as ${role}: ${success ? 'SUCCESS' : 'FAILED'}`, {
        ...context,
        email,
        role,
        success,
        action: 'register_attempt'
      });
    },

    logout: (userId: string, context?: LogContext) => {
      this.info('User logged out', {
        ...context,
        userId,
        action: 'logout'
      });
    }
  };

  api = {
    request: (method: string, url: string, userId?: string, context?: LogContext) => {
      this.debug(`API ${method} ${url}`, {
        ...context,
        method,
        url,
        userId,
        action: 'api_request'
      });
    },

    error: (method: string, url: string, error: Error | unknown, context?: LogContext) => {
      this.error(`API ${method} ${url} failed`, error, {
        ...context,
        method,
        url,
        action: 'api_error'
      });
    }
  };

  database = {
    query: (operation: string, model: string, context?: LogContext) => {
      this.debug(`Database ${operation} on ${model}`, {
        ...context,
        operation,
        model,
        action: 'db_query'
      });
    },

    error: (operation: string, model: string, error: Error | unknown, context?: LogContext) => {
      this.error(`Database ${operation} on ${model} failed`, error, {
        ...context,
        operation,
        model,
        action: 'db_error'
      });
    }
  };
}

// Export singleton instance
export const logger = new Logger();

// Export types for use in other files
export type { LogContext, LogLevel };
