import { Injectable, Logger } from '@nestjs/common';

/**
 * Servicio centralizado de logging
 * Proporciona métodos para loguear información, advertencias, errores, etc.
 */
@Injectable()
export class LoggerService {
  private logger = new Logger();

  /**
   * Información general
   */
  info(context: string, message: string, data?: any) {
    const prefix = `[${context}]`;
    if (data) {
      this.logger.log(`${prefix} ${message}`, JSON.stringify(data, null, 2));
    } else {
      this.logger.log(`${prefix} ${message}`);
    }
  }

  /**
   * Advertencias
   */
  warn(context: string, message: string, data?: any) {
    const prefix = `[${context}]`;
    if (data) {
      this.logger.warn(`${prefix} ${message}`, JSON.stringify(data, null, 2));
    } else {
      this.logger.warn(`${prefix} ${message}`);
    }
  }

  /**
   * Errores
   */
  error(context: string, message: string, error?: any) {
    const prefix = `[${context}]`;
    if (error) {
      this.logger.error(
        `${prefix} ${message}`,
        error instanceof Error ? error.stack : JSON.stringify(error, null, 2),
      );
    } else {
      this.logger.error(`${prefix} ${message}`);
    }
  }

  /**
   * Debug - Solo se muestra en desarrollo
   */
  debug(context: string, message: string, data?: any) {
    const prefix = `[${context}]`;
    if (data) {
      this.logger.debug(`${prefix} ${message}`, JSON.stringify(data, null, 2));
    } else {
      this.logger.debug(`${prefix} ${message}`);
    }
  }

  /**
   * Verbose - Para información muy detallada
   */
  verbose(context: string, message: string, data?: any) {
    const prefix = `[${context}]`;
    if (data) {
      this.logger.verbose(`${prefix} ${message}`, JSON.stringify(data, null, 2));
    } else {
      this.logger.verbose(`${prefix} ${message}`);
    }
  }
}
