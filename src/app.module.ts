import { Module } from '@nestjs/common';
import { AuthModule } from './app/auth/auth.module';
import { PrismaModule } from './app/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './app/admin/admin.module';
import { CommonApiModule } from './app/common-api/common-api.module';
import { UserModule } from './app/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard, RolesGuard } from './common/guards';
import { DoctorModule } from './app/doctor/doctor.module';
import { ReceptionistModule } from './app/receptionist/receptionist.module';
import { PharmacistModule } from './app/pharmacist/pharmacist.module';
import { NurseModule } from './app/nurse/nurse.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    AdminModule,
    CommonApiModule,
    UserModule,
    DoctorModule,
    ReceptionistModule,
    PharmacistModule,
    NurseModule,
  ],
  controllers: [],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
})
export class AppModule {}
