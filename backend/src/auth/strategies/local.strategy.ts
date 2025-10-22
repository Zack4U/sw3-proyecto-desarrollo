import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { LoggerService } from '../../common/logger';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    private authService: AuthService,
    private logger: LoggerService,
  ) {
    super({
      usernameField: 'identifier',
      passwordField: 'password',
    });
  }

  async validate(identifier: string, password: string): Promise<any> {
    this.logger.debug('LocalStrategy', 'Validando credenciales', {
      identifier: identifier.substring(0, 3) + '***', // Ocultar por seguridad
    });

    try {
      const user = await this.authService.validateUser(identifier, password);
      this.logger.info('LocalStrategy', 'Usuario autenticado exitosamente', {
        email: user.email,
        role: user.role,
      });
      return user;
    } catch (error) {
      this.logger.warn('LocalStrategy', 'Error en validación de credenciales', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}
