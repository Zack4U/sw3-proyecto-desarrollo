import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { LoggerService } from '../../common/logger';

interface JwtPayload {
  sub: string;
  email: string;
  username?: string;
  role?: string;
  isActive?: boolean;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private logger: LoggerService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key-change-this',
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    this.logger.debug('JwtStrategy', 'Token validado exitosamente', {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      isActive: payload.isActive,
    });

    return {
      userId: payload.sub,
      email: payload.email,
      username: payload.username,
      role: payload.role,
      isActive: payload.isActive,
    };
  }
}
