import { Module } from '@nestjs/common';
import { CommonApiService } from './common-api.service';
import { CommonApiController } from './common-api.controller';

@Module({
  providers: [CommonApiService],
  controllers: [CommonApiController]
})
export class CommonApiModule {}
