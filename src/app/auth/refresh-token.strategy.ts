import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: configService.get<string>('REFRESH_TOKEN_SECRET', {
        infer: true,
      })!,
      passReqToCallback: true,
    });
  }

  async validate(req, payload: any) {
    return { ...payload, refreshToken: req.body.refreshToken };
  }
}
