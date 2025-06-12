import { Controller, Get, UseGuards } from '@nestjs/common';
import { CommonApiService } from './common-api.service';
import { JwtAuthGuard } from 'src/common/guards';

@Controller()
@UseGuards(JwtAuthGuard)
export class CommonApiController {
  constructor(private commonApiService: CommonApiService) {}

  @Get('departments')
  getAllDepartments() {
    return this.commonApiService.getAllDepartments();
  }
}
