import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { LoggerService } from '../../common/logger';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private logger: LoggerService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/api/v1/auth/google/callback',
      scope: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;

    this.logger.debug('GoogleStrategy', 'Google profile recibido', {
      googleId: id,
      email: emails[0].value,
      name: `${name.givenName} ${name.familyName}`,
    });

    const user = {
      googleId: id,
      email: emails[0].value,
      username: emails[0].value.split('@')[0],
      name: `${name.givenName} ${name.familyName}`,
      picture: photos[0]?.value,
    };

    this.logger.info('GoogleStrategy', 'Usuario validado desde Google', {
      email: user.email,
      googleId: user.googleId,
    });

    done(null, user);
  }
}
