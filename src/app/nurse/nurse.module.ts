import { Module } from '@nestjs/common';
import { NurseController } from './nurse.controller';
import { NurseService } from './nurse.service';

@Module({
  controllers: [NurseController],
  providers: [NurseService]
})
export class NurseModule {}
