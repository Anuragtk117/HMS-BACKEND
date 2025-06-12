import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
  controllers: [AdminController],
  providers: [AdminService, JwtStrategy],
})
export class AdminModule {}
