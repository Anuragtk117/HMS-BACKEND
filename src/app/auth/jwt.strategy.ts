import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET', { infer: true })!,
    });
  }
  async validate(payload: any) {
    if (!payload) {
      throw new UnauthorizedException('Invalid token');
    }

    const activeSession = await this.prisma.loginSessions.findUnique({
      where: {
        sessionId: payload.sessionId,
        isActive: true,
        userId: payload.sub,
      },
    });

    if (!activeSession) {
      throw new ForbiddenException('Session Expired or user logged out');
    }

    return {
      sub: payload.sub,
      email: payload.email,
      sessionId: payload.sessionId,
      role: payload.role,
    };
  }
}
