import { Controller, Get } from '@nestjs/common';
import { CommonApiService } from './common-api.service';

@Controller()
export class CommonApiController {
  constructor(private commonApiService: CommonApiService) {}

  @Get('departments')
  getAllDepartments() {
    return this.commonApiService.getAllDepartments();
  }
}
