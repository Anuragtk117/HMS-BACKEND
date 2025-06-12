import { Module } from '@nestjs/common';
import { PharmacistService } from './pharmacist.service';
import { PharmacistController } from './pharmacist.controller';

@Module({
  providers: [PharmacistService],
  controllers: [PharmacistController]
})
export class PharmacistModule {}
