import { Module } from '@nestjs/common';
import { AuthModule } from './app/auth/auth.module';
import { PrismaModule } from './app/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './app/admin/admin.module';
import { CommonApiModule } from './app/common-api/common-api.module';



@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}),AuthModule, PrismaModule, AdminModule, CommonApiModule ],
  controllers: [],
  providers: [],
})
export class AppModule {}
